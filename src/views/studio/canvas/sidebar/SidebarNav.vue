<template>
	<div class="pt-[74px] p-4 absolute left-0 top-0 bottom-0 pointer-events-none">
		<nav
			id="sidebar-nav"
			class="z-1 flex items-center h-full"
		>
			<div class="z-0 flex w-[40px] flex-col items-center justify-center rounded-2xl g-wrapper !pointer-events-auto">
				<div
					v-for="item of sidebarActions"
					:key="item.name"
					class="flex h-[50px] w-full items-center justify-center"
				>
					<button @click="workWithPanel(item.name)">
						<IconComponent
							:name="item.icon"
							class="text-lg text-gray-700 dark:text-gray-500 hover:dark:text-white hover:text-sepia-600 transition-colors duration-150"
							:class="item.class"
						/>
					</button>
				</div>
			</div>
		</nav>
	</div>
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

const workWithPanel = (type: string) => {
	if (props.modelValue === type) {
		return emit('update:modelValue', null)
	}
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
