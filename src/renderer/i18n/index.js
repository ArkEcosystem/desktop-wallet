import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { I18N } from '@config'

Vue.use(VueI18n)

const messages = {}

I18N.enabledLocales.forEach(locale => {
  messages[locale] = require(`@/i18n/messages/${locale}`).default
})

export default new VueI18n({
  locale: I18N.defaultLocale,
  fallbackLocale: I18N.defaultLocale,
  dateTimeFormats: require('@/i18n/date-time-formats').default,
  numberFormats: require('@/i18n/number-formats').default,
  messages
})
