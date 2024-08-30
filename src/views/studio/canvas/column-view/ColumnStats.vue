<template>
	<div class="column-stats pb-3">
		<NTable striped>
			<tbody>
				<tr
					v-for="(value, key) of stats"
					:key="key"
				>
					<td class="mx-2 flex items-center justify-between">
						{{ $t(`${key}`) }}
						<div>{{ value }}</div>
					</td>
				</tr>
			</tbody>
		</NTable>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useFormatValue from '@/composables/useFormatValue'
import { useAppStore } from '@/stores'
import { useColumnView } from '@/views/studio/canvas/column-view/useColumnView'
import type { GenericType } from '@gaio/shared/types'
import { computed } from 'vue'
import { onMounted, ref } from 'vue'

const { columnData } = useColumnView().$state

const stats = ref<GenericType>({
	average: undefined,
	minimum: undefined,
	maximum: undefined,
	sum: undefined,
	count: undefined,
	countDistinct: undefined,
	emptyOrNull: undefined
})

const task = computed(() => useAppStore().task)
const { defaultFormatNumeric, defaultFormatDecimal } = useFormatValue()

const loadStats = async () => {
	const { data } = await useApi().post(`api/table/stats`, {
		body: {
			taskData: {
				...task.value,
				columnName: columnData.columnName
			}
		}
	})
	const result = data[0]

	stats.value = {
		average: defaultFormatDecimal(result.average),
		minimum: defaultFormatDecimal(result.minimum),
		maximum: defaultFormatDecimal(result.maximum),
		sum: defaultFormatNumeric(result.sum),
		count: defaultFormatNumeric(result.count),
		countDistinct: defaultFormatNumeric(result.countDistinct),
		emptyOrNull: defaultFormatNumeric(result.empty)
	}

	columnData.min = result.minimum
	columnData.max = result.maximum
}

onMounted(() => loadStats())
</script>
<style scoped lang="scss">
.n-list-item {
	padding: 4px 15px !important;
	font-size: 14px !important;
}
</style>
