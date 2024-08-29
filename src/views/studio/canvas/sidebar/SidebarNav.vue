<template>
	<div class="sidebar-nav z-1 absolute top-[50%] flex min-w-[52px] items-center">
		<div
			class="absolute z-0 ms-3 flex w-[40px] flex-col items-center justify-center rounded-[10px] border-elevation-2 bg-elevation-1 py-2 shadow-2xl"
		>
			<div
				v-for="item of sidebarActions"
				:key="item.name"
				:class="{ 'active-pane': isPaneActive(item.name) }"
				class="inactive-pane flex h-[50px] w-full items-center justify-center"
			>
				<n-button
					text
					size="medium"
					@click="workWithPanel(item.name)"
				>
					<template #icon>
						<g-icon
							:height="18"
							:name="item.icon"
							class="text-[20px]"
						/>
					</template>
				</n-button>
			</div>
		</div>
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
		icon: 'flow',
		name: 'flow'
	},
	{
		icon: 'database',
		name: 'source'
	},
	{
		icon: 'tasks',
		name: 'tasks'
	},
	{
		icon: 'params',
		name: 'params'
	},
	{
		icon: 'forms',
		name: 'forms'
	},
	{
		icon: 'files',
		name: 'files'
	},
	{
		icon: 'tableThunder',
		name: 'analysis'
	}
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
	}
)

onMounted(() => {
	if (props.modelValue) {
		showPanel.value = true
		panel.value = 'flow'
	}
})
</script>
