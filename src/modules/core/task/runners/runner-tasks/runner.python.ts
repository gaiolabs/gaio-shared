import { spawn } from 'child_process'
import { writeFile, readdir, stat, unlink, rmdir } from 'fs'
import { join } from 'path'
import type { ParamType, PythonTaskType, TaskContextType } from '@gaio/types'
import { ensureDirSync } from 'fs-extra'
import { dbGaio } from '../../../../../db/db.gaio'
import { RepoModel } from '../../../../../models'
import templateString from '../../../../../utils/templateString'
import { removeLocal } from '../runner.tools'

const contentPath = join(__dirname, '..', '..', '..', '..', 'content')
const generateFile = (path, data, opts = {}) =>
    new Promise((resolve, reject) => {
        writeFile(path, data, opts, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve({ status: 'saved' })
            }
        })
    })

export default async <T extends PythonTaskType>(taskData: T, params: ParamType[], taskContext: TaskContextType) => {
    taskData.body = await loadContentBody(taskData)

    await makeSureDirExist(taskData, 'runners/' + taskData.id)
    const bashScript = await preparePathFile(taskData, params)

    if (!taskData.body) {
        return sendMessage(taskData, 'error', 'Nothing to run', taskContext)
    }

    return await runPython(taskData, bashScript, taskContext)
}

const loadContentBody = async (taskData): Promise<string> => {
    const data = await dbGaio()
        .query('select body, role from content where ref = ?', { params: { ref: taskData.ref } })
        .then((res) => {
            if (res[0] && res[0].body) {
                return res[0]
            }
            return {
                body: ''
            }
        })

    if (data.role === 'session') {
        await dbGaio().query(`delete from content where ref = {ref: String}`, { params: { ref: taskData.ref } })
    }

    return data.body
}

const runPython = async (taskData, bashScript, taskContext) => {
    sendMessage(taskData, 'info', '🚀 Started! \n', taskContext)

    const finalPath = contentPath + '/envs/' + 'env_' + taskData.appId

    const shell = spawn(`bash`, [bashScript], {
        cwd: finalPath,
        shell: true
    })

    let error = ''

    shell.stdout.on('data', (data) => {
        sendMessage(taskData, 'info', data.toString(), taskContext)
    })

    shell.stderr.on('data', (data) => {
        const base = Buffer.from(data)
        if (error.length > 4414) {
            error = ''
        }
        error += ` ${base.toString()} `
    })

    const finalPathFolder = finalPath + '/runners/' + taskData.id

    return await new Promise((resolve, reject) => {
        shell.on('exit', (code) => {
            if (code <= 0) {
                removeLocal([finalPathFolder])
                removeFileTrash(taskData)
                sendMessage(taskData, 'info', '🐍 Ended', taskContext)
                resolve({ status: true })
            } else {
                removeLocal([finalPathFolder])
                removeFileTrash(taskData)
                sendMessage(taskData, 'error', error, taskContext)
                sendMessage(taskData, 'info', '🐍 Ended', taskContext)
                setTimeout(() => {
                    reject({
                        code: 'error',
                        message: `${error}`.replace('password', '')
                    })
                })
            }
        })
    })
}

const sendMessage = (taskData, type: string, data: string, taskContext: TaskContextType) => {
    if (taskContext.from === 'studio') {
        const finalPath = contentPath + '/envs/' + 'env_' + taskData.appId
        console.log(finalPath, 'finalPath')

        // send socket
        // this.taskSocket.server.sockets.emit(
        //     taskData.id,
        //     JSON.stringify({ code: type, data: `${data}`.replace(finalPath, '').replace(contentPath, '') })
        // )
    }
}

const renderParams = async (query, params) => {
    return templateString(query, params)
}

const preparePathFile = async (taskData, params) => {
    const assetsFolder = contentPath + '/app/' + taskData.appId + '/'

    const bashActivateEnv = contentPath + '/envs/' + 'env_' + taskData.appId + '/runners/' + taskData.id + '/start.sh'
    const scriptFile = contentPath + '/envs/' + 'env_' + taskData.appId + '/runners/' + taskData.id + '/main.py'
    let scriptBody = await renderParams(taskData.body, params)
    const repoConnectionBody = await prepareRepositoryConnection(taskData)

    const baseIdent = '@memory_limit()\ndef gaio_main():\n  ' + scriptBody.replace(/\n/g, '\n  ')

    scriptBody = `
import psutil
import functools

app_inputs = '${assetsFolder}/inputs'
app_outputs = '${assetsFolder}/outputs'
app_assets = '${assetsFolder}/assets'

def memory_limit(limit=0.8):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            process = psutil.Process()
            start_mem = process.memory_info().rss
            func(*args, **kwargs)
            end_mem = process.memory_info().rss
            mem_usage = end_mem - start_mem
            if mem_usage > limit * psutil.virtual_memory().total:
                raise MemoryError(f"MemoryError: Memory usage exceeded {limit*100:.2f}%")
        return wrapper
    return decorator
    
${repoConnectionBody} 

${baseIdent}

if __name__ == '__main__':
    gaio_main()`

    await generateFile(bashActivateEnv, createBashScriptFromContent('env_' + taskData.appId, scriptFile))
    await generateFile(scriptFile, scriptBody)

    return bashActivateEnv
}

