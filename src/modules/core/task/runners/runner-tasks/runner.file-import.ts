import { statSync } from 'fs'
import { join } from 'path'
import { inspect } from 'util'
import type { FileImportTaskType, ParamType, TaskContextType } from '@gaio/types'
import directoryTree from 'directory-tree'
import { cloneDeep } from 'lodash-es'
import { RepoModel } from '../../../../../models'
import { shell } from '../runner.shell'
import {
    changeEncoding,
    createTableAtBucket,
    dropTableIfExist,
    generateClickhouseColumnTypes,
    logComment,
    removeLocal,
    tableCanBeTemporary
} from '../runner.tools'
import { transform } from '../runner.transform'

const contentPath = join(__dirname, '..', '..', '..', '..', 'content')

const symbols = {
    none: '',
    doubleQuotes: `\"`,
    singleQuotes: `\'`,
    tab: '\t',
    newLine: `\n`,
    lfNewLine: `\n`,
    crNewLine: `\r`,
    crlfNewLine: '\r\n',
    semicolon: `;`,
    comma: `,`,
    pipe: `|`
}

export default async <T extends Partial<FileImportTaskType>>(
    taskData: T,
    params: ParamType[],
    taskContext: TaskContextType
) => {
    let file = undefined

    try {
        const { from, userId, sessionid } = taskContext

        if (tableCanBeTemporary(from)) {
            taskData.resultTable = `${taskData.resultTable}`.replace(/tmp_/g, `tmp_gaio${sessionid || userId}_`)
        }

        if (!taskData.append) {
            await dropTableIfExist(taskData)
        }

        await createTableAtBucket(taskData, generateClickhouseColumnTypes(taskData))

        if (taskData.splitFile) {
            return await chunkProcess(taskData)
        } else {
            file = fileLocation(taskData)

            if (taskData.fixEncoding) {
                await changeEncoding(file)
            }

            if (taskData.localPreparation) {
                await prepareBeforeImport(taskData, file)
            }

            return await rawInsert(taskData, file)
        }
    } catch (e) {
        await removeAll(fileTransformLocation(taskData))
        throw e
    }
}

const listFilesFromTheSplitProcess = async (taskData) => {
    const assetPath = contentPath + '/app/' + taskData.appId + '/inputs/' + taskData.id
    const tree = directoryTree(assetPath)
    tree.children.forEach((file, key) => {
        const stats = statSync(file.path)
        tree.children[key]['date'] = new Date(inspect(stats.mtime))
    })
    return tree
}

const chunkProcess = async (taskData: FileImportTaskType) => {
    let inputFormat: string

    if (taskData.fieldsTerminatedBy !== 'tab') {
        inputFormat = `${symbols[taskData.fieldsTerminatedBy]}`
    } else {
        inputFormat = `${symbols[taskData.fieldsTerminatedBy]}`
    }

    const directoryToSave = contentPath + '/app/' + taskData.appId + '/inputs/' + taskData.id

    const fromFile = fileLocation(taskData)

    if (taskData.fixEncoding) {
        await changeEncoding(fromFile)
    }

    await shell('split file into peaces', `xsv split -s 10000 -d "${inputFormat}"  ${directoryToSave} ${fromFile}`)

    const listFiles = await listFilesFromTheSplitProcess(taskData)
    taskData.fieldsTerminatedBy = 'comma'

    for (const file of listFiles.children) {
        if (taskData.localPreparation) {
            await prepareBeforeImport(cloneDeep(taskData), file.path)
        }
        await rawInsert(taskData, file.path)
    }

    return { status: 'done' }
}

const fileLocation = (taskData: FileImportTaskType, folder = '') => {
    console.log(folder)
    return contentPath + '/app/' + taskData.appId + '/inputs/' + taskData.fileName
}

