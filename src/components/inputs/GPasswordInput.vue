<template>
	<NInput
		type="password"
		show-password-on="click"
		placeholder="Custom Password Toggle Icon"
		:maxlength="8"
	>
		<template #password-visible-icon>
			<IconComponent name="EyeSlash" />
		</template>
		<template #password-invisible-icon>
			<IconComponent name="Eyeasd" />
		</template>
	</NInput>
</template>

<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
</script>
