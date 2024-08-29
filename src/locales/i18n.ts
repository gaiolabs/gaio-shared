import { createI18n } from 'vue-i18n'
import enUs from './langs/lang-en-US'
import ptBr from './langs/lang-pt-BR'

export const i18n = createI18n({
	legacy: false, // you must set `false`, to use Compostion API
	locale: 'en-US', // set locale
	fallbackLocale: 'en-US', // set fallback locale
	messages: {
		'en-US': enUs,
		'pt-BR': ptBr
	}
})
