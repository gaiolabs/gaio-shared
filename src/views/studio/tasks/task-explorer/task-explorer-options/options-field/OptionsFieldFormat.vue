<template>
	<div class="options-field-format control-secondary">
		<!-- TYPE -->
		<div class="control">
			<div class="control-label">{{ $t('formatType') }}</div>
			<NSelect
				v-model:value="useReportStore().currentField.formatType"
				:options="[
					{
						label: $t('none'),
						value: 'none'
					},
					{
						label: $t('decimal'),
						value: 'decimal'
					},
					{
						label: $t('percentage'),
						value: 'percentage'
					},
					{
						label: $t('date'),
						value: 'date'
					},
					{
						label: $t('yearMoth'),
						value: 'yearMonth'
					}
				]"
			/>
		</div>
		<div v-if="useReportStore().currentField.formatType !== 'yearMonth'">
			<div
				v-if="useReportStore().currentField.formatType !== 'none'"
				class="formats"
			>
				<!-- DECIMAL SIZE -->
				<div
					v-if="useReportStore().currentField.formatType !== 'date'"
					class="control"
				>
					<div class="control-label">
						{{ $t('decimalSize') }}
					</div>
					<NInputNumber v-model:value="useReportStore().currentField.formatDecimalSize" />
				</div>
				<!-- SEPARATORS -->
				<div
					v-if="useReportStore().currentField.formatType !== 'date'"
					class="control"
				>
					<div class="control-label">
						{{ $t('separators') }}
					</div>
					<NSelect
						v-model:value="useReportStore().currentField.separators"
						:options="[
							{
								label: $t('none'),
								value: 'none'
							},
							{
								label: $t('dotComma'),
								value: 'dotComma'
							},
							{
								label: $t('noneComma'),
								value: 'noneComma'
							},
							{
								label: $t('commaDot'),
								value: 'commaDot'
							},
							{
								label: $t('noneDot'),
								value: 'noneDot'
							}
						]"
					/>
				</div>
				<div
					v-if="useReportStore().currentField.formatType === 'date'"
					class="control"
				>
					<div class="control-label">
						{{ $t('date') }}
					</div>
					<NInput v-model:value="useReportStore().currentField.formatDate">
						<!--                        <template #suffix>-->
						<!--                            <el-popover-->
						<!--                                placement="top-start"-->
						<!--                                :title="$t('lang.USE_EXAMPLES')"-->
						<!--                                width="350"-->
						<!--                                trigger="hover"-->
						<!--                            >-->
						<!--                                <div class="examples">-->
						<!--                                    <table class="table-sm table-striped table-bordered table">-->
						<!--                                        <tbody>-->
						<!--                                            <tr>-->
						<!--                                                <td-->
						<!--                                                    class="el-cursor"-->
						<!--                                                    @click="-->
						<!--                                                        useReportStore().currentField.formatDate = 'DD/MM/YYYY'-->
						<!--                                                        changeInput()-->
						<!--                                                    "-->
						<!--                                                >-->
						<!--                                                    DD/MM/YYYY-->
						<!--                                                </td>-->
						<!--                                            </tr>-->
						<!--                                            <tr>-->
						<!--                                                <td-->
						<!--                                                    class="el-cursor"-->
						<!--                                                    @click="-->
						<!--                                                        useReportStore().currentField.formatDate = 'DD/MM/YY'-->
						<!--                                                        changeInput()-->
						<!--                                                    "-->
						<!--                                                >-->
						<!--                                                    DD/MM/YY-->
						<!--                                                </td>-->
						<!--                                            </tr>-->
						<!--                                            <tr>-->
						<!--                                                <td-->
						<!--                                                    class="el-cursor"-->
						<!--                                                    @click="-->
						<!--                                                        useReportStore().currentField.formatDate = 'DD/MMM/YY'-->
						<!--                                                        changeInput()-->
						<!--                                                    "-->
						<!--                                                >-->
						<!--                                                    DD/MMM/YY-->
						<!--                                                </td>-->
						<!--                                            </tr>-->
						<!--                                            <tr>-->
						<!--                                                <td-->
						<!--                                                    class="el-cursor"-->
						<!--                                                    @click="-->
						<!--                                                        useReportStore().currentField.formatDate = 'DD [de] MMM [de] YYYY'-->
						<!--                                                        changeInput()-->
						<!--                                                    "-->
						<!--                                                >-->
						<!--                                                    DD [de] MMM [de] YYYY-->
						<!--                                                </td>-->
						<!--                                            </tr>-->
						<!--                                            <tr>-->
						<!--                                                <td-->
						<!--                                                    class="el-cursor"-->
						<!--                                                    @click="-->
						<!--                                                        useReportStore().currentField.formatDate = 'DD/MMM/YY hh:mm:ss'-->
						<!--                                                        changeInput()-->
						<!--                                                    "-->
						<!--                                                >-->
						<!--                                                    DD/MMM/YY hh:mm:ss-->
						<!--                                                </td>-->
						<!--                                            </tr>-->
						<!--                                        </tbody>-->
						<!--                                    </table>-->
						<!--                                </div>-->
						<!--                                <template #reference>-->
						<!--                                    <span>-->
						<!--                                        <g-icon name="g-info el-primary el-cursor" />-->
						<!--                                    </span>-->
						<!--                                </template>-->
						<!--                            </el-popover>-->
						<!--                        </template>-->
					</NInput>
				</div>
			</div>
			<div class="control">
				<div class="control-label">{{ $t('prefix') }}</div>
				<NInput v-model:value="useReportStore().currentField.formatPrefix" />
			</div>
			<div class="control">
				<div class="control-label">{{ $t('suffix') }}</div>
				<NInput v-model:value="useReportStore().currentField.formatSuffix" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// mounted() {
//     this.useReportStore().currentField = this.$cloneDeep(this.$props.field)
//     this.useReportStore().currentField.formatType = this.useReportStore().currentField.formatType || 'none'
//
//     if (!this.useReportStore().currentField.formatType || this.useReportStore().currentField.formatType === 'none') {
//         this.useReportStore().currentField.formatDecimalSize = 2
//
//         if (['pt-BR', 'pt_BR'].includes(this.user.lang)) {
//             this.useReportStore().currentField.separators = 'dotComma'
//         } else {
//             this.useReportStore().currentField.separators = 'commaDot'
//         }
//     }
// }
import { useReportStore } from '@/stores'
</script>
