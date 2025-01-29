import { type CommonTaskType } from './common.task.type'

export type PythonTaskType = Partial<{
    body: string
    codeSnippetId: string
    codeSnippet: string
    envCodeSnippetId: string
    envCodeSnippet: string    
    type: 'python'
}> &
    CommonTaskType
