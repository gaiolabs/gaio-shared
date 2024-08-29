<template>
	<div class="command-power-tags flex gap-2">
		<div
			v-for="(tag, index) of usePowerStore().tags"
			:key="index"
			class="tag flex items-center gap-2 px-2 py-[2px]"
			:class="className(tag)"
		>
			<div class="tag-options">v</div>
			<div class="flex-grow">
				{{ tagName(tag) }}
			</div>
			<div @click="removeTag(tag)">x</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import useDataType from '@/composables/useDataType'
import { usePowerStore } from '@/stores'
import type { FieldType } from '@gaio/shared/types'

const { dataTypeIsNumeric, dataTypeIsDate } = useDataType()

const removeTag = (tag: FieldType) => {
	usePowerStore().tags = usePowerStore().tags.filter((t) => t.columnName !== tag.columnName)
}

const className = (field: FieldType) => {
	if (field) {
		if (field.computedId) {
			return 'color-computed'
		}

		const col = field
		if (col.content) {
			return 'color-computed'
		} else if (dataTypeIsDate(col.dataType)) {
			return 'color-date'
		} else if (dataTypeIsNumeric(col.dataType)) {
			return 'color-numeric'
		} else {
			return 'color-text'
		}
	}
}

const tagName = (field: FieldType) => {
	return field.title || field.alias || field.columnName
}
</script>

<style lang="scss">
.tag {
	.tag-options {
		border-radius: 4px;
		height: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 16px;
		font-size: 12px;
		line-height: 1;
	}

	&.color-text {
		color: #e5f1f3;
		background: #00718c;
		border: 1px solid #016c86;
		border-radius: 6px;

		.tag-options {
			background: #e5f1f3;
			color: #00718c;
		}
	}

	&.color-numeric {
		border-radius: 6px;
		border: 1px solid #cc000c;
		background: #cc000c;
		color: #fff;

		.tag-options {
			background: #fff;
			color: #cc000c;
		}
	}

	&.color-date {
		border-radius: 6px;
		border: 1px solid #995300;
		background: #995300;
		color: #fff;

		.tag-options {
			background: #fff;
			color: #995300;
		}
	}
}
</style>
