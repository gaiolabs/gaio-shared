import { spawn } from 'child_process'
import type { GenericType } from '@gaio/types'

const resultsHandler = (code: number, name: string, error: string, result: GenericType) => {
    if (code <= 0) {
        if (error && `${error}`.includes('discrepancy between DBTIMEZONE')) {
            result.message = 'Success'
        } else if (error && !error.includes('snowflake') && name === 'Query execution on source') {
            passwordErrorsHandler(error, name, result)
        } else {
            result.message = 'Success'
        }
    } else {
        if (`${error}`.includes('discrepancy between DBTIMEZONE')) {
            result.message = 'Success'
        } else {
            passwordErrorsHandler(error, name, result)
        }
    }
    return result
}

const passwordErrorsHandler = (error: string, name: string, result: GenericType) => {
    if (`${error}`.includes('password')) {
        result = {
            code: name,
            message: 'Error suppressed. Error to connect with the given credentials '
        }
    } else {
        result = {
            code: name,
            message: `${error}`.replace('password', '')
        }
    }
    return result
}

export const shell = async (name: string, task: string, args: string[] = []) => {
    const terminal = spawn(task, args, {
        shell: true,
        detached: false
    })

    const finalResult = await new Promise((resolve, reject) => {
        let error = ''
        terminal.stderr.on('data', (data: Buffer) => {
            const base = Buffer.from(data)
            error += ` ${base.toString()} `
            error = error.slice(error.length - 44145)
        })

        terminal.stdout.on('data', (data: Buffer) => {
            const base = Buffer.from(data)

            if (` ${base.toString()} `.includes('MemoryError')) {
                error += ` Memory high usage. `
                error = error.slice(error.length - 44145)
            }
            return data
        })

        const result = { message: '', code: '' }

        terminal.on('exit', (code: number) => {
            resultsHandler(code, name, error, result)
        })

        terminal.on('close', () => {
            terminal.unref()
            terminal.stdout.removeAllListeners()
            terminal.stderr.removeAllListeners()
            terminal.removeAllListeners()

            if (result.message === 'Success') {
                resolve(result)
            } else {
                reject(result)
            }
        })
    })

    terminal.kill()
    return finalResult
}
