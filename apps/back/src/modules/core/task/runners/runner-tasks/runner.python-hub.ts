import { join } from 'path'
import type { ParamType, PythonHubTaskType, TaskContextType } from '@gaio/types'
import { ensureDirSync } from 'fs-extra'
import { RepoModel } from '../../../../../models'
import { createBashScriptEnvRunner, generateFile } from '../../../../../utils'
import { associationRulesScript } from '../../../../shared/python-content'
import { shell } from '../runner.shell'
import { removeLocal } from '../runner.tools'

export default async <T extends PythonHubTaskType>(taskData: T, params: ParamType[], taskContext: TaskContextType) => {
    const paths = pathNames(taskData)

    try {
        if (taskData.type === 'basket') {
            await associationRules(taskData, paths, taskContext)
        }
        await removeLocal([paths.envPath, paths.runnerPath])
    } catch (e) {
        await removeLocal([paths.envPath, paths.runnerPath])
        throw e
    }

    return { status: 'done' }
}

const associationRules = async (taskData: PythonHubTaskType, paths, taskContext) => {
    const repoData = await RepoModel.getRepoCredentials(taskData)
    const logComment = pyClientLogComment(taskData, taskContext)
    const scriptContent = associationRulesScript(repoData, taskData, logComment)
    await prepareScripts('env_mlxtend', scriptContent, paths)
    await shell('Running association rules', 'bash', [paths.envPath])
}

const prepareScripts = async (envKeyName, scriptContent, paths) => {
    ensureDirSync(paths.mainPath)
    await generateFile(paths.envPath, createBashScriptEnvRunner(envKeyName, paths.runnerPath))
    await generateFile(paths.runnerPath, scriptContent)
}

const pathNames = (taskData: PythonHubTaskType) => {
    const contentPath = join(__dirname, '..', '..', '..', '..', 'content')
    const mainPath = contentPath + '/python-hub/' + taskData.appId + '/basket'
    const envPath = mainPath + '/' + 'env_' + taskData.id + '.sh'
    const runnerPath = mainPath + '/' + 'run_' + taskData.id + '.py'

    return {
        mainPath,
        envPath,
        runnerPath
    }
}

const pyClientLogComment = (taskData: PythonHubTaskType, taskContext: TaskContextType) => {
    const { appId, id, runningFlowId, type } = taskData
    const { userId } = taskContext

    const gaioQt = {
        ref: 'gaio_qt',
        appId: appId || '',
        taskId: id || '',
        userId: userId || '',
        type: type || '',
        flowId: runningFlowId || ''
    }

    return `settings = {'log_comment':'${JSON.stringify(gaioQt)}'}`
}
