import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { I18N } from '@config'

Vue.use(VueI18n)

const defaultLocale = I18N.defaultLocale

const config = {
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  dateTimeFormats: {},
  numberFormats: {},
  messages: {},
  silentTranslationWarn: true
}

const language = require(`./languages/${defaultLocale}`).default

for (const property of ['messages', 'dateTimeFormats', 'numberFormats']) {
  config[property][language.locale] = language[property]
}

export default new VueI18n(config)
