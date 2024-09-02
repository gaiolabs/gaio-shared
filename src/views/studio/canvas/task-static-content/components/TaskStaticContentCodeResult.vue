<template>
	<div class="flex flex-col m-2 rounded bg-paper-100 dark:bg-carbon-200 h-[90vh] p-4">
		<NInputGroup class="flex justify-around">
			<NInputNumber bordered placeholder="" :update-value-on-input="true" size="large" class="rounded centered-input">
				<template #prefix>{{ $t('width') }}:</template>
				<template #suffix>px</template>
			</NInputNumber>
			<NInputNumber bordered placeholder="" :update-value-on-input="true" size="large" class="rounded centered-input">
				<template #prefix>{{ $t('height') }}:</template>
				<template #suffix>px</template>
			</NInputNumber>
		</NInputGroup>
		<div class="mt-4"><iframe :srcdoc="randomHMTL + `<script>${script}</script>`"></iframe></div>
	</div>
</template>

<script setup lang="ts">
import { NInputGroup, NInputNumber } from 'naive-ui'

const randomHMTL = `
<html lang="en">
  <head>
    <title>getElementById example</title>
  </head>
  <body>
    <p id="para">Some text here</p>
    <button onclick="changeColor('blue');">blue</button>
    <button onclick="changeColor('red');">red</button>
  </body>
</html>
`

const script = `
function changeColor(newColor) {
  const elem = document.getElementById("para");
  elem.style.color = newColor;
}

`
</script>

<style scoped lang="css">
.centered-input .n-input__input-el {
	text-align: center;
}
</style>
