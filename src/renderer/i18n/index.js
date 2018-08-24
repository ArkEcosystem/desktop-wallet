import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const defaultLocale = 'en-US'

export default new VueI18n({
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  dateTimeFormats: require('@/i18n/date-time-formats').default,
  numberFormats: require('@/i18n/number-formats').default,
  messages: {
    'en-US': require('@/i18n/messages/en-US').default,
    'es-ES': require('@/i18n/messages/es-ES').default,
    'pt-BR': require('@/i18n/messages/pt-BR').default
  }
})
