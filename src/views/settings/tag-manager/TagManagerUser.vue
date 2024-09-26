<template>
	<div class="tag-manager-users">
		<div class="g-bg-1 card-header-fix card-tags min-h-[410px] rounded shadow">
			<div class="card-header g-bg-400 flex h-[35px] items-center justify-between gap-2 px-2 py-1">
				<NRadioGroup
					v-model:value="tagType"
					size="small"
					@update:value="filterTag = ''"
				>
					<NRadioButton
						:label="$t('group')"
						value="group"
					/>
					<NRadioButton
						:label="$t('user')"
						value="user"
					/>
				</NRadioGroup>
				<div class="flex items-center justify-end gap-2">
					<div
						v-if="tagType === 'user'"
						class="flex items-center gap-1"
					>
						<NTooltip>
							<template #trigger>
								<NButton
									size="tiny"
									color="#333"
									style="color: #fff"
									@click="filterTag = 'admin'"
								>
									A
								</NButton>
							</template>
							{{ $t('admin') }}
						</NTooltip>
						<NTooltip>
							<template #trigger>
								<NButton
									size="tiny"
									color="#1976d2"
									style="color: #fff"
									@click="filterTag = 'dev'"
								>
									D
								</NButton>
							</template>
							{{ $t('developer') }}
						</NTooltip>
						<NTooltip>
							<template #trigger>
								<NButton
									size="tiny"
									color="#e91e63"
									style="color: #fff"
									@click="filterTag = 'user'"
								>
									U
								</NButton>
							</template>
							{{ $t('user') }}
						</NTooltip>
						<NTooltip>
							<template #trigger>
								<NButton
									size="tiny"
									color="#ccc"
									style="color: #222"
									@click="filterTag = ''"
								>
									C
								</NButton>
							</template>
							{{ $t('clear') }}
						</NTooltip>
						<NDivider vertical />
					</div>
					<NTooltip v-if="currentUser.userId && tagType !== 'user'">
						<template #trigger>
							<NButton
								text
								@click="showEditUser = true"
							>
								<template #icon>
									<IconComponent name="Edit" />
								</template>
							</NButton>
						</template>
						{{ $t('newGroup') }}
					</NTooltip>
					<NDivider
						v-if="current && current.userId"
						vertical
					/>
					<NTooltip v-if="tagType !== 'user'">
						<template #trigger>
							<NButton
								text
								@click="addNewGroup"
							>
								<template #icon>
									<g-icon
										style="margin-top: 2px"
										name="add"
									/>
								</template>
							</NButton>
						</template>
						{{ $t('newGroup') }}
					</NTooltip>
					<NDivider
						v-if="tagType !== 'user'"
						vertical
					/>
					<NTooltip>
						<template #trigger>
							<NButton
								text
								@click="saveAll()"
							>
								<template #icon>
									<g-icon name="checkAll" />
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
					:disabled="!!currentUser.userId"
					:placeholder="$t('filter')"
					@keyup="page = 1"
				/>
			</div>
			<template v-if="loading">
				<g-alert :title="$t('loading')" />
			</template>
			<!-- TABLE USERS-->
			<template v-if="tagType === 'user'">
				<template v-if="hasFilteredTagsOfOnlyUsers">
					<div class="table-responsive mx-1 my-1">
						<NTable
							striped
							size="small"
						>
							<thead>
								<tr>
									<th></th>
									<th>
										{{ $t('type') }}
									</th>
									<th style="width: 50px">id</th>
									<th>{{ $t('user') }}</th>
									<th>{{ $t('email') }}</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(item, index) in filterBy(
										tags.filter((t) => t.role !== 'group'),
										'name',
										term
									).slice(size * (page - 1), size * page)"
									:key="index"
								>
									<td
										class="el-text-center"
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
									<td class="el-text-center">
										<NTooltip v-if="item.role === 'admin'">
											<template #trigger>
												<NButton
													size="tiny"
													color="#333"
													style="color: #fff"
												>
													A
												</NButton>
											</template>
											{{ $t('admin') }}
										</NTooltip>
										<NTooltip v-else-if="item.role === 'dev'">
											<template #trigger>
												<NButton
													size="tiny"
													color="#1976d2"
													style="color: #fff"
												>
													D
												</NButton>
											</template>
											{{ $t('developer') }}
										</NTooltip>
										<NTooltip v-else>
											<template #trigger>
												<NButton
													size="tiny"
													color="#e91e63"
													style="color: #fff"
												>
													U
												</NButton>
											</template>
											{{ $t('user') }}
										</NTooltip>
									</td>
									<td class="el-text-center">{{ item.userId }}</td>
									<td>
										<NButton
											text
											@click="filter(item)"
										>
											{{ item.name }}
										</NButton>
									</td>
									<td>{{ item.email }}</td>
								</tr>
							</tbody>
						</NTable>
					</div>
					<div
						v-if="filterBy(tags, 'name', term).filter((t) => t.role !== 'group').length > size"
						class="d-flex justify-content-center w-100"
					>
						<NPagination
							v-model:page="page"
							size="small"
							:item-count="filterBy(tags, 'name', term).filter((t) => t.role !== 'group').length"
							:page-size="size"
						/>
					</div>
				</template>
				<g-alert
					v-else-if="!loading"
					:title="$t('noData')"
				/>
			</template>
			<template v-else>
				<!-- TABLE GROUPS-->
				<template v-if="hasFilteredTags">
					<div class="table-responsive mx-1 my-1">
						<NTable
							striped
							size="small"
						>
							<thead>
								<tr>
									<th></th>
									<th>{{ $t('group') }}</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(item, index) in filterBy(tags, 'name', term)
										.filter((t) => t.role === 'group')
										.slice(size * (page - 1), size * page)"
									:key="index"
								>
									<td
										class="el-text-center"
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
									<td>
										<NButton
											text
											type="primary"
											@click="filter(item)"
										>
											{{ item.name }}
										</NButton>
									</td>
								</tr>
							</tbody>
						</NTable>
					</div>
					<div
						v-if="filterBy(tags, 'name', term).filter((t) => t.role === 'group').length > size"
						class="flex w-full justify-center"
					>
						<NPagination
							v-model:page="page"
							size="small"
							:item-count="filterBy(tags, 'name', term).filter((t) => t.role === 'group').length"
							:page-size="size"
						/>
					</div>
				</template>
				<g-alert
					v-else-if="!loading"
					:title="$t('noData')"
					show-icon
				/>
			</template>
			<tag-manager-group-control
				v-if="showEditUser"
				:current="current"
				@close="closeGroupOn('close')"
				@save="closeGroupOn('save')"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import useHelper from '@/composables/useHelper'
