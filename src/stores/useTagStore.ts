import { defineStore } from 'pinia'
import { ref } from 'vue'
import useApi from '@/composables/useApi'
import { cloneDeep } from 'lodash-es'
import type { TagTypePermission } from '@gaio/shared/types'

type TagResult = {
    tags: TagTypePermission[]
    apps: TagTypePermission[]
    sources: TagTypePermission[]
}

export const useTagStore = defineStore('tagStore', () => {
    const loading = ref(true)
    const tags = ref([])
    const apps = ref([])
    const sources = ref([])
    const grantTags = ref([])
    const resourceTags = ref([])
    const dragResourceStatus = ref(false)
    const dragGrantStatus = ref(false)
    const currentUser = ref<TagTypePermission>({})

    const resetState = () => {
        loading.value = false
        grantTags.value = []
        resourceTags.value = []
        currentUser.value = {}
    }

    const add = ({ to, tag }) => {
        const item = cloneDeep(tag)
        if (to === 'grant') {
            grantTags.value.push(item)
        } else if (to === 'resource') {
            resourceTags.value.push(item)
        }
        removeDuplicated(to)
    }

    const remove = ({ from, tag }) => {
        if (from === 'grant') {
            grantTags.value = grantTags.value.filter((t) => t.userId !== tag.userId)
        } else if (from === 'resource') {
            resourceTags.value = resourceTags.value.filter((t) => t !== tag)
        }
        removeDuplicated(from)
    }

    const removeDuplicated = (from: string) => {
        if (from === 'grant') {
            grantTags.value = [...new Set(grantTags.value)]
        } else if (from === 'resource') {
            resourceTags.value = [...new Set(resourceTags.value)]
        }
    }

    const initTagPage = async () => {
        loading.value = true
        useApi()
            .get('api/settings/tag/manager-list')
            .then((result) => {
                defineValues(result)
                loading.value = false
            })
    }

    const listByTagType = async (tagData: TagTypePermission) => {
        useApi()
            .post('api/settings/tag/list-by-type', {
                body: tagData
            })
            .then((result) => {
                defineValues(result)
                loading.value = false
            })
    }

    const defineValues = (result: TagResult) => {
        tags.value = result.tags
        apps.value = result.apps
        sources.value = result.sources
    }

    return {
        tags,
        apps,
        sources,
        loading,
        grantTags,
        currentUser,
        resourceTags,
        dragGrantStatus,
        dragResourceStatus,
        add,
        remove,
        resetState,
        initTagPage,
        listByTagType
    }
})
