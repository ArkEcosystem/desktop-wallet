import i18n from '@/i18n'
import i18nSetup from '@/i18n/i18n-setup'

jest.mock('fs', () => ({
  readFileSync: jest.fn(() => JSON.stringify({
    locale: 'new-language',
    messages: { test: 'translation' },
    numberFormats: { currency: {} },
    dateTimeFormats: { short: {} }
  }))
}))

const language = {
  locale: 'language',
  messages: { test: 'translation' },
  numberFormats: { currency: {} },
  dateTimeFormats: { short: {} }
}

const setupLanguage = language => {
  i18n.setLocaleMessage(language.locale, language.messages)
  i18n.setNumberFormat(language.locale, language.numberFormats)
  i18n.setDateTimeFormat(language.locale, language.dateTimeFormats)

  i18n.locale = language.locale
}

describe('i18n > i18n-setup', () => {
  let spyMessages
  let spyNumberFormats
  let spyDateTimeFormats

  beforeEach(() => {
    spyMessages = jest.spyOn(i18n, 'setLocaleMessage')
    spyNumberFormats = jest.spyOn(i18n, 'setNumberFormat')
    spyDateTimeFormats = jest.spyOn(i18n, 'setDateTimeFormat')
  })

  afterEach(() => {
    spyMessages.mockRestore()
    spyNumberFormats.mockRestore()
    spyDateTimeFormats.mockRestore()
  })

  describe('setLanguage', () => {
    beforeEach(() => {
      setupLanguage(language)
    })

    it('should set the given language', () => {
      const newLocale = 'new-language'

      expect(i18n.locale).not.toBe(newLocale)
      i18nSetup.setLanguage(newLocale)
      expect(i18n.locale).toBe(newLocale)
    })

    it('should unload other languages', () => {
      const newLocale = 'new-language'

      expect(i18n.getLocaleMessage(language.locale)).toEqual(language.messages)

      i18nSetup.setLanguage(newLocale)

      expect(i18n.getLocaleMessage(language.messages)).toEqual({})
    })
  })

  describe('unloadLanguage', () => {
    it('should unload a language', () => {
      setupLanguage(language)

      expect(i18n.getLocaleMessage(language.locale)).toEqual(language.messages)
      expect(i18n.getNumberFormat(language.locale)).toEqual(language.numberFormats)
      expect(i18n.getDateTimeFormat(language.locale)).toEqual(language.dateTimeFormats)

      i18nSetup.unloadLanguage(language.locale)

      expect(spyMessages).toHaveBeenCalledWith(language.locale, undefined)
      expect(spyNumberFormats).toHaveBeenCalledWith(language.locale, undefined)
      expect(spyDateTimeFormats).toHaveBeenCalledWith(language.locale, undefined)

      expect(i18n.getLocaleMessage(language.locale)).toEqual({})
      expect(i18n.getNumberFormat(language.locale)).toEqual({})
      expect(i18n.getDateTimeFormat(language.locale)).toEqual({})
    })
  })

  describe('loadLanguage', () => {
    it('should return early if no pluginLanguage is given', () => {
      expect(i18nSetup.loadLanguage(language.locale)).toBe(undefined)
    })

    it('should return early if the current locale is the given language', () => {
      expect(i18nSetup.loadLanguage(language.locale, {})).toBe(undefined)
    })

    it('should load the language if it isn\'t loaded already', () => {
      const newLocale = 'new-language'

      i18nSetup.loadLanguage(newLocale, { languagePath: 'foobar' })

      expect(spyMessages).toHaveBeenCalledWith(newLocale, language.messages)
      expect(spyNumberFormats).toHaveBeenCalledWith(newLocale, language.numberFormats)
      expect(spyDateTimeFormats).toHaveBeenCalledWith(newLocale, language.dateTimeFormats)
    })

    it('should not load the language if it is loaded already', () => {
      const newLocale = 'en-US'

      i18nSetup.loadLanguage('en-US', { languagePath: 'foobar' })

      expect(spyMessages).not.toHaveBeenCalledWith(newLocale, language.messages)
      expect(spyNumberFormats).not.toHaveBeenCalledWith(newLocale, language.numberFormats)
      expect(spyDateTimeFormats).not.toHaveBeenCalledWith(newLocale, language.dateTimeFormats)
    })
  })
})
