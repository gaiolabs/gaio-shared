import { spawn } from 'child_process'
import type { GoogleSpreadsheetTaskType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { RepoModel } from '../../../../../models'
import { shell } from '../runner.shell'
import {
    cleanErrorAtCatch,
    dropTableIfExist,
    executeQuery,
    logComment,
    makeSureFolderExist,
    removeLocal,
    resourceFolder
} from '../runner.tools'

export default async <T extends Partial<GoogleSpreadsheetTaskType>>(taskData: T) => {
    const folder = `${resourceFolder}/${taskData.appId}`
    const filePath = `${folder}/${taskData.id}.tsv`
    makeSureFolderExist(folder)
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/e/${taskData.url}/pub?output=tsv`
    await shell('Download Google Spreadsheet', `curl -L ${spreadsheetUrl} > ${filePath}`)

    try {
        await clearCsvFile(filePath)

        if (!taskData.insertMode) {
            await dropTableIfExist(taskData)
            await createTableToByFirstLineOfCsv(`${folder}/${taskData.id}.tsv`, taskData)
        }

        const repoData = await RepoModel.getRepoCredentials(taskData)

        const query = `insert into ${getBucketNameFromAppId(taskData.appId)}.${
            taskData.resultTable
        } FORMAT CSVWithNames`
        const clientArgs = [
            `--host=${repoData.host}`,
            `--user=${repoData.user}`,
            `--password=${repoData.password} `,
            '--format_csv_allow_single_quotes=1',
            '--date_time_input_format="best_effort"',
            '--input_format_null_as_default=1',
            '--input_format_defaults_for_omitted_fields=1',
            '--input_format_tsv_empty_as_default=1',
            logComment(taskData),
            `--query='${query}'`,
            `<`,
            filePath
        ]

        await shell('import csv to repository', `clickhouse-client`, [...clientArgs])
        // await this.removeLocal([filePath]);

        return { status: 'success' }
    } catch (error) {
        return cleanErrorAtCatch(error)
    }
}

const clearCsvFile = async (filePath) => {
    await shell(
        'Clear CSV',
        `scrubcsv --null '(?i)NULL' -q -d "tab" ${filePath} | sed "s/'/′/g" > ${filePath}.back`,
        []
    )

    await removeLocal([filePath])
    await shell('rename file', `mv`, [filePath + '.back', filePath])
}

const createTableToByFirstLineOfCsv = async (filePath, taskData) => {
    const headersText = await new Promise((resolve, reject) => {
        const shell = spawn(`gocsv`, ['headers', `${filePath}`], {
            shell: true,
            detached: false
        })

        let error = ''

        shell.stderr.on('data', (data) => {
            const base = Buffer.from(data)
            if (error.length > 4414) {
                error = ''
            }
            error += ` ${base.toString()} `
        })

        let resultText = ''

        shell.stdout.on('data', (data) => {
            const base = Buffer.from(data)
            resultText += ` ${base.toString()} `
        })

        shell.on('exit', (code) => {
            if (code <= 0) {
                resolve(resultText)
            } else {
                reject({
                    code: 'error',
                    message: `${error}`.replace('password', '')
                })
            }
        })
    })

    const columns = `${headersText}`
        .trim()
        .split('\n')
        .map((o) => {
            return o.trim().split(' ')[1]
        })
        .map((o) => `${o.trim()} Nullable(String)`)
        .join(', ')

    await executeQuery({
        at: taskData,
        sql: `
                CREATE TABLE
                    ${taskData.resultDatabase}.${taskData.resultTable} 
                    (${columns})
                ENGINE = MergeTree ORDER BY tuple()
               `
    })
}
