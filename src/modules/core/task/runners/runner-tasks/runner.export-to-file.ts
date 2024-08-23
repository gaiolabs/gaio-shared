import { exec, spawn } from 'child_process'
import { join } from 'path'
import type { ExportToFileType } from '@gaio/types'
import { ensureDirSync, remove } from 'fs-extra'
import { RepoModel } from '../../../../../models'
import { logComment } from '../runner.tools'

const contentPath = join(__dirname, '..', '..', '..', '..', 'content')

export default async <T extends Partial<ExportToFileType>>(taskData: T) => {
    ensureDirSync(contentPath + '/app/' + taskData.appId + '/outputs/')

    const outputPath = contentPath + '/app/' + taskData.appId + '/outputs'
    const outputFile = `${outputPath}/${taskData.tableName}.csv`
    const outputFileZip = `${outputPath}/${taskData.tableName}.zip`

    await remove(outputFile)
    await remove(outputFileZip)

    const repoData = await RepoModel.getRepoCredentials(taskData)

    let separator = ''

    if (taskData.separator) {
        separator = `--format_csv_delimiter="${taskData.separator}"`
    }

    const query = [
        'clickhouse-client',
        logComment(taskData),
        `--host=${repoData.host}`,
        `--user=${repoData.user}`,
        `--password=${repoData.password}`,
        separator,
        `--query="SELECT * FROM ${taskData.databaseName}.${taskData.tableName} FORMAT CSVWithNames" | sed 's/\\\\N/\"\"/g'  > ${outputFile}`
    ]

    const shell = spawn(query.join(' '), [], {
        shell: true,
        detached: false
    })

    let error = ''

    shell.stderr.on('data', (data) => {
        const err = Buffer.from(data)
        error += err.toString()
    })

    shell.stdout.on('data', () => {})

    await new Promise((resolve, reject) => {
        if (shell.stderr) {
            reject({
                message: 'Error while exporting.' + error
            })
        } else {
            if (!taskData.compress) {
                resolve({ message: 'Success to export' })
            } else {
                exec(`cd ${outputPath}; zip -r ${taskData.tableName}.zip ${taskData.tableName}.csv`, (errZip) => {
                    if (errZip) {
                        reject({
                            error: true,
                            message: 'File exported, but cant compress it (Zip File)'
                        })
                    }
                    resolve({
                        message: 'Success to export and compress file'
                    })
                })
            }
        }
    })

    // make file charset
    // await this.changeEncoding(outputFile)

    //      public async changeEncoding(fileLocation) {
    //         return await this.shell('transform encoding', `vim +"set nobomb | set fenc=utf8 | x" ${fileLocation}`, []);
    //     }

    return { status: 'done' }
}
