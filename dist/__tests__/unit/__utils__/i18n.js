import Vue from 'vue';
import VueI18n from 'vue-i18n';
var locale = 'en-US';
var useI18n = function (vue) {
    var _a;
    vue.use(VueI18n);
    return new VueI18n({
        silentTranslationWarn: true,
        locale: locale,
        numberFormats: (_a = {},
            _a[locale] = {
                currency: {
                    style: 'currency',
                    currency: 'USD',
                    currencyDisplay: 'symbol'
                }
            },
            _a)
    });
};
var useI18nGlobally = function () {
    return useI18n(Vue);
};
export { locale, useI18n, useI18nGlobally };
export default useI18nGlobally;
//# sourceMappingURL=i18n.js.map