import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { I18N } from '@config'

Vue.use(VueI18n)

const config = {
  locale: I18N.defaultLocale,
  fallbackLocale: I18N.defaultLocale,
  dateTimeFormats: {},
  numberFormats: {},
  messages: {}
}

const languagesContext = require.context('./languages', true, /\.js$/)

// todo: we have top make sure that language plugins are loaded before we do anything here
for (const locale of I18N.enabledLocales) {
  const {
    Language
  } = languagesContext(`./${locale}.js`)

  for (const property of ['messages', 'dateTimeFormats', 'numberFormats']) {
    config[property][Language.locale] = Language[property]
  }
}

export default new VueI18n(config)
