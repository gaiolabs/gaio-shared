import type { TaskType } from '../tasks/task.type'
import type { FindConflictingTypes } from './type-conflicts'

type TaskConflicts = FindConflictingTypes<TaskType>