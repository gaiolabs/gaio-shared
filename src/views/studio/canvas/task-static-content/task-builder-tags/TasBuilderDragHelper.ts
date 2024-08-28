import { getId } from '@gaio/shared/utils'

const addFilter = (e) => {
    e.operator = '='
    e.andOr = 'and'
    e.fieldType = 'value'
    e.valueType = 'value'
    e.value = ''
    e.extraValue = ''
    if (e.computedId) {
        e.fieldType = 'computed'
    } else {
        e.fieldType = 'value'
    }
    return e
}

const removeFilter = (e) => {
    delete e.operator
    delete e.andOr
    delete e.fieldType
    delete e.valueType
    delete e.value
    delete e.extraValue
    if (e.computedId) {
        delete e.fieldType
    } else {
        delete e.fieldType
    }
    return e
}

const addSort = (e) => {
    e.order = 'asc'
    return e
}

const removeSort = (e) => {
    delete e.order
    return e
}

export const onDragMove = (e, type) => {
    e.id = getId()
    e.type = e.type || 'value'

    switch (type) {
        case 'filter':
            e = addFilter(e)
            e = removeSort(e)
            break
        case 'sort':
            e = removeFilter(e)
            e = addSort(e)
            break
        case 'group':
            e = removeFilter(e)
            e = removeSort(e)
            break
        case 'select':
            e = removeFilter(e)
            e = removeSort(e)
            break
    }
    return e
}
