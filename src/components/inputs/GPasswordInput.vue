<template>
	<n-input
		type="password"
		show-password-on="click"
		placeholder="Custom Password Toggle Icon"
		:maxlength="8"
	>
		<template #password-visible-icon>
			<n-icon
				:size="16"
				:component="GlassesOutline"
			/>
		</template>
		<template #password-invisible-icon>
			<n-icon
				:size="16"
				:component="Glasses"
			/>
		</template>
	</n-input>
</template>

<script setup lang="ts">
// import { Eye, EyeSlash } from '
</script>
