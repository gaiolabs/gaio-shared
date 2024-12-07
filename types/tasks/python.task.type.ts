import { type CommonTaskType } from './common.task.type'

export type PythonTaskType = Partial<{
    body: string
    codeSnippetId: string
    envCodeSnippetId: string    
}> &
    CommonTaskType
