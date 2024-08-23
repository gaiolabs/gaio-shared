export const throwError = (errorData: Record<string, unknown>) => {
    let message = errorData.message || 'Unknown error'

    if (errorData.ref) {
        message = `${errorData.ref}: ${errorData.message}`
    }

    throw new Error(message as string)
}
