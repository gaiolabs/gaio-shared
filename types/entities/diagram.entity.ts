import type { FieldType } from '../core/field.type'
import type { GenericType } from '../generic.type'

export type DiagramNodeType = Partial<{
	id: string
	position: {
		x: number
		y: number
	}
	data: {
		label: string
		tableName: string
		databaseName: string
		color: string
		fields: FieldType[]
	}
	type: string
}>

export type DiagramEdgeType = Partial<{
	id: string
	source: string
	target: string
	type: string
	targetHandle: string
	sourceHandle: string
	animated: boolean
	data: {
		joinType: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL'
		relationType: '1:1' | '1:N' | 'N:N'
	}
}>

export type DiagramWorkflowType = { nodes: DiagramNodeType[]; edges: DiagramEdgeType[] }

export type DiagramType = Partial<{
	diagramId: string
	appId: string
	name: string
	type: string
	description: string
	options: GenericType
	workflow: DiagramWorkflowType
	createdAt: string
	updatedAt: string
	modifiedBy: string
	createdBy: string
}>