const makeSureDirExist = async (taskData: PythonTaskType, path: string) => {
    ensureDirSync(contentPath + '/envs/' + 'env_' + taskData.appId + '/' + path)
}

const prepareRepositoryConnection = async (taskData) => {
    const credentials = await RepoModel.getRepoCredentials(taskData).then((result) => result[0])

    if (credentials) {
        const strRandoVariable = 'db_' + Math.random().toString(36).substring(7)

        let body = `import re \n 
import clickhouse_connect\n
import unicodedata \n`
        body += `${strRandoVariable} = clickhouse_connect.get_client(
                                                host='${credentials.host}', 
                                                username='app_${taskData.appId}', 
                                                password='${credentials.password}', 
                                                port=${credentials.port}, 
                                                database='bucket_${taskData.appId}')\n`

        body += `
class bucket:
    def query(str, parameters = None):
        result = ${strRandoVariable}.query(str, parameters)
        return result
    
    def query_df(str, parameters = None):
        result = ${strRandoVariable}.query_df(str, parameters)
        return result
        
    def command(str, parameters = None):
        result = ${strRandoVariable}.command(str, parameters)
        return result
    
    def insert_df(str, df):
        result = ${strRandoVariable}.insert(str, df)
        return result
        
    def select_df(table_name):
        result = ${strRandoVariable}.query_df(f"select * from {table_name}")
        return result
        
    def create_df(table_name, df):
        type_mapping = {
            "int64": "Nullable(Int64)",
            "float64": "Nullable(Float64)",
            "int8": "Nullable(Int64)",
            "int16": "Nullable(Int64)",
            "int32": "Nullable(Int64)",
            "float16": "Nullable(Float64)",
            "float32": "Nullable(Float64)"
        }

        drop_table_query = "DROP TABLE IF EXISTS " + table_name
        ${strRandoVariable}.command(drop_table_query)

        def remove_special_chars(text):
            text = re.sub(r'\\W+', '_', text)  # Replace special characters with underscore
            text = ''.join(c for c in unicodedata.normalize('NFKD', text) if not unicodedata.combining(c))  # Remove accents
            return text

        column_names = [remove_special_chars(name) for name in df.columns]

        column_definitions = [
            remove_special_chars(name) + " " + type_mapping.get(str(ctype), 'Nullable(String)')
            for name, ctype in zip(column_names, df.dtypes)]

        create_table_query = "CREATE TABLE " + table_name + " (" + ", ".join(column_definitions) + ") ENGINE = MergeTree() ORDER BY tuple();"
        ${strRandoVariable}.command(create_table_query)
    
    
    
    
        `
        return body
    }

    return ''
}

const createBashScriptFromContent = async (envKey, scriptFile) => {
    return [
        `#!/bin/bash`,
        `eval "$(pyenv init -)"`,
        `eval "$(pyenv virtualenv-init -)"`,
        `pyenv activate ${envKey}`,
        `python3 ${scriptFile}`
    ].join('\n')
}

const removeFileTrash = async (taskData) => {
    const folderPath = contentPath + '/envs/' + 'env_' + taskData.appId
    const filesToKeep = ['runners', 'assets', '.python-version'] // Replace with the filenames you want to keep

    readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err)
            return
        }

        files.forEach((filename) => {
            const filePath = join(folderPath, filename)
            if (!filesToKeep.includes(filename)) {
                stat(filePath, (err, stats) => {
                    if (err) {
                        console.error('Error retrieving file stats:', err)
                        return
                    }

                    if (stats.isFile()) {
                        unlink(filePath, (err) => {
                            if (err) {
                                console.error('Error deleting file:', err)
                            }
                        })
                    } else if (stats.isDirectory()) {
                        rmdir(filePath, {}, (err) => {
                            if (err) {
                                console.error('Error deleting directory:', err)
                            }
                        })
                    }
                })
            }
        })
    })
}
