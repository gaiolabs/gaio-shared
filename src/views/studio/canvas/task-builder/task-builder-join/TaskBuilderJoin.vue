<template>
	<div
		:key="props.localTask.schema.join.length"
		class="task-builder-drop-join block"
	>
		<div class="mx-1 flex items-center justify-between gap-1">
			<div class="flex items-center gap-1 font-bold">
				<g-icon name="flow" />
				{{ $t('join') }}
				<span v-if="localTask.schema.join.length">({{ localTask.schema.join.length }})</span>
			</div>
			<div class="mb-1 flex gap-1">
				<NButton
					quaternary
					size="tiny"
					class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
					@click="addJoin()"
				>
					{{ $t('addJoin') }}
				</NButton>
				<NTooltip :delay="1500">
					<template #trigger>
						<NButton
							quaternary
							size="tiny"
							type="error"
							class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
							@click="removeAll()"
						>
							<template #icon>
								<g-icon name="deleteTag" />
							</template>
						</NButton>
					</template>
					{{ $t('deleteAllTags') }}
				</NTooltip>
			</div>
		</div>
		<div
			class="task-builder-drop-tag min-h-[30px] w-full rounded-[8px] border-elevation-2 bg-paper-100 p-2 pb-1 dark:bg-carbon-200"
		>
			<div
				v-for="(item, joinKey) of localTask.schema.join"
				:key="joinKey"
				class="mb-1 flex items-start gap-2"
			>
				<!--RAW JOIN-->
				<template v-if="item.type === 'raw'">
					<div class="mb-1 flex w-full items-center overflow-hidden rounded border-elevation-3">
						<div class="flex w-[30px] items-center justify-center">
							<NButton
								size="tiny"
								quaternary
								@click="editJoin(joinKey)"
							>
								<g-icon name="edit" />
							</NButton>
						</div>
						<div class="min-w-[150px] grow bg-elevation-1 p-1 text-center">
							{{ $t('computed') }}
						</div>
						<div class="w-[60px] text-center">
							<NButton
								size="tiny"
								quaternary
								type="error"
								@click="removeJoinItem(joinKey)"
							>
								<template #icon>
									<IconComponent name="Delete" />
								</template>
							</NButton>
						</div>
					</div>
				</template>
				<!--DEFAULT JOIN-->
				<template v-else>
					<div class="flex max-w-[50%] grow items-center overflow-hidden rounded border-elevation-3">
						<div class="flex max-w-[40px] flex-none items-center justify-center px-1">
							<NButton
								size="tiny"
								quaternary
								@click="editJoin(joinKey)"
							>
								<template #icon>
									<g-icon name="edit" />
								</template>
							</NButton>
						</div>
						<div class="grow overflow-hidden text-ellipsis bg-elevation-2 p-1 text-center">
							{{ item.by }}
						</div>
						<div
							class="flex max-w-[40px] flex-none items-center justify-center px-1"
							@click="changeJoinType(joinKey, item.type)"
						>
							<NButton
								size="tiny"
								quaternary
								class="text-base"
								@click="editJoin(joinKey)"
							>
								<template #icon>
									<g-icon :name="`${item.type}Join`" />
								</template>
							</NButton>
						</div>
						<div class="grow overflow-hidden text-ellipsis rounded-e bg-elevation-2 p-1 text-center">
							{{ item.to }}
						</div>
					</div>
					<div class="grow">
						<div
							v-for="(sub, subIndex) of item.list"
							:key="subIndex"
							class="mb-1 flex w-full items-center rounded border-elevation-3"
						>
							<div class="grow overflow-hidden text-ellipsis rounded-s bg-elevation-1 p-1 text-center">
								{{ sub.columnBy }}
							</div>
							<div class="max-w-[30px] flex-none px-2 text-center">
								{{ sub.operator }}
							</div>
							<div class="grow overflow-hidden text-ellipsis bg-elevation-1 p-1 text-center">
								{{ sub.columnTo }}
							</div>
							<div class="flex max-w-[30px] flex-none justify-center px-1">
								<NButton
									size="tiny"
									quaternary
									type="error"
									@click="removeJoinItem(joinKey, subIndex)"
								>
									<template #icon>
										<IconComponent name="Delete" />
									</template>
								</NButton>
							</div>
						</div>
					</div>
				</template>
			</div>
			<!--JOIN CONTROL PANEL-->
			<task-builder-join-control
				v-if="joinItem"
				:join-item="joinItem"
				:local-task="localTask"
				:join-index="joinIndex"
				@close="joinItem = null"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/useAppStore'
import TaskBuilderJoinControl from '@/views/studio/canvas/task-builder/task-builder-join/TaskBuilderJoinControl.vue'
import type { BuilderTaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'
import { type PropType, ref } from 'vue'

const props = defineProps({
	localTask: {
		type: Object as PropType<BuilderTaskType>,
		required: true,
		default: () => null as BuilderTaskType
	}
})

const removeJoinItem = (schemaJoinIndex: number, subIndex: number = null) => {
	if (subIndex === null) {
		props.localTask.schema.join.splice(schemaJoinIndex, 1)
	} else {
		props.localTask.schema.join[schemaJoinIndex].list.splice(subIndex, 1)

		if (!props.localTask.schema.join[schemaJoinIndex].list.length) {
			props.localTask.schema.join.splice(schemaJoinIndex, 1)
		}
	}
}

const joinItem = ref()
const joinIndex = ref<number>()

const editJoin = (schemaJoinIndex) => {
	joinIndex.value = schemaJoinIndex
	joinItem.value = props.localTask.schema.join[schemaJoinIndex]
}

const addJoin = () => {
	const currentDatabase = getBucketNameFromAppId(useAppStore().app.appId)
	joinItem.value = {
		id: null,
		by: props.localTask.tableName,
		to: '',
		list: [],
		type: 'inner',
		raw: '',
		byDatabaseName: currentDatabase,
		toDatabaseName: currentDatabase
	}
}

const changeJoinType = (joinIndex, type) => {
	switch (type) {
		case 'left':
			props.localTask.schema.join[joinIndex].type = 'inner'
			break
		case 'inner':
			props.localTask.schema.join[joinIndex].type = 'right'
			break
		case 'right':
			props.localTask.schema.join[joinIndex].type = 'full'
			break
		case 'full':
			props.localTask.schema.join[joinIndex].type = 'left'
			break
	}
}

const removeAll = () => {
	props.localTask.schema.join = []
}
</script>
