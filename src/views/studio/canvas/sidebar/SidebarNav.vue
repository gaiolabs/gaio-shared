<template>
	<nav
		id="sidebar-nav"
		class="z-1 absolute top-[50%] flex min-w-[52px] items-center"
	>
		<div
			class="absolute z-0 ms-3 flex w-[40px] flex-col items-center justify-center rounded-[10px] border-elevation-2 bg-elevation-1 py-2 shadow-2xl"
		>
			<div
				v-for="item of sidebarActions"
				:key="item.name"
				:class="{ 'active-pane': isPaneActive(item.name) }"
				class="inactive-pane flex h-[50px] w-full items-center justify-center"
			>
				<NButton
					text
					size="medium"
					@click="workWithPanel(item.name)"
				>
					<template #icon>
						<IconComponent
							:name="item.icon"
							:class="item.class + ' text-lg'"
						/>
					</template>
				</NButton>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue: string | undefined }>()
const showPanel = ref(false)
const panel = ref('')

const sidebarActions = [
	{
		name: 'flow',
		icon: 'Studio',
		class: 'rotate-[-90deg]',
	},
	{
		name: 'database',
		icon: 'DataSources',
	},
	{
		name: 'tasks',
		icon: 'Tasks',
	},
	{
		name: 'params',
		icon: 'Params',
	},
	{
		name: 'forms',
		icon: 'Forms',
	},
	{
		name: 'files',
		icon: 'Files',
	},
	{
		name: 'discovery',
		icon: 'Discovery',
	},
]

const isPaneActive = (type: string) => {
	return panel.value === type
}

const workWithPanel = (type: string) => {
	emit('update:modelValue', type)
	// if (panel.value === type) {
	//     closePanel();
	// } else {
	//     showPanel.value = true;
	//     panel.value = type;
	// }
}

watch(
	() => showPanel.value,
	() => {
		emit('update:modelValue', panel.value)
	},
)

onMounted(() => {
	if (props.modelValue) {
		showPanel.value = true
		panel.value = 'flow'
	}
})
</script>
