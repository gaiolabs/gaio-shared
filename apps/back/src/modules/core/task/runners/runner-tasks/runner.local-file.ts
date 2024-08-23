import { spawn } from 'child_process'
import { statSync } from 'fs'
import type { LocalFileTaskType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { readdir, move, ensureDirSync } from 'fs-extra'
import { RepoModel } from '../../../../../models'
import { shell } from '../runner.shell'
import {
    contentFolder,
    createTableAtBucket,
    dropTableIfExist,
    generateClickhouseColumnTypes,
    logComment,
    removeLocal
} from '../runner.tools'

export default async <T extends LocalFileTaskType>(taskData: T) => {
    if (!taskData.insertMode) {
        await dropTableIfExist(taskData)
    }

    const importFolder = `${contentFolder()}/app/${taskData.appId}/imports`

    ensureDirSync(importFolder)

    const filePath = `${importFolder}/${taskData.folderPath}`
    const files: string[] = await listFilesFromFolder(filePath)

    const csvFiles = files.filter((file) => file.endsWith('.csv')).sort((a, b) => a.localeCompare(b))

    if (taskData.fileFormatType === 'TabSeparatedWithNames') {
        taskData.fileFormatType = `\\t`
    } else if (taskData.fileFormatType === 'CSVWithNames') {
        taskData.fileFormatType = ','
    } else if (taskData.fileFormatType?.toLowerCase() === 'pipe') {
        taskData.fileFormatType = '|'
    }

    for (const file of csvFiles) {
        const fileFinalPath = `${filePath}/${file}`

        try {
            const query = `cat ${fileFinalPath} | scrubcsv --replace-newlines --null '(?i)NULL' -q -d "${taskData.fileFormatType}" | sed "s/'/′/g"  `

            await bringData(taskData, fileFinalPath, query)

            if (taskData.deleteAfterImport) {
                await removeLocal([fileFinalPath])
            } else {
                await move(fileFinalPath, `${filePath}/imported/${file}`)
            }
        } catch (error) {
            if (taskData.deleteAfterImport) {
                await removeLocal([fileFinalPath])
            } else {
                await move(fileFinalPath, `${filePath}/error/${file}`)
            }

            throw {
                error: true,
                message: error.message
            }
        }
    }

    return {
        status: 'done'
    }
}

const bringData = async (taskData, fileFinalPath, clientQuery) => {
    const repoData = await RepoModel.getRepoCredentials(taskData)

    let structure = []
    let fields = []

    const { size } = statSync(fileFinalPath)

    if (!size) {
        throw { message: 'No data to relate columns and insert data' }
    }

    const terminal = spawn(
        `cat ${fileFinalPath} | scrubcsv --replace-newlines --null '(?i)NULL' -q -d "${taskData.fileFormatType}" | sed "s/'/′/g" | gocsv describe `,
        {
            detached: true,
            shell: true
        }
    )

    const dt: string = await new Promise((resolve) => {
        let values = ''
        terminal.stdout.on('data', (data) => {
            values += Buffer.from(data)
        })

        terminal.on('exit', () => {
            resolve(values)
        })
    })

    const types = dt
        .split('\n')
        .filter((o) => o.trim().startsWith('Type:'))
        .map((o) => o.trim().replace('Type: ', ''))

    fields = dt
        .split('Columns:')[2]
        .split('\n')
        .filter((o) => o)
        .map((o) => o.replace('Type: ', '').trim())
        .filter((o) => o.includes(':'))
        .map((o) => {
            return o.split(':')[1].trim()
        })

    structure = fields.map((field) => {
        return `${field} String`
    })

    const columns = fields.map((field, index) => {
        let t = ''

        if (taskData.schemaInference === 'noSchemaInference') {
            t = 'String'
        } else {
            if (types[index] === 'string') {
                t = 'String'
            } else if (types[index] === 'int') {
                t = 'Int64'
            } else if (types[index] === 'float') {
                t = 'Float64'
            } else if (types[index] === 'date') {
                t = 'String'
            } else if (types[index] === 'datetime') {
                t = 'DateTime'
            } else {
                t = 'String'
            }
        }

        return {
            columnName: field,
            dataType: t,
            columnLength: 2
        }
    })

    fields = fields.map((o, i) => {
        if (taskData.schemaInference != 'noSchemaInference') {
            if (types[i] === 'date') {
                return `((substring(if(empty(${o}), null, ${o}), 1, 10)))  as ${o}`
            } else if (types[i] === 'datetime') {
                return `(substring(if(empty(${o}), null, ${o}), 1, 19)) as ${o}`
            }
        }
        return o
    })

    await createTableAtBucket(
        taskData,
        generateClickhouseColumnTypes({
            ...taskData,
            schema: null,
            columns: columns.map((o) => {
                return {
                    columnName: o.columnName.replace(/[^a-zA-Z0-9_]/g, '_'),
                    dataType: o.dataType,
                    columnLength: o.columnLength
                }
            })
        })
    )

    const query = `insert into ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable}  FORMAT TSV`

    const localArgs = [
        '|',
        `clickhouse-local`,
        `--input-format="CSVWithNames"`,
        `--output-format="TabSeparated"`,
        `--structure="${structure.join(',')}"`,
        `--query="select ${fields.join(',')} from table"`,
        '|',
        'gocsv behead -n 1',
        '|',
        'clickhouse-client',
        `--host=${repoData.host}`,
        `--user=${repoData.user}`,
        `--password=${repoData.password} `,
        logComment(taskData),
        '--format_csv_allow_single_quotes=1',
        '--date_time_input_format="best_effort"',
        '--input_format_null_as_default=1',
        '--input_format_defaults_for_omitted_fields=1',
        '--input_format_tsv_empty_as_default=1',
        `--query="${query}"`
    ]

    await shell('local treat data', clientQuery, [...localArgs])
}

const listFilesFromFolder = (folderPath: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        readdir(folderPath, (err, files) => {
            if (err) {
                reject({
                    error: true,
                    message: err.message
                })
            }
            resolve(files)
        })
    })
}
