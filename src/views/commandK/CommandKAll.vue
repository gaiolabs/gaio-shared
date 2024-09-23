<template>
	<div class="command-k-all">
		<div class="flex items-center border-b">
			<div>
				<NButton quaternary>
					<IconComponent name="Search" />
				</NButton>
			</div>
			<div class="flex flex-grow items-center gap-2">
				<div>
					<div
						v-for="(bread, index) of breadcrumbs"
						:key="index"
						class="flex items-center gap-1"
					>
						<g-icon
							v-if="bread.icon"
							:name="bread.icon"
						/>
						{{ bread.label }}
					</div>
				</div>
				<input
					ref="inputRef"
					v-model="useCommandKStore().searchTerm"
					class="h-[35px] w-full px-2 font-[18px] outline-none"
					type="text"
					:placeholder="$t('searchOrSpace')"
					@keyup.up="moveVertical('up')"
					@keyup.down="moveVertical('down')"
					@keyup.enter="moveEnter"
					@keyup.tab="inputRef.value.focus()"
				/>
			</div>
		</div>
		<ul class="command-power-result">
			<li
				v-for="(result, index) in useCommandKStore().finalList"
				:key="index"
				class="border-b px-2 py-2"
				:class="{ active: currentIndex === index }"
				@click="actionHolder(result)"
			>
				<div class="flex items-center gap-1 px-2">
					<div
						class="flex items-center gap-2"
						:class="{ 'text-primary': currentIndex === index }"
					>
						<g-app-icon
							v-if="['dashboard'].includes(result.type)"
							:name="result.icon"
							:color="result.color"
						/>
						<g-icon
							v-else
							:name="result.icon"
						/>
						{{ result.label }}
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore, useCommandKStore } from '@/stores'
import { debounce } from 'lodash-es'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close'])

const { t } = useI18n()
const router = useRouter()

const inputRef = ref(null)
const searchTerm = ref('')
const breadcrumbs = ref([])
const currentIndex = ref(0)

const actionHolder = (action) => {
	if (action.type === 'router') {
		router.push(action.path)
	} else if (['app', 'dashboard'].includes(action.type)) {
		useAppStore().app = {
			appId: action.id,
		}
		if (action.type === 'app') {
			router.push(`/studio`)
		} else if (action.type === 'dashboard') {
			router.push(`/dashboard`)
		}
	} else {
		console.log('action')
	}
}

const searchData = () => {
	// if (['t ', 'p ', 'i '].some((item) => useCommandKStore().searchTerm.startsWith(item))) {
	//     return
	// }
	useApi()
		.post('api/commander/search', {
			body: {
				searchItems: serverSearchIReferences.value,
				searchTerm: useCommandKStore().searchTerm,
				appInfo: appInfo.value,
			},
		})
		.then((res) => {
			useCommandKStore().serverResult = res
		})
}

const appInfo = computed(() => {
	return router.currentRoute.value.name === 'studio' ? useAppStore().appInfo : {}
})

const serverSearchIReferences = computed(() => {
	if (useCommandKStore().tab === 'table') {
		return ['table']
	}
	if (useCommandKStore().tab === 'flow') {
		return ['flow']
	}
	return ['app', 'meta']
})

const processBreadcrumb = () => {
	if (useCommandKStore().searchTerm.startsWith('t ')) {
		// useCommandKStore().searchTerm = ''
		useCommandKStore().tab = 'table'
		// breadcrumbs.value = [
		//     {
		//         label: t('table'),
		//         type: 'table',
		//         icon: 'table'
		//     }
		// ]
		if (useCommandKStore().searchTerm.length > 2) {
			searchData()
		}
	} else {
		searchData()
	}
}

const moveEnter = () => {
	if (useCommandKStore().finalList[currentIndex.value]) {
		actionHolder(useCommandKStore().finalList[currentIndex.value])
	}

	useCommandKStore().searchTerm = ''
	emit('close')
}

const moveVertical = (direction: 'up' | 'down') => {
	if (direction === 'up') {
		if (currentIndex.value > 0) {
			currentIndex.value--
		}
	} else {
		if (currentIndex.value < useCommandKStore().finalList.length - 1) {
			currentIndex.value++
		}
	}
}

watch(() => useCommandKStore().searchTerm, debounce(processBreadcrumb, 300))
watch(
	() => useCommandKStore().tab,
	() => {
		console.log('casa')
		processBreadcrumb()
		nextTick(() => inputRef.value.focus())
	},
)

onMounted(() => nextTick(() => inputRef.value.focus()))
</script>