import { useTagStore } from '@/stores'
import TagManagerGroupControl from '@/views/settings/tag-manager/TagManagerGroupControl.vue'
import type { TagTypePermission } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { computed, ref } from 'vue'

const { filterBy } = useHelper()
const current = ref<TagTypePermission>({})
const term = ref('')
const showEditUser = ref(false)
const filterTag = ref('')
const page = ref(1)
const size = ref(9)
const tagType = ref('group')

const closeGroupOn = (type: string) => {
	showEditUser.value = false
	if (type === 'save') {
		useTagStore().initTagPage()
	}
}

const addNewGroup = () => {
	current.value = {}
	showEditUser.value = true
}

const tags = computed(() => {
	if (filterTag.value) {
		return useTagStore().tags.filter((o) => o.role === filterTag.value)
	}
	return useTagStore().tags
})

const currentUser = computed(() => {
	return cloneDeep(useTagStore().currentUser || {})
})

const grantTags = computed(() => {
	return useTagStore().grantTags
})

const resetPage = () => {
	page.value = 1
	size.value = 9
}

const addTag = (tag: TagTypePermission) =>
	useTagStore().add({
		to: 'grant',
		tag
	})

const removeTag = (tag: TagTypePermission) =>
	useTagStore().remove({
		from: 'grant',
		tag
	})

const hasTags = (tag: TagTypePermission) => {
	return grantTags.value.some((t) => t.userId === tag.userId)
}

const loading = computed(() => {
	return useTagStore().loading
})

const hasFilteredTags = computed(() => {
	return filterBy(tags.value, 'name', term.value).filter((t) => t.role === tagType.value).length > 0
})

const hasFilteredTagsOfOnlyUsers = computed(() => {
	return filterBy(tags.value, 'name', term.value).filter((t) => t.role !== 'group').length > 0
})

const filter = (tagData: TagTypePermission) => {
	resetPage()
	current.value = tagData
	term.value = ''
	useTagStore().listByTagType(tagData)
	useTagStore().currentUser = tagData

	console.log(useTagStore().currentUser)
}

const saveAll = () => {
	resetPage()
	const localTags = cloneDeep(tags.value)
	localTags.filter((o) => o.type === tagType.value)
	localTags.forEach((tag) => {
		if (!tag.role) {
			tag.role = 'view'
		}
		addTag(tag)
	})
}
</script>

<style lang="scss">
.tag-users {
	.user-role {
		cursor: pointer;
		border-radius: 4px;
		display: inline-block;
		margin-right: 4px;
		width: 22px;
		color: #fff;
		text-align: center;
		font-weight: bold;
		font-size: 11px;
		height: 17px;
		padding-top: 2px;
		line-height: 15px;
	}
}
</style>
