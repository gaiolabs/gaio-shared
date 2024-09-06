<template>
	<DrawerView
		class="task-log-view"
		@close="$emit('close')"
	>
		<template #header>
			<div class="flex items-center gap-3 p-3">
				<div class="flex items-center gap-1 font-bold">
					<g-icon name="logs" />
					{{ $t('monitor') }}
				</div>
				<div>
					<NButtonGroup size="small">
						<NButton
							strong
							secondary
							:type="showTab === 'studio' ? 'primary' : 'default'"
							@click="showTab = 'studio'"
						>
							{{ $t('studio') }}
						</NButton>
						<NButton
							strong
							secondary
							:type="showTab === 'schedule' ? 'primary' : 'default'"
							@click="showTab = 'schedule'"
						>
							{{ $t('schedule') }}
						</NButton>
						<NButton
							strong
							secondary
							:type="showTab === 'dashboard' ? 'primary' : 'default'"
							@click="showTab = 'dashboard'"
						>
							{{ $t('dashboard') }}
						</NButton>
						<NButton
							strong
							secondary
							:type="showTab === 'portal' ? 'primary' : 'default'"
							@click="showTab = 'portal'"
						>
							{{ $t('portal') }}
						</NButton>
					</NButtonGroup>
				</div>
			</div>
		</template>
		<template #contentScroll>
			<TaskLogContent />
		</template>
	</DrawerView>
</template>
<script setup lang="ts">
import DrawerView from '@/components/drawer/DrawerView.vue'
import TaskLogContent from './TaskLogContent.vue'

defineEmits(['close'])

const showTab = ref('studio')
</script>
