<template>
	<div
		v-if="localTask?.tableName"
		class="task-builder-menu flex w-full items-center gap-3 p-3 px-0"
	>
		<div class="flex items-center gap-1 text-lg font-bold">
			<IconComponent name="Studio" />
			{{ $t('builder') }}
		</div>
		<div class="flex grow items-center justify-between gap-2 px-3">
			<div class="flex items-center gap-2">
				<NInput
					v-model:value="localTask.label"
					size="small"
					:placeholder="$t('label')"
				>
					<template #prefix>
						<g-icon name="write" />
					</template>
				</NInput>
				<NInput
					v-model:value="localTask.resultTable"
					v-alpha
					size="small"
					:placeholder="$t('tableName')"
				>
					<template #prefix>
						<g-icon
							name="timer"
							:color="(localTask.resultTable || '').startsWith('tmp_') ? 'e32' : '#ccc'"
						/>
					</template>
				</NInput>

				<NDivider vertical />
				<NButton
					size="small"
					@click="saveBuilder('save')"
				>
					{{ $t('save') }}
				</NButton>
				<NButton
					size="small"
					@click="saveBuilder('run')"
				>
					{{ $t('saveAndRun') }}
				</NButton>
			</div>
			<NButtonGroup size="small">
				<NButton
					:type="showTab === 'builder' ? 'primary' : 'default'"
					secondary
					class="border-elevation-2"
					@click="$emit('showTab', 'builder')"
				>
					{{ $t('builder') }}
				</NButton>
				<NButton
					:type="showTab === 'preview' ? 'primary' : 'default'"
					secondary
					class="border-elevation-2"
					@click="$emit('showTab', 'preview')"
				>
					{{ $t('preview') }}
				</NButton>
				<NButton
					:type="showTab === 'sql' ? 'primary' : 'default'"
					secondary
					class="border-elevation-2"
					@click="$emit('showTab', 'sql')"
				>
					{{ $t('sql') }}
				</NButton>
			</NButtonGroup>
		</div>
	</div>
</template>
<script setup lang="ts">
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import { type BuilderTaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId, getId } from '@gaio/shared/utils'
import { flatMap, uniqBy } from 'lodash-es'
import type { PropType } from 'vue'

const props = defineProps({
	localTask: {
		type: Object as PropType<BuilderTaskType>,
		required: true,
		default: () => ({}) as BuilderTaskType,
	},
	showTab: {
		type: String,
		required: true,
	},
})
const emit = defineEmits(['showTab', 'close'])

const saveBuilder = (saveType: string) => {
	console.log(saveType)
	const task = props.localTask
	if (task.id === undefined) task.id = getId()

	const bucket = getBucketNameFromAppId(task.appId)
	// FROM SOURCES. TAKE NOTE OF SOURCE TYPE
	const baseSourceMetadata = {
		...task,
		schema: null,
		id: null,
		sourceType: useAppStore().cloneTask().sourceType,
		tableName: task.tableName,
		databaseName: useAppStore().cloneTask().databaseName,
		type: 'table',
	}
	const tableList = [
		useDefault({
			type: 'table',
			base: baseSourceMetadata,
		}),
	]
	const joinTables = flatMap(
		task.schema.join.filter((o) => o.type !== 'raw'),
		(o) => [`${o.toDatabaseName || bucket}.${o.to}`, `${o.byDatabaseName || bucket}.${o.by}`],
	).map((tableReference) => {
		const ref = tableReference.split('.')
		const [databaseName, tableName] = ref
		let shared = false
		if (databaseName !== props.localTask.databaseName) {
			shared = true
		}
		return useDefault({
			type: 'table',
			base: {
				...baseSourceMetadata,
				shared,
				sourceType: useAppStore().cloneTask().sourceType,
				type: 'table',
				tableName,
				databaseName,
			},
		})
	})
	const joinListTables = task.schema.join.filter((o) => o.type === 'raw')

	for (let joinList of joinListTables) {
		if (joinList.refs && joinList.refs.length) {
			for (let refTable of joinList.refs) {
				const table = useDefault({
					type: 'table',
					base: {
						...task,
						label: refTable.tableName,
						tableName: refTable.tableName,
						databaseName: refTable.databaseName,
					},
				})
				joinTables.push(table)
			}
		}
	}

	const sources = uniqBy(tableList.concat(joinTables), (tb) => {
		return [tb.tableName, tb.databaseName].join()
	})

	const targets = [
		useDefault({
			type: 'table',
			base: {
				...task,
				tableName: task.resultTable,
				sourceType: 'bucket',
				client: 'clickhouse',
				databaseName: getBucketNameFromAppId(task.appId),
			},
		}),
	]

	useFlow(useAppStore().flow.workflow)
		.generate({
			task,
			sources,
			targets,
		})
		.save()
		.then(() => emit('close'))
}
</script>
