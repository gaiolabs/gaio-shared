<template>
	<div class="task-task-insights">
		<div v-if="!localMeta?.tableName">
			<g-alert :title="$t('selectTable')" />
		</div>
		<div v-else-if="localMeta?.options?.insights">
			<g-alert :title="$t('taskInsightsHelp')" />

			<n-tabs
				type="line"
				class="inner-tabs"
			>
				<n-tab-pane
					:tab="$t('general')"
					name="general"
				>
					<div class="g-card control p-2">
						<div class="control">
							<div class="control-label">{{ $t('date', 2) }}</div>
							<g-select-column
								v-model="localMeta.options.insights.date"
								:table-name="localMeta.tableName"
								:data-type-filter="['date', 'datetime']"
								multiple
							/>
						</div>
						<div class="control">
							<div class="control-label">{{ $t('dimension', 2) }}</div>
							<g-select-column
								v-model="localMeta.options.insights.dimension"
								multiple
								:table-name="localMeta.tableName"
								:data-type-filter="['text', 'uuid']"
							/>
						</div>
						<div class="control">
							<div class="control-label">
								{{ $t('measure') }}
								{{ $t('type') }}
							</div>
							<n-select
								v-model:value="localMeta.options.insights.type"
								:options="[
									{
										label: $t('field'),
										value: 'field'
									},
									{
										label: $t('computed'),
										value: 'computed'
									}
								]"
								@update:value="prepareList()"
							/>
						</div>
						<n-table v-if="localMeta.options.insights.type === 'computed'">
							<thead>
								<th>#</th>
								<th>{{ $t('field') }}</th>
								<th>{{ $t('operator') }}</th>
								<th>{{ $t('field') }}</th>
								<th>{{ $t('name') }}</th>
								<th style="width: 35px">
									<g-icon
										name="add"
										@click="addComputed"
									/>
								</th>
							</thead>
							<tbody>
								<tr
									v-for="(item, index) of localMeta.options.insights.list"
									:key="index"
								>
									<td>{{ index + 1 }}</td>
									<td>
										<g-select-column
											v-model="item.left"
											:table-name="localMeta.tableName"
											:data-type-filter="['decimal', 'integer']"
										/>
									</td>
									<td class="el-text-center">
										<n-select
											v-model:value="item.operator"
											:options="[
												{
													label: '/',
													value: '/'
												},
												{
													label: '*',
													value: '*'
												}
											]"
										/>
									</td>
									<td>
										<g-select-column
											v-model="item.right"
											:table-name="localMeta.tableName"
											:data-type-filter="['decimal', 'integer']"
										/>
									</td>
									<td>
										<n-input
											v-model:value="item.label"
											v-alpha
										/>
									</td>
									<td>
										<g-icon
											v-if="localMeta.options.insights.list.length > 1"
											name="delete"
											@click="removeComputed(index)"
										/>
									</td>
								</tr>
							</tbody>
						</n-table>
						<div
							v-if="localMeta.options.insights.type === 'field'"
							class="control"
						>
							<div class="control-label">{{ $t('measure', 2) }}</div>
							<g-select-column
								v-model="localMeta.options.insights.measure"
								multiple
								:table-name="localMeta.tableName"
								:data-type-filter="['decimal', 'integer']"
							/>
						</div>
					</div>
				</n-tab-pane>
				<n-tab-pane
					:tab="$t('advanced')"
					name="advanced"
				>
					<div class="g-card px-3 py-2">
						<!-- DEFAULTS GENERAL -->
						<div class="control">
							{{ $t('default') }} {{ $t('period') }}
							<n-select
								v-model:value="localMeta.options.period"
								:options="[
									{
										label: $t('daily'),
										value: 'daily'
									},
									{
										label: $t('weekly'),
										value: 'weekly'
									},
									{
										label: $t('monthly'),
										value: 'monthly'
									}
								]"
							/>
						</div>
						<div class="control">
							{{ $t('growthPercentage') }} (%)
							<n-input-number
								v-model:value="temporaryPercentage"
								:min="1"
								:max="100"
								:step="1"
							/>
						</div>

						<div class="control">
							{{ $t('numeric') }}/{{ $t('decimalSize') }}
							<n-input-number
								v-model:value="localMeta.options.numberFormat.formatDecimalSize"
								:min="1"
								:step="1"
								:max="8"
							/>
						</div>
						<div class="control">
							{{ $t('percent') }}/{{ $t('decimalSize') }}
							<n-input-number
								v-model:value="localMeta.options.percentFormat.formatDecimalSize"
								:min="1"
								:step="1"
								:max="8"
							/>
						</div>
						<div class="control">
							{{ $t('separator') }}
							<div class="control-top">
								<n-switch
									v-model:value="separator"
									active-value="dotComma"
									inactive-value="commaDot"
									@update:value="defineSeparators()"
								>
									<template #checked>
										{{ $t('dotComma') }}
									</template>
									<template #unchecked>
										{{ $t('commaDot') }}
									</template>
								</n-switch>
							</div>
						</div>
						<div class="control">
							<n-checkbox v-model:checked="localMeta.options.inverted" />
							{{ $t('invertColors') }}
						</div>
						<!--SCHEDULE INIT-->
						<div
							v-if="showInsightsButton"
							class="control-top d-flex w-100"
						>
							<div class="g-card">
								<div class="d-flex align-items-center justify-content-between">
									<n-switch
										v-model:value="localMeta.options.schedule"
										:active-text="$t('lang.SCHEDULE_INSIGHTS_ALERTS')"
									/>

									<div v-if="localMeta.options.schedule && localMeta.id">
										<n-tooltip
											:persistent="false"
											placement="top"
										>
											<template #trigger>
												<n-button
													type="primary"
													:loading="generateInsightLoading"
													@click="save()"
												>
													{{ $t('lang.SAVE_AND_RUN') }}
												</n-button>
											</template>
											{{ $t('lang.SCHEDULE_INSIGHTS_ALERTS_INFO') }}
										</n-tooltip>
									</div>
								</div>
								<div v-if="localMeta.options.schedule">
									<!--                            <n-divider  />-->
									<!--                            <div class="w-100 d-flex align-items-center">-->
									<!--                                <cron-element-plus-->
									<!--                                    v-model="localMeta.cron"-->
									<!--                                    :locale="useAuthStore().user.lang"-->
									<!--                                    :button-props="{ type: 'primary' }"-->
									<!--                                />-->
									<!--                            </div>-->
								</div>
							</div>
						</div>
						<!--SCHEDULE END-->
					</div>
				</n-tab-pane>
			</n-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { MetaType } from '@gaio/shared/types'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{ localMeta: MetaType }>()