const prepareBeforeImport = async (taskData: FileImportTaskType, file) => {
    const toFile = fileTransformLocation(taskData)

    await removeLocal([toFile])

    // if (taskData.transformFirst) {
    await transformFile(taskData, toFile)
    const fromFile = fileTransformLocation(taskData) + 't'
    taskData.fieldsTerminatedBy = 'comma'
    // }

    // check if user asks transformation
    const transformData = taskData.columns.some((o) => o.transform && o.transform !== 'nome')

    if (transformData) {
        taskData.columns.forEach((o) => {
            if ((o) => o.transform && o.transform !== 'nome') {
                o.toDataType = cloneDeep(o.dataType)
                o.dataType = 'Nullable(String)'
                o.extraOne = o.decimal
                o.extraTwo = o.columnLength
            }
        })
    }

    const columns = transform(taskData)

    const nextFields = columns.map((col) => {
        return `${col.mutation} as ${col.columnName}`
    })

    const previousFields = columns.map((o) => o.columnName + ' String')

    let inputFormat

    if (taskData.fieldsTerminatedBy !== 'tab') {
        inputFormat = `--input-format=CSVWithNames --format_csv_delimiter="${symbols[taskData.fieldsTerminatedBy]}"`
    } else {
        inputFormat = `--input-format=TabSeparatedWithNames`
    }

    await shell('when clickhouse-local run', `clickhouse-local`, [
        `--input_format_with_names_use_header=0`,
        '--format_csv_allow_single_quotes=1',
        '--date_time_input_format="best_effort"',
        '--input_format_null_as_default=1',
        '--input_format_defaults_for_omitted_fields=1',
        '--input_format_tsv_empty_as_default=1',
        // '--input_format_csv_unquoted_null_literal_as_null=1',
        inputFormat,
        `--file=${fromFile}`,
        `-S "${previousFields.join(',')}"`,
        '--output-format=TabSeparatedWithNames',
        `--query="select ${nextFields.join(',')} from table" > ${toFile}`
    ])

    file = toFile
    console.log(file)
    return { status: 'done' }
}

const rawInsert = async (taskData: FileImportTaskType, file) => {
    let repoData

    try {
        repoData = await RepoModel.getRepoCredentials(taskData)
    } catch (e) {
        throw { message: 'Error to get repo credentials' }
    }

    let inputFormat
    const csvDelimiter = `--format_csv_delimiter="${symbols[taskData.fieldsTerminatedBy]}"`

    if (taskData.localPreparation) {
        inputFormat = 'FORMAT TabSeparatedWithNames'
    } else if (taskData.fieldsTerminatedBy === 'tab') {
        inputFormat = 'FORMAT TabSeparatedWithNames'
    } else {
        inputFormat = `FORMAT CSVWithNames`
    }

    const query = `INSERT INTO ${taskData.databaseName}.${taskData.resultTable} ${inputFormat}`
    const fileToImport = file

    await shell('when clickhouse is uploading the file', `clickhouse-client`, [
        `--host=${repoData.host}`,
        `--user=${repoData.user}`,
        `--password=${repoData.password} `,
        logComment(taskData),
        '--date_time_input_format="best_effort"',
        '--input_format_null_as_default=1',
        '--format_csv_allow_single_quotes=1',
        '--input_format_defaults_for_omitted_fields=1',
        '--input_format_tsv_empty_as_default=1',
        '--input_format_with_names_use_header=0',
        csvDelimiter,
        `--query="${query}"`,
        `< ${fileToImport}`
    ])

    if (taskData.localPreparation) {
        await removeAll(fileToImport)
    }

    return { status: 'done' }
}

const fileTransformLocation = (taskData: FileImportTaskType) => {
    return contentPath + '/app/' + taskData.appId + '/inputs/transformed_' + taskData.fileName
}

const transformFile = async (taskData: FileImportTaskType, file: string) => {
    const input = file
    const output = fileTransformLocation(taskData) + 't'
    await removeLocal([output])

    let inputTerminatedBy
    if (taskData.fieldsTerminatedBy === 'tab') {
        inputTerminatedBy = `tab`
    } else {
        inputTerminatedBy = `${symbols[taskData.fieldsTerminatedBy]}`
    }

    await shell(
        'Transform file - scrub the file',
        `scrubcsv -q -d "${inputTerminatedBy}" ${input} | sed "s/'/′/g"  > ${output}`,
        []
    )

    return { status: 'done' }
}

const removeAll = async (outputFile: string) => {
    await removeLocal([outputFile.replace('.csv', ''), outputFile, outputFile + 't'])
}
