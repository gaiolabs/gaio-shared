<template>
	<div class="tag-sources ms-1">
		<div class="g-bg-1 card-header-fix card-tags min-h-[410px] rounded shadow">
			<div class="card-header g-bg-400 flex items-center justify-between gap-2 p-2">
				<div>
					<g-icon name="source" />
					{{ $t('sources') }}
				</div>
				<div class="flex items-center">
					<NDivider vertical />
					<NTooltip>
						<template #trigger>
							<NButton
								text
								@click="saveAll"
							>
								<template #icon>
									<g-icon
										name="checkAll"
										@click="saveAll"
									/>
								</template>
							</NButton>
						</template>
						{{ $t('selectAll') }}
					</NTooltip>
				</div>
			</div>
			<div class="px-2 pt-2">
				<NInput
					v-model:value="term"
					:placeholder="$t('filter')"
					@keyup="resetPage()"
				/>
			</div>
			<div v-if="hasFilteredTags">
				<div class="table-responsive mx-1 my-1">
					<NTable
						striped
						size="small"
					>
						<thead>
							<tr>
								<th></th>
								<th v-if="hasRole"></th>
								<th>{{ $t('source') }}</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(item, index) in filterBy(tags, ['name', 'ref'], term).slice(size * (page - 1), size * page)"
								:key="index"
							>
								<td
									class="text-center"
									style="width: 30px"
								>
									<g-icon
										v-if="!hasTags(item)"
										name="check"
										@click="addTag(item)"
									/>
									<g-icon
										v-else
										name="checked"
										@click="removeTag(item)"
									/>
								</td>
								<td
									v-if="item.role"
									style="width: 25px"
									class="el-text-center"
									@click="changeTagRole(item)"
								>
									<g-icon :name="item.role === 'edit' ? 'edit' : 'eye'" />
								</td>
								<td>
									<div class="flex items-center justify-between">
										<NTooltip>
											<template #trigger>
												<NButton
													text
													type="primary"
													@click="filter(item)"
												>
													{{ item.name }}
												</NButton>
											</template>
											{{ `${$t('source')} ${item.ref}` }}
										</NTooltip>
										<div>
											{{ item.refId }}
										</div>
									</div>
								</td>
							</tr>
						</tbody>
					</NTable>
				</div>
				<div
					v-if="filterBy(tags, ['name', 'ref'], term).length > size"
					class="my-2 flex w-full justify-center"
				>
					<NPagination
						v-model:page="page"
						size="small"
						:item-count="filterBy(tags, ['name', 'ref'], term).length"
						:page-size="size"
					/>
				</div>
			</div>
			<div
				v-else-if="!loading"
				class="m-2"
			>
				<g-alert
					:title="$t('noResult')"
					type="info"
					show-icon
					:closable="false"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'
import { useTagStore } from '@/stores'
import type { TagTypePermission } from '@gaio/shared/types'
import { computed, ref } from 'vue'

const { filterBy } = useHelper()
const term = ref('')
const page = ref(1)
const size = ref(9)

const currentUser = computed(() => {
	return useTagStore().currentUser['userId'] || ''
})

const changeTagRole = (tagData: TagTypePermission) => {
	useApi().post('api/app/tag/change-tag-role', {
		body: {
			appId: tagData.refId,
			userId: currentUser.value,
			role: tagData.role === 'edit' ? 'view' : 'edit'
		}
	})
}

const filter = (tagData: TagTypePermission) => {
	resetPage()
	useTagStore().listByTagType(tagData)
}

const hasRole = computed(() => {
	return tags.value.some((t) => t.role)
})

const resourceTags = computed(() => {
	return useTagStore().resourceTags
})

const resetPage = () => {
	page.value = 1
	size.value = 9
}

const addTag = (tag: TagTypePermission) =>
	useTagStore().add({
		to: 'resource',
		tag
	})

const removeTag = (tag: TagTypePermission) =>
	useTagStore().remove({
		from: 'resource',
		tag
	})

const hasTags = (tag: TagTypePermission) => {
	return resourceTags.value.some((t) => t.sourceId === tag.sourceId)
}

const tags = computed(() => {
	return useTagStore().sources
})

const loading = computed(() => {
	return useTagStore().loading
})

const hasFilteredTags = computed(() => {
	return filterBy(tags.value, ['name', 'ref'], term.value).length > 0
})

const saveAll = () => {
	resetPage()
	tags.value.forEach((tag) => addTag(tag))
}
</script>

<style lang="scss">
.tag-manager-sources {
	.n-tag {
		padding: 0;

		div {
			padding: 0 4px;
		}
	}
}
</style>
