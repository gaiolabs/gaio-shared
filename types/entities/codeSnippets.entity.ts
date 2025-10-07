/**
 * @description Refers to the "code snippets" schema from database
 */
export type CodeSnippetsEntity = {
	codeSnippetId: string
	appId: string
	flowId: string
	codeSnippet: string
	createdBy: string
	createdAt: Date
	updatedBy: string
	updatedAt: string
}
