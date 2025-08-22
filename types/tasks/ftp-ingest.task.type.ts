import { type CommonTaskType } from './common.task.type'

export type FtpIngestTaskType = Partial<{
    type: 'ftpIngest'
    connection: {
        protocolType: 'ftp' | 'sftp'
        host: string
        port: number
        logonType: 'anonymous' | 'normal' | 'keyFile' | 'cifs'
        user: string
        password: string
        keyFilePath: string
    }
    storage: {
        fromPath: string
        toPath: string
    }
}> &
    CommonTaskType