const separator = ref('dotComma')
const temporaryPercentage = ref(0)
const generateInsightLoading = ref(false)

const showInsightsButton = computed(() => {
	return false
	// return this.$store.state.settings.newInsights
})

// deleteInsightSchedule(task) {
//     if (task.id) {
//         http.post('insights/delete-insights', {
//             insightId: task.id,
//             appId: task.appId,
//             flowId: this.$store.state.app.flow.flowId
//         })
//     }
// }

const addComputed = () => {
	props.localMeta.options.insights.list.push({
		left: '',
		operator: '=',
		right: ''
	})
}

const removeComputed = (index: number) => {
	props.localMeta.options.insights.list.splice(index, 1)
}

const prepareList = () => {
	switch (props.localMeta.options.insights.type) {
		case 'field':
			props.localMeta.options.insights.list = []
			break
		default:
			props.localMeta.options.insights.list = [{ left: '', operator: '*', right: '' }]
			props.localMeta.options.schedule = false
			break
	}
}

const save = () => {}

// async generateInsight() {
//     if (this.localMeta.id) {
//         this.generateInsightLoading = true
//
//         await http.post('insights/generate-insights', {
//             insightData: {
//                 appId: this.$store.state.app.app.appId,
//                 flowId: this.$store.state.app.flow.flowId,
//                 insightId: this.localMeta.id
//             }
//         })
//
//         this.generateInsightLoading = false
//     }
// }

const defineSeparators = () => {
	props.localMeta.options.numberFormat.separators = separator.value
	props.localMeta.options.percentFormat.separators = separator.value
}

watch(
	() => temporaryPercentage.value,
	(value) => {
		props.localMeta.options.growthPercentage = value / 100
	}
)

onMounted(() => {
	temporaryPercentage.value = (props.localMeta.options.growthPercentage || 1) * 100
})
</script>

<style>
.g-modal .n-tabs .n-tabs-nav,
.g-modal .n-tabs-nav-scroll-wrapper {
	background: transparent !important;
}
</style>
