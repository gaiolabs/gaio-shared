export type GenericType = {
    [k: string]: unknown | GenericType
    type?: string
}
