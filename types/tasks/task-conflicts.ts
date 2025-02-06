import type { TaskType } from './task.type'
import type { FindConflictingTypes } from '../utils/type-conflicts'

type Conflicts = FindConflictingTypes<TaskType>