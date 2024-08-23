import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'

export const usePowerStore = defineStore('config', () => {
    const { filterBy } = useHelper()

    const currentPanel = ref('search')
    const currentTab = ref('all')
    const searchTerm = ref('')
    const currentIndex = ref(0)
    const tags = ref([])
    const selectedContext = ref(null)
    const selectedView = ref(null)
    const selectedStory = ref(null)
    const contexts = ref([])
    const views = ref([])
    const stories = ref([])
    const emptyAndBackspace = ref(false)
    const all = computed(() => {
        return [...contexts.value, ...views.value, ...stories.value]
    })

    const filteredList = computed(() => {
        return filterBy(
            filterBy(usePowerStore().all, 'label', searchTerm.value),
            'metaType',
            currentTab.value === 'all' ? '' : currentTab.value
        ).filter((item) => item['type'] !== 'insights')
    })

    const filteredContextField = computed(() => {
        return filterBy(usePowerStore().selectedContext.fields, ['columnName'], usePowerStore().searchTerm)
    })

    const loadPowerReferences = async () => {
        const data = await useApi().get('api/discovery/list-power')
        contexts.value = data.contexts
        views.value = data.views
        stories.value = data.stories
    }

    return {
        loadPowerReferences,
        filteredContextField,
        emptyAndBackspace,
        selectedContext,
        selectedStory,
        selectedView,
        filteredList,
        currentPanel,
        currentIndex,
        currentTab,
        searchTerm,
        contexts,
        stories,
        views,
        tags,
        all
    }
})
