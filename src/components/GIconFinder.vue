<template>
	<g-dialog
		:width="'350px'"
		@close="$emit('close')"
	>
		<template #title>
			{{ $t('icon') }}
		</template>
		<template #content>
			<div class="h-[400px] max-w-[400px]">
				<n-input
					v-model:value="searchTerm"
					placeholder="Search"
					class="mb-2"
				/>

				<n-card content-style="padding: 5px">
					<div class="app-control-icon flex flex-wrap gap-2">
						<template
							v-for="item in iconListFiltered"
							:key="item"
						>
							<g-app-icon
								:name="item.value"
								:size="20"
								class="cursor-pointer"
								@click="choose(item.value)"
							/>
						</template>
					</div>
				</n-card>
			</div>
		</template>
	</g-dialog>
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
			searchTerm.value
		),
		100
	)
})
</script>
