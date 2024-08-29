<template>
	<div
		class="report-download"
		:class="tableReportClass"
	>
		<n-button
			:size="size"
			:color="color"
			:class="tableReportClass"
			@click="downloadFile()"
		>
			<template v-if="loading">
				<div class="flex items-center justify-center gap-1">
					<g-icon
						icon="loadingFile"
						style="font-size: 14px"
					/>
					{{ downloadTitle }}
				</div>
			</template>
			<template v-else>
				<div class="flex items-center justify-center gap-1">
					<g-icon
						icon="download"
						style="font-size: 14px"
					/>
					{{ downloadTitle }}
				</div>
			</template>
		</n-button>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// import { useRouter } from 'vue-router'

// const router = useRouter()
const props = defineProps({
	task: {
		type: Object,
		required: true
	}
})

// const store = useStore()
const loading = ref(false)

const tableReportClass = computed(() => {
	return props.task?.reportType === 'table' ? '' : 'w-100'
})

const downloadTitle = computed(() => {
	return props.task?.downloadLabel || 'Download'
})

const color = computed(() => {
	return props.task?.downloadColor || null
})

const size = computed(() => {
	return props.task?.downloadSize || null
})

// const sleep = (ms: number = 1000) => {
//     return new Promise((resolve) => setTimeout(resolve, ms))
// }
//
// const detectOS = () => {
//     const userAgent = window.navigator.userAgent
//     const osPatterns = {
//         Windows: /\b(Windows|Win\d{2}|WOW\d{2})\b/i,
//         'Mac OS': /\b(Mac OS|Mac_PowerPC|Macintosh)\b/i,
//         Linux: /\bLinux\b/i,
//         Android: /\bAndroid\b/i,
//         iOS: /\b(iPhone|iPad|iPod)\b/i
//     }
//
//     for (const [os, pattern] of Object.entries(osPatterns)) {
//         if (pattern.test(userAgent)) {
//             return os
//         }
//     }
//     return null
// }

const downloadFile = async () => {
	// loading.value = true
	//
	// await sleep()
	//
	// const gaioBase = import.meta.env.VITE_APP_API
	// const sessionId = localStorage.getItem('gaio@sessionid')
	// const base = {
	//     appId: store.state.app.app.appId,
	//     flowId: store.state.app.flowId,
	//     from: ['dashboard', 'portal'].includes(router.currentRoute.value.name as string) ? 'dash' : 'studio',
	//     os: detectOS(),
	//     taskData: props.task,
	//     params: store.state.app.params,
	//     sessionid: sessionId
	// }
	//
	// const bom = new Uint8Array([0xef, 0xbb, 0xbf])
	//
	// fetch(gaioBase + 'api/listing/download', {
	//     method: 'POST',
	//     body: JSON.stringify(base),
	//     headers: {
	//         'Content-Type': 'application/json',
	//         Accept: 'application/json',
	//         Authorization: 'Bearer ' + localStorage.getItem('gaio@token'), // If you use a token
	//         sessionId: sessionId
	//     }
	// })
	//     .then((response) => {
	//         const reader = response.body.getReader()
	//         return new ReadableStream({
	//             start(controller) {
	//                 controller.enqueue(bom)
	//                 return pump()
	//
	//                 function pump() {
	//                     return reader.read().then(({ done, value }) => {
	//                         if (done) {
	//                             controller.close()
	//                             return
	//                         }
	//                         controller.enqueue(value)
	//                         return pump()
	//                     })
	//                 }
	//             }
	//         })
	//     })
	//     .then(async (stream) => {
	//         // process each chunk in the stream as it arrives
	//         // note: each 'chunk' is a Uint8Array
	//         const reader = stream.getReader()
	//         let chunks = []
	//         let chunk
	//         while (true) {
	//             chunk = await reader.read()
	//             if (chunk.done) {
	//                 // all data has been read
	//                 break
	//             } else {
	//                 // process the chunk, e.g., append it to a Blob
	//                 chunks.push(chunk.value)
	//             }
	//         }
	//         let blob = new Blob(chunks, { type: 'application/octet-stream' })
	//         saveAs(blob, (downloadTitle.value || 'download') + '.csv') // use FileSaver.js to save the file
	//     })
	//     .catch((err) => console.error(err))
	//     .finally(() => {
	//         loading.value = false
	//     })
}
</script>
