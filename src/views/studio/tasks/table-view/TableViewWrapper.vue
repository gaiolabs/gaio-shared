<template>
	<drawer-view @close="$emit('close')">
		<template #header>
			<div id="table-view-header"></div>
		</template>
		<template #content>
			<div id="table-view-content table-view-wrapper"></div>
		</template>
	</drawer-view>

	<table-view />
</template>
<script setup lang="ts">
import DrawerView from '@/components/drawer/DrawerView.vue'
import TableView from '@/views/studio/tasks/table-view/TableView.vue'

defineEmits(['close'])
</script>
