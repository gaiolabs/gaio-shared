<template>
	<settings-view>
		<template #title>
			<div>
				<g-icon
					name="shieldAccount"
					:height="22"
				/>
				{{ $t('userPermissions') }}
			</div>
		</template>
		<div class="tag-manager">
			<template v-if="useTagStore().loading">
				<n-space vertical>
					<n-skeleton
						:height="30"
						class="rounded"
					/>
					<!--                    <div class="flex gap-2">-->
					<!--                        <n-skeleton-->
					<!--                            :height="60"-->
					<!--                            class="rounded"-->
					<!--                        />-->
					<!--                        <n-skeleton-->
					<!--                            :height="60"-->
					<!--                            class="rounded"-->
					<!--                        />-->
					<!--                    </div>-->
					<!--                    <div class="flex gap-2">-->
					<!--                        <n-skeleton-->
					<!--                            :height="110"-->
					<!--                            class="rounded"-->
					<!--                        />-->
					<!--                        <n-skeleton-->
					<!--                            :height="110"-->
					<!--                            class="rounded"-->
					<!--                        />-->
					<!--                    </div>-->
				</n-space>
			</template>
			<template v-else>
				<div class="g-bg-1 mb-3 flex items-center justify-between rounded p-2 shadow">
					<div>{{ $t('selectTagsBelow') }}</div>
					<div class="flex gap-2">
						<n-button
							type="primary"
							:disabled="canAction"
							@click="addTag"
						>
							{{ $t('grant') }}
						</n-button>
						<n-button
							type="error"
							:disabled="canAction"
							@click="removeTag"
						>
							{{ $t('remove') }}
						</n-button>
						<n-button
							tertiary
							@click="reset()"
						>
							{{ $t('clear') }}
						</n-button>
					</div>
				</div>
				<div>
					<splitpanes horizontal>
						<pane class="pb-2">
							<splitpanes>
								<pane :size="50">
									<tag-manager-grant class="card-box" />
								</pane>
								<pane :size="50">
									<tag-manager-resource class="card-box" />
								</pane>
							</splitpanes>
						</pane>
						<pane :size="80">
							<splitpanes class="my-1">
								<pane>
									<tag-manager-user />
								</pane>
								<pane>
									<tag-manager-app />
								</pane>
								<pane>
									<tag-manager-source />
								</pane>
							</splitpanes>
						</pane>
					</splitpanes>
				</div>
			</template>

			<!--        <g-dialog-->
			<!--            v-if="showSpecialButton"-->
			<!--            :title="$t('lang.SPECIAL_PERMISSIONS')"-->
			<!--            :model-value="showSpecialButton"-->
			<!--            :close-on-click-modal="false"-->
			<!--            @close="showSpecialButton = false"-->
			<!--        >-->
			<!--            <div class="modal-body">-->
			<!--                <div>-->
			<!--                    {{ $t('lang.PYTHON') }} ({{ $t('lang.GROUPS') }})-->
			<!--                    <n-select-->
			<!--                        v-model:value="specialPermissions.python"-->
			<!--                        filterable-->
			<!--                        class="w-100"-->
			<!--                        multiple-->
			<!--                        :placeholder="$t('lang.SELECT')"-->
			<!--                        value-field="userId"-->
			<!--                        label-field="name"-->
			<!--                        :options="groups"-->
			<!--                        @update:value="changeSpecialPermissions"-->
			<!--                    />-->
			<!--                </div>-->
			<!--            </div>-->
			<!--        </g-dialog>-->
		</div>
	</settings-view>
</template>

<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'

import useApi from '@/composables/useApi'
import { useTagStore } from '@/stores'
import SettingsView from '@/views/settings/SettingsView.vue'
import TagManagerApp from '@/views/settings/tag-manager/TagManagerApp.vue'
import TagManagerGrant from '@/views/settings/tag-manager/TagManagerGrant.vue'
import TagManagerResource from '@/views/settings/tag-manager/TagManagerResource.vue'
import TagManagerSource from '@/views/settings/tag-manager/TagManagerSource.vue'
import TagManagerUser from '@/views/settings/tag-manager/TagManagerUser.vue'
import { useMessage } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { computed, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const message = useMessage()

const canAction = computed(() => {
	return !(useTagStore().resourceTags.length > 0 && useTagStore().grantTags.length > 0)
})

const addTag = () => {
	message.warning(t('commandSent'))
	useApi()
		.post('api/settings/tag/grant', {
			body: {
				userList: useTagStore().grantTags,
				tagList: useTagStore().resourceTags
			}
		})
		.then(() => message.warning('permissionsGranted'))
	useTagStore().resetState()
}

const removeTag = () => {
	message.warning(t('commandSent'))

	useApi()
		.post('api/settings/tag/remove', {
			body: {
				userList: useTagStore().grantTags,
				tagList: useTagStore().resourceTags
			}
		})
		.then(() => message.warning('permissionsRemoved'))
	useTagStore().resetState()
}

const reset = () => useTagStore().initTagPage()

onBeforeMount(() => {
	useTagStore().initTagPage()
})
</script>

<style lang="scss">
.tag-manager {
	//height: calc(100vh - 70px);

	.card-box {
		height: calc(100% - 2px);
	}

	.card-tags {
		margin: 0;
		height: 100%;
		overflow: hidden;
	}

	.actions {
		margin: 0;
		padding: 5px;
		height: calc(100% - 2px);
		background: #fff;

		button {
			margin: 10px 0 3px;
		}
	}

	.splitpanes.default-theme .splitpanes__pane,
	.splitpanes.default-theme .splitpanes__splitter {
		background-color: transparent;
		border: 0;
		-webkit-box-shadow: initial;
		box-shadow: initial;
	}

	.n-card,
	.n-card.is-always-shadow {
		background: #fff;
		border: 1px solid #ddd;
	}

	.table td {
		vertical-align: middle;
		white-space: nowrap !important;
	}

	.table-responsive {
		//width: 98% !important;
		padding: 2px;
	}
}
</style>
