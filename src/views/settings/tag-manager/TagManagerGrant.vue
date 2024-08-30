<template>
	<div
		ref="main"
		class="tag-manager-grant me-1"
	>
		<div class="g-bg-1 card-header-fix card-tags rounded shadow">
			<div class="card-header flex items-center justify-between bg-prime-hover p-2 text-white">
				{{ $t('grantTo') }}
				<div class="flex items-center">
					<n-tooltip>
						<template #trigger>
							<NButton
								size="tiny"
								quaternary
								@click="useTagStore().grantTags = []"
							>
								<template #icon>
									<g-icon
										name="eraser"
										color="#fff"
									/>
								</template>
							</NButton>
						</template>
						<div>{{ $t('clear') }}</div>
					</n-tooltip>
				</div>
			</div>
			<n-scrollbar :style="{ height: '100%' }">
				<n-tag
					v-for="(item, index) in useTagStore().grantTags"
					:key="index"
					size="small"
					:bordered="false"
					class="m-1"
					closable
					@close="remove(item)"
				>
					<div class="flex items-center gap-1">
						<g-icon
							v-if="item.role === 'group'"
							name="group"
						/>
						<g-icon
							v-else
							name="user"
						/>
						{{ item.name }}
					</div>
				</n-tag>
			</n-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTagStore } from '@/stores'
import type { TagTypePermission } from '@gaio/shared/types'

const remove = (tag: TagTypePermission) => {
	useTagStore().grantTags = useTagStore().grantTags.filter((o) => o !== tag)
}
</script>

<style lang="scss">
.tag-manager-grant {
	.dragArea {
		height: 100% !important;
	}
}
</style>
