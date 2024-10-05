<template>
	<aside
		id="sidebar-task"
		class="flex h-full flex-col items-stretch"
	>
		<div class="flex w-full items-stretch justify-between px-4 pt-3">
			<h2 class="text-lg font-bold inline-flex items-center gap-1">
				<IconComponent name="Tasks" />
				<span>
					{{ $t('tasks') }}
				</span>
			</h2>
			<div class="flex gap-1">
				<NButton
					size="tiny"
					tertiary
					:type="showAs === 'grid' ? 'primary' : 'default'"
					@click="() => (showAs = showAs === 'grid' ? 'tree' : 'grid')"
				>
					<template #icon>
						<IconComponent name="Grid" />
					</template>
				</NButton>
			</div>
		</div>
		<div class="sidebar-flow-search px-4 pt-1">
			<NInput
				v-model:value="searchTerm"
				size="small"
				:placeholder="$t('search')"
			/>
		</div>
		<NScrollbar
			style="calc(100% - 20px) overflow: auto"
			outer-class="h-full overflow-auto"
		>
			<template v-if="showAs === 'grid'">
				<div
					v-for="tree of localTreeFiltered"
					:key="tree.key"
					class="mb-5 px-4"
				>
					<div class="mx-4 mt-2 font-bold">
						{{ tree.label }}
					</div>
					<div class="grid grid-cols-3 gap-1">
						<div
							v-for="item of tree.children"
							:key="item.key"
							class="mb-2 flex h-[79px] flex-col items-center justify-start"
						>
							<div
								class="mb-1 flex size-[55px] cursor-pointer items-center justify-center rounded border-elevation-2 bg-elevation-1"
								@click="select(item)"
							>
								<component :is="item.prefix()" />
							</div>
							<div
								class="text-xs"
								style="text-align: center; font-size: 10px; font-style: normal; font-weight: 400; line-height: 10px"
							>
								{{ item.label }}
							</div>
						</div>
					</div>
				</div>
			</template>
			<NTree
				v-else
				class="mx-4 mb-5"
				block-node
				block-line
				expand-on-click
				:default-expanded-keys="['etl']"
				:get-children="baseChildren"
				:data="localTreeFiltered"
				:default-expand-all="searchTerm.length > 0"
				:node-props="nodeProps"
				@select="select"
			/>
		</NScrollbar>
	</aside>
</template>
<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import useTree from '@/composables/useTree'
import { useAppStore } from '@/stores'
import { generateBase } from '@/views/studio/board/BoardIcons'
import { taskList } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'
import { NButton, type TreeOption, useMessage } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { baseChildren } = useTree()
const message = useMessage()

const emit = defineEmits(['choose'])
const searchTerm = ref('')
const showAs = ref('tree')

const nodeProps = ({ option }: { option: TreeOption }) => {
	return {
		onClick() {
			select(option)
		},
	}
}

const select = (item: TreeOption) => {
	if (item.isLeaf) {
		const task = useAppStore().cloneTask()
		const { key, onlyBucket } = item

		if (onlyBucket && (!task || (!['table'].includes(task.type) && task.type !== key))) {
			message.warning(t('mustSelectTable'))
		} else {
			console.log(task)
			emit('choose', {
				type: key,
			})
		}
	}
}

const getByCategory = (cat: string) =>
	taskList(t)
		.filter((o) => o.cat === cat)
		.map((o) => {
			return {
				label: o.title,
				key: o.type,
				isLeaf: true,
				onlyBucket: o.onlyBucket,
				prefix: () =>
					h('img', {
						src: generateIcon(o),
						style: 'width: 20px; height: 20px;',
					}),
			}
		})

const generateIcon = (item: TreeOption) => {
	return `/studio/board/tasks/${
		generateBase({
			...item,
			client: 'clickhouse',
			sourceType: 'bucket',
		}).image
	}`
}

const taskTree: TreeOption[] = [
	{
		label: t('etl'),
		key: 'etl',
		isLeaf: false,
		children: getByCategory('DATAPREP'),
	},
	{
		label: t('analytics'),
		key: 'analytics',
		isLeaf: false,
		children: getByCategory('ANALYTICS'),
	},
	{
		label: t('delivery'),
		key: 'delivery',
		isLeaf: false,
		children: getByCategory('DELIVERY'),
	},
]

const localTreeFiltered = computed(() => {
	const filterTree = (tree: TreeOption[], searchTerm: string) => {
		return tree.filter((node) => {
			if (node.label.toLowerCase().includes(searchTerm.toLowerCase())) {
				return true
			}
			if (node.children) {
				node.children = filterTree(node.children, searchTerm)
				return node.children.length > 0
			}
			return false
		})
	}

	return filterTree(cloneDeep(taskTree), searchTerm.value)
})
</script>
<style lang="scss">
.sidebar-task {
	.n-tree-node-switcher {
		&:nth-child(2) {
			width: 0 !important;
		}
	}
}
</style>
