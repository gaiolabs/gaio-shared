import {customAlphabet} from 'nanoid'
import dayjs from 'dayjs'

export const getId = (size = 8): string => {
    return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', size)()
}

export function getAppNumberReference(appId: string) {
    return appId.replace('app:', '')
}

export const getBucketNameFromAppId = (appId: string) => {
    return appId.replace('app:', 'bucket_')
}

export const getRepositoryUserNameFromAppId = (appId: string) => {
    return appId.replace(':', '_')
}

export const definedOrDefault = <T>(value: T, defaultValue: T) => {
    return value === undefined ? defaultValue : value
}

export const withoutNullProperties = <T>(obj: T) => {

    if (typeof obj === 'object') {
        Object.keys(obj).forEach((key) => obj[key] === null && delete obj[key])
    }

    return obj
}

export const canBeANumber = (n: string | number | unknown) => {
    const number = `${n}`.replace(/em/g, '').trim()

    if (typeof n === 'string') {
        if (n.trim().startsWith('0') && !n.trim().startsWith('0.')) {
            return false
        }
    }

    return /^-?[\d.]+(?:e-?\d+)?$/.test(number)
}

export const toDataTimeString = (date = new Date()) => {
    if (!date) {
        return dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export const toDateString = (date = new Date()) => {
    if (!date) {
        return dayjs().format('YYYY-MM-DD')
    }
    return dayjs(date).format('YYYY-MM-DD')
}
