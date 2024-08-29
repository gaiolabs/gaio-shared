<template>
	<div
		v-if="localCron"
		class="cron-base mb-3"
	>
		<!-- EVERY  -->
		<div class="mb-3">
			<div class="flex items-center gap-2">
				<div class="cron-reference g-text-100">
					{{ $t('cronEvery') }}
				</div>
				<div class="grow">
					<n-select
						v-model:value="localCron.every"
						size="small"
						filterable
						class="w-full"
						:options="forEveryOptions"
						@update:value="onChangeBaseReset()"
					/>
				</div>
			</div>
		</div>
		<!-- WEEKLY -->
		<div
			v-if="localCron.every == 4"
			class="mb-3"
		>
			<div class="flex items-center gap-2">
				<div class="cron-reference">
					{{ $t('cronOnWeekDay') }}
				</div>
				<div class="grow">
					<n-select
						v-model:value="localCron.dayValues"
						size="small"
						filterable
						class="w-full"
						multiple
						:options="dayValues.map((item) => ({ value: item, label: $t(cronDayName[item]) }))"
						@update:value="onChangeFrequency()"
					/>
				</div>
			</div>
		</div>
		<!-- MONTHLY -->
		<div
			v-if="localCron.every >= 5"
			class="mb-3"
		>
			<div class="flex items-center gap-2">
				<div class="cron-reference">
					{{ $t('cronOnTheDay') }}
				</div>
				<div class="grow">
					<n-select
						v-model:value="localCron.dayOfMonthValues"
						size="small"
						filterable
						class="w-full"
						multiple
						:options="dayOfMonthValues.map((item) => ({ value: item, label: cronNumeral(item) }))"
						@update:value="onChangeFrequency()"
					/>
				</div>
			</div>
		</div>
		<!-- YEARLY -->
		<div
			v-if="localCron.every == 6"
			class="mb-3"
		>
			<div class="flex items-center gap-2">
				<div class="cron-reference">
					{{ $t('cronOfMonth') }}
				</div>
				<div class="grow">
					<n-select
						v-model:value="localCron.monthValues"
						size="small"
						filterable
						class="w-full"
						multiple
						:options="monthValues.map((item) => ({ value: item, label: $t(cronMonthName(item)) }))"
						@update:value="onChangeFrequency()"
					/>
				</div>
			</div>
		</div>
		<!-- DAILY -->
		<div
			v-if="localCron.every >= 3"
			class="mb-3"
		>
			<div class="flex items-center gap-2">
				<div class="cron-reference">
					{{ $t('cronAtHour') }}
				</div>
				<div class="grow">
					<n-select
						v-model:value="localCron.hourValues"
						size="small"
						filterable
						class="w-full"
						multiple
						:options="hourValues.map((item) => ({ value: item, label: item }))"
						@update:value="onChangeFrequency()"
					/>
				</div>
			</div>
		</div>
		<!-- HOUR AND OTHERS -->
		<div
			v-if="localCron.every >= 2"
			class="mb-3"
		>
			<div class="flex items-center gap-2">
				<div class="cron-reference">
					<span
						v-if="localCron.every == 2"
						class="col-sm-2"
					>
						{{ $t('cronAtMinute') }}
					</span>
					<span
						v-if="localCron.every >= 3"
						class="col-sm-2"
					>
						{{ $t('cronAtMinute') }}
					</span>
				</div>
				<div class="grow">
					<n-select
						v-model:value="localCron.minuteValues"
						size="small"
						filterable
						multiple
						class="w-full"
						:options="minuteValues.map((item) => ({ value: item, label: item }))"
						@update:value="onChangeFrequency()"
					/>
				</div>
			</div>
		</div>
		<div
			v-if="localCron.every && cronBase.current"
			class="flex items-start gap-2"
		>
			<div class="cron-reference">{{ cronBase.current }}</div>
			<div class="grow rounded border-elevation-2 bg-paper-100 dark:bg-carbon-200">
				<div class="min-h-[26px] px-2">
					{{ localExpression }}
				</div>
			</div>
		</div>
		<div
			v-if="localCron.every"
			class="my-3 flex items-start gap-2"
		>
			<div class="cron-reference">{{ $t('status') }}</div>
			<div class="grow">
				<n-select
					v-model:value="localCron.status"
					size="small"
					filterable
					class="w-full"
					:options="[
						{ value: 'active', label: $t('active') },
						{ value: 'inactive', label: $t('inactive') }
					]"
					@update:value="onChangeFrequency()"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import cronstrue from 'cronstrue'
