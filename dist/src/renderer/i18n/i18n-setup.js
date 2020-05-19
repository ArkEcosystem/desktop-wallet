var _a;
import i18n from '@/i18n';
import { I18N } from '@config';
import { readFileSync } from 'fs';
var loadedLanguages = (_a = {},
    _a[I18N.defaultLocale] = true,
    _a);
var unloadLanguage = function (locale) {
    i18n.setLocaleMessage(locale, undefined);
    i18n.setDateTimeFormat(locale, undefined);
    i18n.setNumberFormat(locale, undefined);
    loadedLanguages[locale] = false;
};
var setLanguage = function (locale) {
    for (var _i = 0, _a = Object.keys(loadedLanguages); _i < _a.length; _i++) {
        var loadedLanguage = _a[_i];
        if (loadedLanguage !== I18N.defaultLocale &&
            loadedLanguage !== locale) {
            unloadLanguage(loadedLanguage);
        }
    }
    i18n.locale = locale;
};
var loadLanguage = function (languageName, pluginLanguage) {
    if (!pluginLanguage || i18n.locale === languageName) {
        return;
    }
    var language = JSON.parse(readFileSync(pluginLanguage.languagePath));
    if (!loadedLanguages[languageName]) {
        i18n.setLocaleMessage(languageName, language.messages);
        i18n.setDateTimeFormat(languageName, language.dateTimeFormats);
        i18n.setNumberFormat(languageName, language.numberFormats);
        loadedLanguages[languageName] = true;
    }
    setLanguage(languageName);
};
export default {
    loadLanguage: loadLanguage,
    unloadLanguage: unloadLanguage,
    setLanguage: setLanguage
};
//# sourceMappingURL=i18n-setup.js.map