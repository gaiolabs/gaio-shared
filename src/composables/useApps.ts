import type { AppType } from '@gaio/types'
import { take } from 'lodash-es'
import { computed, ref } from 'vue'

import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'
import { useAuthStore } from '@/stores'

type UserAppsType = {
    role: 'view' | 'edit'
} & AppType
export default () => {
    const mainList = ref<UserAppsType[]>([])
    const currentTab = ref('recent')
    const loading = ref(false)
    const searchTerm = ref('')

    const { filterBy } = useHelper()

    const favoriteApps = computed(() => {
        return useAuthStore().user?.options.favorApps || []
    })

    const recentApps = computed(() => {
        return useAuthStore().user?.options.recentApps || []
    })

    const appList = computed<UserAppsType[]>(() => {
        return filterBy(mainList.value, ['appName', 'appId'], searchTerm.value)
    })

    const filteredApps = computed<UserAppsType[]>(() => {
        const listAtFilter = currentTab.value === 'recent' ? recentApps.value : favoriteApps.value
        return take(
            appList.value
                .filter((app) => listAtFilter.includes(app.appId))
                .sort((a, b) => {
                    return listAtFilter.indexOf(a.appId) - listAtFilter.indexOf(b.appId)
                }),
            currentTab.value === 'recent' ? 4 : 999
        )
    })

    const listApps = async (isAll: 'all' | 'userPin') => {
        loading.value = true
        mainList.value = await useApi().post('api/app/list', {
            body: {
                appList: isAll === 'userPin' ? [...favoriteApps.value, ...recentApps.value] : []
            }
        })

        loading.value = false
    }

    const manuallyUpdateApp = (appData: AppType) => {
        mainList.value = mainList.value.map((a) => {
            if (a.appId === appData.appId) {
                return {
                    ...a,
                    ...appData
                }
            }
            return a
        })
    }

    return {
        appList,
        loading,
        searchTerm,
        currentTab,
        recentApps,
        favoriteApps,
        filteredApps,
        listApps,
        manuallyUpdateApp
    }
}
