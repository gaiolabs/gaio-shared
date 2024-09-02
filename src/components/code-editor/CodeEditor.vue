<template>
	<div ref="element" v-height class="sql-model">
		<codemirror
			v-if="!loading"
			v-model="code"
			class="overflow-hidden rounded"
			basic
			:extensions="extensions"
			:wrap="true"
			style="min-height: 100% !important"
			@ready="handleReady"
			@change="changeState"
		/>
	</div>
</template>

<script lang="ts" setup>
import type { Completion } from '@codemirror/autocomplete'
import { sql } from '@codemirror/lang-sql'
import { cobalt } from 'thememirror'
import { computed, onBeforeMount, ref, shallowRef, watch } from 'vue'
import Codemirror from 'vue-codemirror6'

const props = defineProps({
	labels: {
		type: Array,
		default: () => []
	},
	readonly: {
		type: Boolean,
		default: false
	},
	language: {
		type: String,
		default: 'sql'
	},
	modelValue: {
		type: String,
		default: ''
	},
	height: {
		type: String,
		default: '100%'
	}
})

const element = ref()

const emit = defineEmits(['update:modelValue'])

const loading = ref(true)
const code = ref('')
const extensions = [cobalt]

watch(
	() => code.value,
	() => {
		emit('update:modelValue', code.value)
	}
)

const changeState = (ev) => {
	console.log(ev)
}

const view = shallowRef()
const handleReady = (payload) => {
	view.value = payload.view
}

const localHeight = computed(() => {
	return props.height
})

onBeforeMount(() => {
	code.value = props.modelValue
	loading.value = true

	if (props.language === 'sql') {
		extensions.push(
			sql({
				schema: {},
				tables: props.labels.map((label) => {
					return {
						label
					}
				}) as Completion[]
			})
		)
	}

	loading.value = false
})
</script>

<style scoped lang="scss">
.sql-model {
	//height: 100%;
	//min-height: 200px;
	width: 100%;
	border-top-right-radius: 4px;
	border-top-left-radius: 4px;

	:deep(.cm-editor) {
		height: v-bind(localHeight);

		&.cm-focused {
			outline: none !important;
		}

		&.cm-focused .cm-selectionBackground,
		&.cm-selectionBackground {
			background: #439af15f;
		}
	}

	:deep(.cm-scroller) {
		overflow: auto;
	}
}
</style>
