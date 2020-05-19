import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { I18N } from '@config';
Vue.use(VueI18n);
var defaultLocale = I18N.defaultLocale;
var config = {
    locale: defaultLocale,
    fallbackLocale: defaultLocale,
    dateTimeFormats: {},
    numberFormats: {},
    messages: {},
    silentTranslationWarn: true
};
var language = require("./languages/" + defaultLocale).default;
for (var _i = 0, _a = ['messages', 'dateTimeFormats', 'numberFormats']; _i < _a.length; _i++) {
    var property = _a[_i];
    config[property][language.locale] = language[property];
}
export default new VueI18n(config);
//# sourceMappingURL=index.js.map