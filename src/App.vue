<template>
	<BackgroundElements />

	<router-view
		v-slot="{ Component }"
		class="antialiased"
	>
		<transition name="fade">
			<NConfigProvider
				:theme="useDarkTheme"
				:theme-overrides="themeOverrides(isDark)"
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
		<pre class="bg-black w-96 max-h-[50vh] overflow-auto text-xs text-[#0f0] font-mono p-1">
 Mode: {{ mode }} | Is Dark: {{ isDark }}</pre
		>
		<pre
			v-if="user"
			class="bg-black w-96 max-h-[50vh] overflow-auto text-xs text-[#0f0] font-mono p-1"
		>
 Last login: {{ timeSinceLastLogin }} </pre
		>
		<pre
			v-if="user"
			class="bg-black w-96 max-h-[50vh] overflow-auto text-xs text-[#0f0] font-mono p-1"
		>
 Session Start: {{ timeSinceSessionStart }} </pre
		>
		<pre
			v-if="user"
			class="bg-black w-96 max-h-[50vh] overflow-auto text-xs text-[#0f0] font-mono p-1"
		>
 Sessions Count: {{ user.sessionCount }} </pre
		>
		<pre
			v-if="user"
			class="bg-black w-96 max-h-[50vh] overflow-auto text-xs text-[#0f0] font-mono p-1"
		>
User: {{ user }}</pre
		>
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
import bgDark from '@/assets/images/bg-dark.png'
import bg from '@/assets/images/bg-light.png'
import { useAuthStore, useCommandKStore } from '@/stores'
import BackgroundElements from '@/views/auth/BackgroundElements.vue'
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
const now = ref(new Date())
function updateNow() {
	nextTick(() => {
		now.value = new Date()
		setTimeout(updateNow, 1000)
	})
}

onMounted(() => {
	updateNow()
})

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

const timeSinceLastLogin = computed(() => {
	if (user.value) {
		return calcTimeSince(user.value.lastLogin, now.value)
	}
	return ''
})

const timeSinceSessionStart = computed(() => {
	if (user.value) {
		return calcTimeSince(user.value.sessionStart, now.value)
	}
	return ''
})

function calcTimeSince(date: Date | string, now: Date) {
	const when = typeof date === 'string' ? new Date(date) : date
	const diff = now.getTime() - when.getTime()
	return msToClock(diff)
}
function msToClock(ms: number) {
	if (ms < 0) return '0:00:00'

	const days = Math.floor(ms / 86400000)
	const hours = Math.floor((ms % 86400000) / 3600000)
	const minutes = Math.floor(((ms % 86400000) % 3600000) / 60000)
	const seconds = Math.floor((((ms % 86400000) % 3600000) % 60000) / 1000)

	let clockString = ''
	if (days > 0) clockString += `${days}d `
	clockString += String(hours) + ':'
	clockString += String(minutes).padStart(2, '0') + ':'
	clockString += String(seconds).padStart(2, '0')
	return clockString
}

const themeOverrides = (isDark: boolean) => ({
	common: {
		primaryColor: isDark ? 'rgb(230, 159, 105)' : '#AB612B',
		primaryColorHover: isDark ? 'rgb(230, 159, 105)' : '#bb692c', // 'rgb(210, 139, 85)'
		primaryColorPressed: isDark ? 'rgb(210, 139, 85)' : '#a45d29', // 'rgb(190, 119, 65)'
		primaryColorSuppl: isDark ? 'rgb(250, 179, 125)' : '#cf7a41',
		borderRadius: '4px',
		borderRadiusSmall: '2px',
		popoverColor: isDark ? '#262727' : '#FEFDFB',
		tableColor: isDark ? '#262727' : undefined,
		tableColorHover: isDark ? undefined : '#F9F9F8',
		tableColorStriped: isDark ? '#262727' : '#F9F9F8',
		tableHeaderColor: isDark ? '#1D1D1D' : '#F9F9F8',
		cardColor: isDark ? '#262727' : undefined,
		modalColor: isDark ? '#262727' : undefined,
		bodyColor: isDark ? '#1D1D1D' : undefined,
		tagColor: isDark ? '#262727' : undefined,
		invertedColor: isDark ? '#FEFDFB' : undefined,
		inputColor: isDark ? 'hsla(24, 6%, 83%, 5%)' : 'rgba(255, 255, 255, 0.6)',
		heightTiny: '24px',
		heightSmall: '26px',
		heightMedium: '30px',
		heightLarge: '36px',
	},
	Input: {
		borderRadius: '6px',
		border: isDark ? '1px solid hsla(24, 6%, 83%, 10%)' : '1px solid hsl(24, 6%, 83%)',
	},
	Modal: {
		boxShadow: isDark ? 'rgba(0, 0, 0, 0.9)' : undefined,
	},
	Divider: {
		fontWeight: '400',
		textColor: isDark ? '#57534e' : '#78716c',
	},
	Button: {
		textColorPrimary: isDark ? '#444' : '#FEFDFB',
		textColorHoverPrimary: isDark ? '#444' : '#FEFDFB',
		textColorPressedPrimary: isDark ? '#444' : '#FEFDFB',
		textColorFocusPrimary: isDark ? '#444' : '#FEFDFB',
		textColorDisabledPrimary: isDark ? '#444' : '#FEFDFB',
	},
	Table: {
		thPaddingSmall: '3px',
		tdPaddingSmall: '3px',
		thPaddingMedium: '5px',
		tdPaddingMedium: '5px',
		tdColor: isDark ? '#1D1D1D' : undefined,
		thColor: isDark ? '#1D1D1D' : undefined,
		tdColorStriped: isDark ? '#262727' : undefined,
	},
})

const useDarkTheme = computed(() => (mode.value === 'dark' ? darkTheme : null))

onMounted(() => {
	nextTick(() => {
		// useCommandKStore().tab = 'power'
		// useCommandKStore().show = true
	})
})
</script>
