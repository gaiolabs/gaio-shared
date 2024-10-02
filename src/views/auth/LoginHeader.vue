<template>
	<header class="w-full px-8 py-6 justify-between flex">
		<div>&nbsp;</div>
		<div
			class="cursor-default gap-1 duration-150 transition-opacity flex flex-col items-end opacity-70 dark:opacity-40 hover:dark:opacity-100 hover:opacity-100"
		>
			<div class="flex items-center gap-1">
				<IconComponent
					name="Calendar"
					class="pb-px"
				/>
				{{ calendar }}
			</div>
			<div class="flex items-center gap-1">
				<IconComponent
					name="Clock"
					class="pb-px"
				/>
				{{ time }}
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
const locale = 'en-US'
const now = ref(new Date())
const calendar = ref(formatDate(now.value))
const time = ref(formatTime(now.value))

function updateTime() {
	now.value = new Date()

	calendar.value = formatDate(now.value)
	time.value = formatTime(now.value)
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat(locale, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(date)
}

function formatTime(date: Date) {
	return new Intl.DateTimeFormat(locale, {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	}).format(date)
}

const clockInterval = setInterval(updateTime, 1000)

onBeforeUnmount(() => {
	clearInterval(clockInterval)
})
</script>
