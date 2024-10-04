<template>
	<nav class="flex items-center gap-1 border-r border-gray-200 rounded-2xl p-1 h-12 g-wrapper">
		<button
			class="g-base rounded-xl p-2 flex gap-4 items-center"
			@click="isChatBoxOpen = !isChatBoxOpen"
		>
			<IconComponent
				name="Chat"
				class="size-4"
			/>
		</button>
		<div class="w-px h-full py-1.5">
			<div class="w-px h-full bg-gray-200 dark:bg-white/10"></div>
		</div>

		<NPopover trigger="click">
			<template #trigger>
				<div class="flex gap-2 items-center group cursor-pointer realtive isolate">
					<span
						class="absolute left-16 right-4 bottom-[-2px] h-[2px] dark:h-px bg-gradient-to-r from-sepia-500/0 via-sepia-400 to-sepia-500/0 dark:from-ochre-500/0 dark:via-ochre-400 dark:to-ochre-500/0 transition duration-150 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 z-[-1]"
					></span>
					<span
						class="overflow-hidden absolute inset-0 left-10 transition origin-bottom duration-150 opacity-1 scale-0 group-hover:opacity-100 group-hover:scale-100 z-[-1]"
					>
						<span
							class="absolute inset-x-4 -bottom-2 h-full bg-gradient-to-t dark:from-ochre-500/5 from-sepia-500/10 to-transparent blur rounded-t-full z-[-1]"
						></span>
					</span>
					<div class="size-10 g-base rounded-full overflow-hidden">
						<!-- <img
							:src="profilePicture"
							class="w-full h-full"
							/> -->
						<img
							src="/src/assets/images/avatar.png"
							class="w-full h-full"
							onerror="this.onerror=null; this.src='/src/assets/images/gaio-default-profile.png';"
						/>
					</div>
					<div class="flex flex-col pr-2 select-none gap-1">
						<div class="text-center leading-none text-xs text-gray-500 dark:text-gray-500">
							{{ formattedDate }}
						</div>
						<div class="text-center leading-none text-sm font-medium text-gray-600 dark:text-gray-450">
							{{ formattedTime }}
						</div>
					</div>
				</div>
			</template>
			<div>
				<HomeAccount />
			</div>
		</NPopover>
	</nav>

	<!-- Chat box -->
	<Transition
		enter-active-class="transition-all duration-150"
		enter-from-class="opacity-0 translate-y-2"
		enter-to-class="opacity-100"
		leave-active-class="transition-all duration-150"
		leave-from-class="opacity-100 "
		leave-to-class="opacity-0 translate-y-2"
		mode="out-in"
	>
		<div
			v-if="isChatBoxOpen"
			id="chat-box"
			class="max-w-lg w-full fixed right-0 bottom-0 p-4 pb-0"
		>
			<NWatermark
				content="Work in progress"
				cross
				selectable
				:font-size="16"
				:line-height="16"
				:width="300"
				:height="80"
				:x-offset="-15"
				:y-offset="70"
				:rotate="-30"
			>
				<div class="p-2 rounded-t-3xl drop-shadow-xl relative g-wrapper">
					<header class="p-2 pt-0 flex flex-col gap-2">
						<nav class="absolute right-2 top-0">
							<ul class="flex gap-1.5 items-center">
								<li>
									<button
										class="w-8 h-8 -translate-y-1/2 g-base rounded-md flex items-center justify-center"
										@click="isChatBoxOpen = false"
									>
										<IconComponent name="Close" />
									</button>
								</li>
							</ul>
						</nav>
						<div class="mt-2 flex justify-center">
							<div class="g-base rounded-md px-2 flex items-center gap-2">
								<IconComponent
									name="Chat"
									class="size-4"
								/>
								<span>Chat</span>
							</div>
						</div>
						<div class="flex justify-center">
							<div class="w-10 h-10 g-base rounded-full overflow-hidden">
								<img
									src="/src/assets/images/gaio-default-profile.png"
									alt="Profile"
								/>
							</div>
							<div class="w-10 h-10 g-base rounded-full overflow-hidden -ml-2">
								<img
									src="/src/assets/images/gaio-default-profile.png"
									alt="Profile"
								/>
							</div>
							<div class="w-10 h-10 g-base rounded-full overflow-hidden -ml-2">
								<img
									src="/src/assets/images/gaio-default-profile.png"
									alt="Profile"
								/>
							</div>
							<div class="w-10 h-10 g-base rounded-full overflow-hidden -ml-2">
								<img
									src="/src/assets/images/gaio-default-profile.png"
									alt="Profile"
								/>
							</div>
						</div>
						<div class="text-center font-bold">Questions? Chat with us!</div>
						<div class="-mt-3 flex justify-center items-center gap-2">
							<div class="size-2 bg-green-500 rounded-full animate-pulse"></div>

							<span>Support is online</span>
						</div>
					</header>
					<main class="rounded-2xl p-2 h-64 overflow-y-auto g-base">
						<div class="flex flex-col gap-2">
							<div class="flex gap-2">
								<div class="w-10 h-10 g-base rounded-full overflow-hidden translate-y-6">
									<img
										src="/src/assets/images/gaio-default-profile.png"
										alt="Profile"
									/>
								</div>
								<div class="g-base rounded-xl rounded-bl-none p-2 shadow">
									<p>Hello! How can we assist you today? 😊</p>
								</div>
							</div>
						</div>
					</main>
					<footer class="pt-4">
						<div class="flex items-center">
							<input
								type="text"
								placeholder="Type your message..."
								class="flex-1 border rounded-2xl px-4 py-2 mr-2 g-base"
							/>
							<GButton class="text-white !rounded-2xl !p-2 h-10">
								<IconComponent
									name="Send"
									class="size-6"
								/>
							</GButton>
						</div>
					</footer>
				</div>
			</NWatermark>
		</div>
	</Transition>
</template>

<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import GButton from '@/components/inputs/GButton.vue'
import { useAuthStore } from '@/stores'
import HomeAccount from '@/views/home/HomeAccount.vue'
import { NWatermark } from 'naive-ui'
import { ref, computed, onBeforeUnmount } from 'vue'

const user = computed(() => useAuthStore().user)

const isChatBoxOpen = ref(false)

const currentDate = ref(new Date())

const language = computed(() => user.value?.lang || 'en-US')

const formattedDate = computed(() =>
	new Intl.DateTimeFormat(language.value, {
		weekday: language.value.startsWith('en') ? 'long' : 'short',
		day: 'numeric',
		month: 'short',
	}).format(currentDate.value),
)

const formattedTime = computed(() =>
	new Intl.DateTimeFormat(language.value, {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	}).format(currentDate.value),
)

const interval = setInterval(() => {
	currentDate.value = new Date()
}, 1000)

onBeforeUnmount(() => {
	clearInterval(interval)
})
</script>
