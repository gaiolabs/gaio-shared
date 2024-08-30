<template>
	<NInput
		type="password"
		show-password-on="click"
		placeholder="Custom Password Toggle Icon"
		:maxlength="8"
	>
		<template #password-visible-icon>
			<NIcon
				:size="16"
				:component="GlassesOutline"
			/>
		</template>
		<template #password-invisible-icon>
			<NIcon
				:size="16"
				:component="Glasses"
			/>
		</template>
	</NInput>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'

// import { Eye, EyeSlash } from '
</script>
