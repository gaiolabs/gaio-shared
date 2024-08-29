<template>
	<div class="power flex h-full flex-col">
		<div class="grow">
			{{ usePowerStore().tags?.length }} fs
			<!--SEARCH BAR-->
			<div class="flex h-[45px] items-center gap-2 border-b">
				<div class="flex items-center gap-2 ps-2">
					<div class="g-border-400 flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-md">
						<g-icon
							name="search"
							:height="12"
						/>
					</div>
				</div>
				<command-power-tags />
				<div class="grow">
					<input
						ref="commandInput"
						v-model="usePowerStore().searchTerm"
						class="h-[35px] w-full px-2 font-[18px] outline-none"
						type="text"
						:placeholder="$t('searchOrSpace')"
						@keyup="moveKey()"
						@keyup.delete="moveBackspace()"
						@keyup.up="moveVertical('up')"
						@keyup.down="moveVertical('down')"
						@keyup.right="moveHorizontal('right')"
						@keyup.left="moveHorizontal('left')"
						@keyup.enter="moveEnter()"
					/>
				</div>
			</div>
			<!--SEARCH PAGE-->
			<template v-if="usePowerStore().currentPanel === 'search'">
				<command-power-list />
			</template>
			<!--CONTEXT PAGE-->
			<template v-if="usePowerStore().currentPanel === 'context'">
				<command-power-context />
			</template>
			<!--REPORT PAGE-->
			<template v-if="usePowerStore().currentPanel === 'report'">
				<command-power-report />
			</template>
		</div>
		<div class="g-bg-1 flex items-center justify-between border-t p-1">
			<div class="flex-vertical-center gap-2 text-prime">
				<g-icon
					name="powerContext"
					:height="20"
				/>
				{{ usePowerStore().selectedContext?.label }}
			</div>
			Footer
		</div>
	</div>
</template>
<script setup lang="ts">
import { usePowerStore } from '@/stores'
import CommandPowerContext from '@/views/commandK/command-power/CommandPowerContext.vue'
import CommandPowerList from '@/views/commandK/command-power/CommandPowerList.vue'
import CommandPowerReport from '@/views/commandK/command-power/CommandPowerReport.vue'
import CommandPowerTags from '@/views/commandK/command-power/CommandPowerTags.vue'
import { nextTick, onMounted, ref } from 'vue'

const commandInput = ref(null)

const moveHorizontal = (direction: 'right' | 'left') => {
	const tab = usePowerStore().currentTab
	if (direction === 'right') {
		if (tab === 'all') {
			usePowerStore().currentTab = 'story'
		} else if (tab === 'story') {
			usePowerStore().currentTab = 'view'
		} else if (tab === 'view') {
			usePowerStore().currentTab = 'context'
		}
	} else {
		if (tab === 'context') {
			usePowerStore().currentTab = 'view'
		} else if (tab === 'view') {
			usePowerStore().currentTab = 'story'
		} else if (tab === 'story') {
			usePowerStore().currentTab = 'all'
		}
	}
}

const moveBackspace = () => {
	// if (!cursorAtStart.value && usePowerStore().currentPanel !== 'search') {
	//     cursorAtStart.value = true
	// } else {

	if (!usePowerStore().tags.length) {
		usePowerStore().currentPanel = 'context'
	}

	if (!usePowerStore().searchTerm && usePowerStore().emptyAndBackspace) {
		if (usePowerStore().tags.length) {
			usePowerStore().tags.pop()

			console.log('tag pop', usePowerStore().tags)

			usePowerStore().emptyAndBackspace = false
			if (usePowerStore().tags.length === 0) {
				usePowerStore().currentPanel = 'context'
				usePowerStore().tags = []
			}
		} else if (usePowerStore().currentPanel !== 'search') {
			usePowerStore().currentPanel = 'search'
		}
		usePowerStore().emptyAndBackspace = false
	}

	usePowerStore().emptyAndBackspace = !usePowerStore().searchTerm

	// }
	// } else {
	//     cursorAtStart.value = false
	// }
}

const moveVertical = (direction: 'up' | 'down') => {
	if (direction === 'up') {
		if (usePowerStore().currentIndex > 0) {
			usePowerStore().currentIndex--
		}
	} else {
		if (usePowerStore().currentIndex < usePowerStore().filteredList.length - 1) {
			usePowerStore().currentIndex++
		}
	}
}

const moveEnter = () => {
	console.log(usePowerStore().$state)
	if (usePowerStore().currentPanel === 'context') {
		if (!usePowerStore().searchTerm.length) {
			console.log(1)
			usePowerStore().currentPanel = 'report'
		} else if (usePowerStore().filteredContextField.length) {
			console.log(2, usePowerStore().tags, usePowerStore().filteredContextField, usePowerStore().searchTerm)
			usePowerStore().tags.push({
				...usePowerStore().filteredContextField[0],
				variant: usePowerStore().searchTerm
			})
			usePowerStore().searchTerm = ''
			usePowerStore().currentPanel = 'report'
			usePowerStore().emptyAndBackspace = false
		}
	} else {
		if (usePowerStore().filteredList.length > 0) {
			const current = usePowerStore().filteredList[usePowerStore().currentIndex]

			if (current) {
				if (current.metaType === 'context') {
					usePowerStore().currentPanel = 'context'
					usePowerStore().selectedContext = current
				}
			}
		}
	}
}

const moveKey = () => {
	if (usePowerStore().searchTerm.length === 1 && usePowerStore().searchTerm === ' ') {
		usePowerStore().currentPanel = 'context'
		usePowerStore().searchTerm = ''
	} else if (usePowerStore().currentPanel === 'report' && usePowerStore().searchTerm.length >= 1) {
		usePowerStore().currentPanel = 'context'
	}

	if (usePowerStore().searchTerm.length >= 1) {
		usePowerStore().emptyAndBackspace = false
	}
}

onMounted(() => {
	usePowerStore().loadPowerReferences()
	nextTick(() => commandInput.value.focus())
})
</script>
