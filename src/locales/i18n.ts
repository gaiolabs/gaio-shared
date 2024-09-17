import { createI18n } from 'vue-i18n'
import enUs from './langs/lang-en-US'
import ptBr from './langs/lang-pt-BR'

export const i18n = createI18n({
	legacy: false,
	locale: 'en-US',
	fallbackLocale: 'en-US',
	messages: {
		'en-US': enUs,
		'pt-BR': ptBr
	}
})
