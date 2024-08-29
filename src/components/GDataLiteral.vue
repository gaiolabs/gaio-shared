<template>
	<div class="date-literal">
		<n-date-picker
			v-if="localType.type"
			v-model:value="localValue"
			class="w-full"
			:placeholder="placeholderLabel"
			:type="localType.type"
			clearable
			@change="changeDateLiteral"
		>
			<template #footer>
				<div>
					<n-space size="small">
						<n-tag
							v-for="(item, index) of shortcuts"
							:key="index"
							size="small"
							@click="item.value()"
						>
							{{ item.text }}
						</n-tag>
					</n-space>
					<div
						v-if="showInfoNLiteral"
						class="my-1"
					>
						<n-input-number
							v-model:value="localNumberDateLiteral"
							size="tiny"
							:step="1"
							:min="1"
							:default-value="7"
							class="w-full"
							@update:value="defneNDays"
							@blur="defneNDays"
						>
							<template #prefix>{{ $t('days') }}:</template>
						</n-input-number>
					</div>
				</div>
			</template>
		</n-date-picker>

		<div
			v-if="showInfo"
			class="px-1"
		>
			<small class="text-primary">{{ $t('dynamic') }}: {{ translateDateLiteral(localDateLiteral) }}</small>
		</div>
	</div>
</template>
<script setup lang="ts">
import { convertToDate, isDateLiteral, isDateNumberLiteral, separateNLiteral } from '@gaio/shared/utils'
import dayjs from 'dayjs'
import { isNumber } from 'lodash-es'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const localKey = ref('any')

const { t } = useI18n()
const emit = defineEmits(['update:modelValue'])

const props = withDefaults(defineProps<{ modelValue: string; type?: string; placeholder?: string }>(), {
	modelValue: '',
	type: 'date',
	placeholder: ''
})

const localValue = ref(undefined)
const localDateLiteral = ref('')
const setLiteral = ref(false)
const localNumberDateLiteral = ref(7)

const translateDateLiteral = (literal: string) => {
	if (literal.includes('LAST_N_DAYS')) {
		const { n } = separateNLiteral(literal)
		return t(`lastNDays`, { n })
	}
	return t(`${literal}`)
}

const changeDateLiteral = () => {
	setTimeout(() => {
		if (!setLiteral.value) {
			let dt: string
			if (localType.value.type === 'datetime') {
				dt = dayjs(localValue.value).format('YYYY-MM-DD HH:mm:ss')
			} else {
				dt = dayjs(localValue.value).format('YYYY-MM-DD')
			}
			localDateLiteral.value = ''
			emit('update:modelValue', dt)
		}
		setLiteral.value = false
	})
}

const emitDateLiteral = (value: string) => {
	localDateLiteral.value = value
	emit('update:modelValue', value)
}

const shortcuts = [
	{
		text: t(`TODAY`),
		value: () => {
			setLiteral.value = true
			emitDateLiteral('TODAY')
			localValue.value = dayjs(convertToDate('TODAY')).valueOf()
			localKey.value = 'today'
		}
	},
	{
		text: t(`YESTERDAY`),
		value: () => {
			setLiteral.value = true
			emitDateLiteral('YESTERDAY')
			localValue.value = dayjs(convertToDate('YESTERDAY')).valueOf()
		}
	},
	{
		text: t(`TOMORROW`),
		value: () => {
			setLiteral.value = true
			emitDateLiteral('TOMORROW')
			localValue.value = dayjs(convertToDate('TOMORROW')).valueOf()
		}
	},
	{
		text: t(`LAST_WEEK`),
		value: () => {
			setLiteral.value = true
			emitDateLiteral('LAST_WEEK')
			localValue.value = dayjs(convertToDate('LAST_WEEK')).valueOf()
		}
	},
	{
		text: t(`NEXT_WEEK`),
		value: () => {
			setLiteral.value = true
			emitDateLiteral('NEXT_WEEK')
			localValue.value = dayjs(convertToDate('NEXT_WEEK')).valueOf()
		}
	},
	{
		text: t(`LAST_N_DAYS`),
		value: () => {
			setLiteral.value = true
			emitDateLiteral('LAST_N_DAYS:' + localNumberDateLiteral.value)
			const prepare = 'LAST_N_DAYS:' + localNumberDateLiteral.value
			emitDateLiteral(prepare)
			localValue.value = dayjs(convertToDate(prepare)).valueOf()
		}
	}
	// {
	//     text: t(`lang.NEXT_N_DAYS`),
	//     value: () => {
	//         setLiteral.value = true;
	//         const prepare = 'NEXT_N_DAYS:' + localNumberDateLiteral.value;
	//         emitDateLiteral(prepare);
	//         return convertToDate(prepare);
	//     }
	// }
]

const defneNDays = () => {
	setLiteral.value = true
	if (!localNumberDateLiteral.value || !isNumber(localNumberDateLiteral.value)) {
		localNumberDateLiteral.value = 7
	}
	emitDateLiteral('LAST_N_DAYS:' + localNumberDateLiteral.value)
	const prepare = 'LAST_N_DAYS:' + localNumberDateLiteral.value
	emitDateLiteral(prepare)
	localValue.value = dayjs(convertToDate(prepare)).valueOf()
}

const showInfo = computed(() => isDateLiteral(localDateLiteral.value))
const showInfoNLiteral = computed(() => isDateNumberLiteral(localDateLiteral.value))

const prepareValueOnInit = () => {
	if (isDateLiteral(props.modelValue)) {
		localValue.value = convertToDate(props.modelValue)
		localDateLiteral.value = props.modelValue

		const separate = separateNLiteral(localDateLiteral.value)
		if (separate.n) {
			localNumberDateLiteral.value = Number(separate.n)
		}
	} else {
		if (dayjs(props.modelValue).isValid()) {
			localValue.value = dayjs(props.modelValue).valueOf()
		}
	}
}

const localType = ref({
	type: '',
	valueFormat: ''
})

const placeholderLabel = ref('')

onMounted(() => {
	placeholderLabel.value = props.placeholder || t('chooseADate')

	if (props.type.includes('DateTime')) {
		localType.value = {
			type: 'datetime',
			valueFormat: 'yyyy-MM-dd HH:mm:ss'
		}
	} else {
		localType.value = {
			type: 'date',
			valueFormat: 'yyyy-MM-dd'
		}
	}

	prepareValueOnInit()
})
</script>
