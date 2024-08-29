import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores/useAppStore'
import { commandKCommon } from '@/views/commandK/commandKCommon'
import type { GenericType } from '@gaio/shared/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useCommandKStore = defineStore('command', () => {
	const { t } = useI18n()
	const { filterBy } = useHelper()

	const tab = ref('all')
	const show = ref(false)
	const searchTerm = ref<string>('')
	const serverResult = ref<GenericType[]>([])
	const results = ref<GenericType[]>(commandKCommon(t).sort((a, b) => a.label.localeCompare(b.label)))

	const flowList = computed(() =>
		useAppStore().flowList.map((f) => {
			return {
				label: f.flowName,
				icon: 'flow',
				type: 'flow',
				data: f
			}
		})
	)

	const finalList = computed<GenericType[]>(() => {
		console.log(serverResult.value.length)
		if (['table'].includes(tab.value)) {
			return filterBy(serverResult.value, 'label', searchTerm.value).filter((o) => o.type === 'table')
		} else if (['flow'].includes(tab.value)) {
			return filterBy(flowList.value, 'label', searchTerm.value)
		}
		return filterBy(results.value.concat(serverResult.value), 'label', searchTerm.value)
	})

	return { tab, show, finalList, results, serverResult, searchTerm }
})
