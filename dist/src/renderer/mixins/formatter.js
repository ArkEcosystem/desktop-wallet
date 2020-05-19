var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { dayjs } from '@/services/datetime';
import prettyBytes from 'pretty-bytes';
export default {
    methods: {
        formatter_bytes: function (value) {
            return prettyBytes(value);
        },
        formatter_percentage: function (value, minimumFractionDigits, maximumFractionDigits) {
            if (minimumFractionDigits === void 0) { minimumFractionDigits = 2; }
            if (maximumFractionDigits === void 0) { maximumFractionDigits = null; }
            var options = __assign({ minimumFractionDigits: minimumFractionDigits }, (maximumFractionDigits && { maximumFractionDigits: maximumFractionDigits }));
            return this.$n(value, options) + "%";
        },
        formatter_networkCurrency: function (value, digits) {
            return this.currency_format(this.currency_subToUnit(value), { currencyFrom: 'network', maximumFractionDigits: digits });
        },
        formatter_votes: function (value) {
            return this.$n(this.currency_subToUnit(value), { maximumFractionDigits: 2 });
        },
        /**
         * Formats a date:
         *  - Default  => L LTS
         *  - 12h      => L h:mm:ss
         *  - 24h      => L HH:mm:ss
         * @param {Date}
         * @param {String} [format] - The specific format to use. If not provided, uses the session setting `timeFormat`
         * @return {String}
         */
        formatter_date: function (value, format) {
            if (format === void 0) { format = null; }
            var userLanguage = (window.navigator.userLanguage || window.navigator.language).toLowerCase() || 'en';
            var _a = userLanguage.split('-'), language = _a[0], region = _a[1];
            if ((language === 'en' && region === 'us') ||
                language === region) {
                userLanguage = language;
            }
            try {
                require("dayjs/locale/" + userLanguage);
            }
            catch (_b) {
                userLanguage = 'en';
            }
            dayjs.locale(userLanguage);
            if (!format) {
                var sessionFormat = this.session_profile.timeFormat;
                if (sessionFormat === '12h') {
                    format = 'L h:mm:ss A';
                }
                else if (sessionFormat === '24h') {
                    format = 'L HH:mm:ss';
                }
                else {
                    format = 'L LTS';
                }
            }
            return dayjs(value).format(format);
        }
    }
};
//# sourceMappingURL=formatter.js.map