import type { TaskType } from '../tasks/task.type'
import type { FindConflictingTypes } from './type-conflicts'

export type TaskConflicts = FindConflictingTypes<TaskType>