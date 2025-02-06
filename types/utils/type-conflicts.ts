type PropertyTypes<T> = {
    [P in keyof T]: T[P]
}

type UnionToIntersection<U> = 
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type FindConflictingTypes<T> = {
    [P in keyof UnionToIntersection<T>]: T extends any
        ? P extends keyof T
            ? T[P] extends PropertyTypes<UnionToIntersection<T>>[P]
                ? never
                : T[P]
            : never
        : never
}[keyof UnionToIntersection<T>]