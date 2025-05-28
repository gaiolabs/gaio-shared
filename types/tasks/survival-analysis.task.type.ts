import { type CommonTaskType } from './common.task.type'
import type {FieldType} from "../core/field.type";

export type SurvivalAnalysisTaskType = Partial<{
    columns: FieldType[]
    startColumn?: string
    stopColumn: string
    eventColumn: string
    excludeColumns: string[]
    ties: string
    type: 'coxph'
}> & CommonTaskType