import 'cronstrue/locales/es'
import 'cronstrue/locales/en'
import 'cronstrue/locales/pt_BR'
import { cloneDeep } from 'lodash-es'
import { ref, onMounted, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import {
	CronNumeral,
	CronMonthName,
	CronBaseHelper,
	CronDayName,
	frequency as _frequency,
	minuteValues as _minuteValues,
	hourValues as _hourValues,
	dayOfMonthValues as _dayOfMonthValues,
	dayValues as _dayValues,
	monthValues as _monthValues
} from './CronBaseHelper'
import type { CronBaseType } from '@gaio/shared/types'

const { t } = useI18n()

const emit = defineEmits(['close', 'change'])
const props = defineProps({
	lang: {
		type: String,
		default: 'en'
	},
	cronBase: {
		type: Object as PropType<CronBaseType>,
		default: () => ({
			status: 'active',
			every: '',
			current: '* * * * *',
			minuteValues: [],
			hourValues: [],
			dayValues: [],
			dayOfMonthValues: [],
			monthValues: []
		})
	}
})

const localExpression = ref('')

const localCron = ref<CronBaseType>()
let firstTime = 0

const cronDayName = CronDayName
const cronNumeral = CronNumeral
const cronMonthName = CronMonthName

let frequency = _frequency
let minuteValues = _minuteValues
let hourValues = _hourValues
let dayOfMonthValues = _dayOfMonthValues
let dayValues = _dayValues
let monthValues = _monthValues

watch(
	() => localCron.value,
	(newValue) => {
		if (localCron.value.current && `${localCron.value.current || ''}`.length !== 9) {
			if (firstTime > 0) {
				emit('change', newValue)
			}
		}
		firstTime++
	},
	{
		deep: true
	}
)

const onChangeFrequency = () => {
	const copyLocalCron = cloneDeep(localCron.value)
	localCron.value.current = new CronBaseHelper().setCron(copyLocalCron)
	defineCronExpression()
}

const onChangeBaseReset = () => {
	if (localCron.value.every !== undefined) {
		const initialState = {
			dayValues: [],
			hourValues: [],
			monthValues: [],
			minuteValues: [],
			dayOfMonthValues: [],
			status: localCron.value.status || 'inactive'
		}
		localCron.value = cloneDeep({
			...localCron.value,
			...initialState
		})
	} else {
		localCron.value = {
			every: undefined,
			status: localCron.value.status || 'inactive'
		}
	}
	onChangeFrequency()
}

const defineCronExpression = () => {
	try {
		if (localCron.value.current && `${localCron.value.current}`?.length >= 9) {
			localExpression.value = cronstrue.toString(`${localCron.value.current}`, {
				locale: props.lang,
				use24HourTimeFormat: true
			})
		}
	} catch (e) {
		localExpression.value = ''
	}
}

const forEveryOptions = [{ value: undefined, label: t('none') }].concat(
	frequency.map((item) => ({ value: item.value, label: t(item.label) }))
)

onMounted(() => {
	localCron.value = cloneDeep(props.cronBase || {})
	localCron.value.every = localCron.value.every || undefined
	defineCronExpression()
})
</script>

<style lang="scss">
.cron-base {
	.cron-reference {
		border-radius: 4px;
		min-width: 250px;
		max-width: 250px;
		background: var(--elevation-primary-supplementar);
		text-align: right;
		font-weight: normal;
		min-height: 20px;
		margin-top: 1px;
		padding-top: 2px;
		padding-bottom: 2px;
		padding-right: 5px !important;
		padding-left: 0;
		color: var(--elevation-invert);
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
}
</style>
