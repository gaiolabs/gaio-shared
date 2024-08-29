import './assets/styles/index.scss'
import './naive'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import mitt from 'mitt' // Import mitt
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
const emitter = mitt()

import GCard from '@/components/GCard.vue'
import GDialog from '@/components/GDialog.vue'
import GIcon from '@/components/GIcon.vue'
import { mixin } from '@/mixin'
import { i18n } from './locales/i18n'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.directive('height', {
	mounted(el) {
		el.style.height = el.parentNode.offsetHeight - 5 + 'px'
	}
})

app.directive('alpha', {
	mounted(el, _, vnode) {
		el.addEventListener('input', function (e) {
			if (vnode && vnode['ctx']) {
				vnode['ctx'].props.value = e.target.value
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^a-zA-Z0-9]/g, '_')
			}
		})
	},
	beforeUnmount(el, _, vnode) {
		el.removeEventListener('input', function (e) {
			if (vnode && vnode['ctx']) {
				vnode['ctx'].props.value = e.target.value
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^a-zA-Z0-9]/g, '_')
			}
		})
	}
})
app.provide('bus', emitter)

app.component('GDialog', GDialog)
app.component('GIcon', GIcon)
app.component('GCard', GCard)

app.mixin(mixin)

app.use(i18n)
app.use(pinia)
app.use(router)

app.mount('#app')
