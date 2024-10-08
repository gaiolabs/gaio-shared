<template>
	<GDialog
		:width="'350px'"
		@close="$emit('close')"
	>
		<template #title>
			{{ $t('iconPicker') }}
		</template>
		<template #content>
			<div class="h-[400px] max-w-[400px] relative overflow-y-scroll m-2 p-2">
				<span
					class="bg-gradient-to-b rounded-t-2xl from-white dark:from-gray-900 via-white dark:via-gray-900 to-transparent fixed top-0 left-0 right-4 h-12 z-[9]"
				></span>
				<nav class="mb-4 sticky top-0 z-10">
					<NInput
						v-model:value="searchTerm"
						placeholder="Search"
					/>
				</nav>

				<div class="app-control-icon flex flex-wrap gap-2">
					<GAppIcon
						v-for="item in iconListFiltered"
						:key="item.value"
						:name="item.value"
						:size="20"
						class="cursor-pointer size-10 !font-normal"
						@click="choose(item.value)"
					/>
				</div>
				<span
					class="bg-gradient-to-t from-white dark:from-gray-900 via-white dark:via-gray-900 to-transparent rounded-b-2xl fixed bottom-0 left-0 right-4 h-4 z-[9]"
				></span>
			</div>
		</template>
	</GDialog>
</template>

<script setup lang="ts">
import { lucidIconList } from '@/components/GIconFinderList'
import useHelper from '@/composables/useHelper'
import { shuffle, take } from 'lodash-es'
import { computed, ref } from 'vue'

const emit = defineEmits(['close', 'choose'])

const { filterBy } = useHelper()

const choose = (icon: string) => {
	emit('choose', icon)
	emit('close')
}

const searchTerm = ref('')
const sortedList = shuffle(lucidIconList)

const iconListFiltered = computed(() => {
	return take(
		filterBy(
			sortedList.map((o) => ({ value: o })),
			'value',
			searchTerm.value,
		),
		152,
	)
})
</script>
