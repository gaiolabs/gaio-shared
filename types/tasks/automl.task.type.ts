import { type CommonTaskType } from './common.task.type'

export type AutoMLTaskType = Partial<{
  settings: unknown
}> & CommonTaskType
