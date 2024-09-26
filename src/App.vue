<template>
	<router-view
		v-slot="{ Component }"
		class="antialiased"
	>
		<transition name="fade">
			<NConfigProvider
				:theme="useDarkTheme"
				:theme-overrides="themeOverrides"
				inline-theme-disabled
				preflight-style-disabled
				class="size-full"
			>
				<NMessageProvider>
					<component :is="Component" />
				</NMessageProvider>
			</NConfigProvider>
		</transition>
	</router-view>
	<div
		v-if="debugMode"
		class="flex flex-col gap-1 fixed bottom-0 right-0 z-50"
	>
		<pre class="bg-black w-96 max-h-[75vh] overflow-auto text-xs text-[#0f0] font-mono p-1">Mode: {{ mode }}</pre>
		<pre class="bg-black w-96 max-h-[75vh] overflow-auto text-xs text-[#0f0] font-mono p-1">Is Dark: {{ isDark }}</pre>
		<pre class="bg-black w-96 max-h-[75vh] overflow-auto text-xs text-[#0f0] font-mono p-1">User: {{ user }}</pre>
	</div>
	<div
		v-if="debugMode"
		class="fixed font-mono right-0 top-0 bg-black text-[#0f0] p-1"
	>
		<h1 class="font-bol">App.vue</h1>
		<div class="flex gap-1">
			<div
				class="p-1"
				:class="{ 'bg-[#0f0] text-black': F2 }"
			>
				F2
			</div>
			<div
				class="p-1"
				:class="{ 'bg-[#0f0] text-black': F4 }"
			>
				F4
			</div>
		</div>
		<div class="flex gap-1">
			<button
				v-if="!isDark"
				class="bg-[#0f0] px-2 text-black"
				@click="toggleDark()"
			>
				Set Dark Mode
			</button>
			<button
				v-else
				class="bg-[#0f0] px-2 text-black"
				@click="toggleDark()"
			>
				Set Light Mode
			</button>
		</div>
	</div>
	<command-k
		v-if="useCommandKStore().show"
		@close="useCommandKStore().show = false"
	/>
</template>

<script setup lang="ts">
import { useAuthStore, useCommandKStore } from '@/stores'
import CommandK from '@/views/commandK/CommandK.vue'
import { useColorMode, useMagicKeys } from '@vueuse/core'
import { useDark, useToggle } from '@vueuse/core'
import { darkTheme, NMessageProvider, NConfigProvider } from 'naive-ui'
import { computed, nextTick, onMounted, watch, watchEffect } from 'vue'
import { RouterView } from 'vue-router'
const mode = useColorMode()
const isDark = useDark()
const toggleDark = useToggle(isDark)
// const mode = useColorMode()
const user = computed(() => useAuthStore().user)
const debugMode = ref(false)
const toggleDebugMode = useToggle(debugMode)
// watch(
// 	() => user.value,
// 	() => {
// 		if (user.value?.options.userThemeMode) {
// 			mode.value = user.value.options.userThemeMode as 'dark' | 'light' | 'auto'
// 		} else {
// 			mode.value = 'auto'
// 		}
// 	},
// 	{
// 		deep: true,
// 		immediate: true,
// 	},
// )

const { k, p, i, a, t, shift, meta, tab, F2, F4 } = useMagicKeys({
	passive: true,
})

watch(F2, (value) => {
	if (value) {
		toggleDark()
	}
})

watch(F4, (value) => {
	if (value) {
		toggleDebugMode()
	}
})

watchEffect(() => {
	if (tab.value) {
		if (useCommandKStore().show) {
			switch (useCommandKStore().tab) {
				case 'power':
					useCommandKStore().tab = 'insights'
					break
				case 'insights':
					useCommandKStore().tab = 'table'
					break
				case 'table':
					useCommandKStore().tab = 'flow'
					break
				case 'flow':
					useCommandKStore().tab = 'all'
					break
				case 'all':
					useCommandKStore().tab = 'power'
					break
			}
		}
	}
	if (meta.value && k.value) useCommandKStore().show = true
	else {
		if (meta.value && shift.value && p.value) {
			useCommandKStore().tab = 'power'
			useCommandKStore().show = true
		} else if (meta.value && shift.value && i.value) {
			useCommandKStore().tab = 'insights'
			useCommandKStore().show = true
		} else if (meta.value && shift.value && a.value) {
			useCommandKStore().tab = 'all'
			useCommandKStore().show = true
		} else if (meta.value && shift.value && t.value) {
			useCommandKStore().tab = 'table'
			useCommandKStore().show = true
		}
	}
})

const themeOverridesLight = {
	common: {
		primaryColor: '#AB612B',
		primaryColorHover: '#bb692c', // 'rgb( 210, 139, 85)'
		primaryColorPressed: '#a45d29', //  'rgb( 190, 119, 65)',
		primaryColorSuppl: '#cf7a41',
		borderRadius: '4px',
		borderRadiusSmall: '2px',
		heightTiny: '22px',
		heightSmall: '26px',
		heightMedium: '26px',
		heightLarge: '28px',
		popoverColor: '#FEFDFB',
		tableColorHover: '#F9F9F8',
		tableColorStriped: '#F9F9F8',
		tableHeaderColor: '#F9F9F8',
	},
	Button: {
		textColorPrimary: '#FEFDFB',
		textColorHoverPrimary: '#FEFDFB',
		textColorPressedPrimary: '#FEFDFB',
		textColorFocusPrimary: '#FEFDFB',
		textColorDisabledPrimary: '#FEFDFB',
	},
	Table: {
		thPaddingSmall: '3px',
		tdPaddingSmall: '3px',
		thPaddingMedium: '5px',
		tdPaddingMedium: '5px',
	},
}

const themeOverridesDark = {
	common: {
		primaryColor: 'rgb( 230, 159, 105)',
		primaryColorHover: 'rgb( 230, 159, 105)', // 'rgb( 210, 139, 85)'
		primaryColorPressed: 'rgb( 210, 139, 85)', //  'rgb( 190, 119, 65)',
		primaryColorSuppl: 'rgb( 250, 179, 125)',
		borderRadius: '4px',
		borderRadiusSmall: '2px',
		heightTiny: '22px',
		heightSmall: '26px',
		heightMedium: '26px',
		heightLarge: '28px',
		tableColor: '#262727',
		popoverColor: '#262727',
		cardColor: '#262727',
		modalColor: '#262727',
		bodyColor: '#1D1D1D',
		tagColor: '#262727',
		invertedColor: '#FEFDFB',
		inputColor: 'rgb(0,0,0, 28%)',
	},
	Modal: {
		boxShadow: 'rgb(0,0,0, 90%)',
	},
	Button: {
		// textColorPrimary: '#444',
		// textColorHoverPrimary: '#444',
		// textColorPressedPrimary: '#444',
		// textColorFocusPrimary: '#444',
		// textColorDisabledPrimary: '#444'
	},
	Table: {
		thPaddingSmall: '3px',
		tdPaddingSmall: '3px',
		thPaddingMedium: '5px',
		tdPaddingMedium: '5px',
		tdColor: '#1D1D1D',
		thColor: '#1D1D1D',
		tdColorStriped: '#262727',
	},
}

const themeOverrides = computed(() => (mode.value === 'dark' ? themeOverridesDark : themeOverridesLight))
const useDarkTheme = computed(() => (mode.value === 'dark' ? darkTheme : null))

onMounted(() => {
	nextTick(() => {
		// useCommandKStore().tab = 'power'
		// useCommandKStore().show = true
	})
})
</script>
