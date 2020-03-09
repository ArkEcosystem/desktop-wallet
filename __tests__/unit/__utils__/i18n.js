import Vue from 'vue'
import VueI18n from 'vue-i18n'

const locale = 'en-US'

const useI18n = vue => {
  vue.use(VueI18n)

  return new VueI18n({
    silentTranslationWarn: true,
    locale,
    numberFormats: {
      [locale]: {
        currency: {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'symbol'
        }
      }
    }
  })
}

const useI18nGlobally = () => {
  return useI18n(Vue)
}

export { locale, useI18n, useI18nGlobally }
export default useI18nGlobally
