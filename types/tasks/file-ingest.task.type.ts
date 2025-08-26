import { type CommonTaskType } from './common.task.type'

export type FileIngestTaskType = Partial<{
    type: 'fileIngest'
    connection: {
        protocolType: 'ftp' | 'sftp' | 'cifs'
        host: string
        port: number
        logonType: 'anonymous' | 'normal' | 'keyFile'
        user: string
        password: string
        keyFilePath: string
    }
    storage: {
        remoteFileName: string
        localFileName: string
        remotePath: string
        localPath: string
    }
}> &
    CommonTaskType
