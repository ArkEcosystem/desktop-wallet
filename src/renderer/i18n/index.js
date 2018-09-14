import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { I18N } from '@config'

Vue.use(VueI18n)

const messages = {}

const messagesContext = require.context('./locales', true, /\.js$/)

I18N.enabledLocales.forEach(locale => {
  messages[locale] = messagesContext(`./${locale}.js`).default
})

export default new VueI18n({
  locale: I18N.defaultLocale,
  fallbackLocale: I18N.defaultLocale,
  dateTimeFormats: require('./date-time-formats').default,
  numberFormats: require('./number-formats').default,
  messages
})
