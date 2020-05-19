import { NumberBuilder } from '@/plugins/bignumber.js';
import { MARKET } from '@config';
import { merge } from 'lodash';
export default {
    methods: {
        /**
         * Returns the value formatted for a specific locale. It works with crypto
         * and fiat currencies.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat | NumberFormat}
         * @see {@link https://www.currency-iso.org/en/home/tables/table-a1.html | List of currencies}
         *
         * @param {Number} value
         * @param {Object} options
         * @param {String} options.currency - The currency
         * @param {String} options.currencyFrom - To obtain the currency from the "session" or "network"
         * @param {String} [options.currencyDisplay = 'symbol']
         * @param {String} [options.locale = current locale]
         * @param {String} [options.maximumFractionDigits] - Maximum number of fraction digits
         * @param {Boolean} [options.subunit = false] - To use the subunit (arktoshi) instead of the unit (ARK)
         */
        currency_format: function (value, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            if (!options.currency && !options.currencyFrom) {
                throw new Error('Either the `currency` or the `currencyFrom` option is mandatory');
            }
            var defaultOptions = {
                currencyDisplay: 'symbol',
                locale: this.$i18n.locale
            };
            var mandatoryOptions = {
                style: 'currency'
            };
            if (options.currencyFrom === 'session') {
                options.currency = this.$store.getters['session/currency'];
            }
            var config = merge({}, defaultOptions, options, mandatoryOptions);
            // `vue-i18n` uses `Intl.NumberFormat` internally, so it doesn't admit nonexistent
            // currencies. For that reason, we use the "no-currency" code instead and
            // replace it later with the cryptocurrency code or symbol
            var cryptoPlaceholder = 'XXX';
            var cryptoPlaceholderSymbol = '¤';
            var cryptoCurrency = null;
            var findNetworkByCurrency = function (currency) {
                return _this.$store.getters['network/byToken'](currency) || _this.$store.getters['network/bySymbol'](currency);
            };
            // Network of the token/symbol
            var network = config.currencyFrom === 'network'
                ? this.session_network
                : findNetworkByCurrency(config.currency);
            if (network) {
                if (options.subunit) {
                    cryptoCurrency = network.subunit;
                    value *= Math.pow(10, network.fractionDigits);
                    // Subunits should not have decimals, although Intl.NumberFormat requires 2 at least
                    // TODO workaround this limitation for any language
                    config.maximumFractionDigits = 2;
                }
                else {
                    cryptoCurrency = config.currencyDisplay === 'symbol' ? network.symbol : network.token;
                    config.maximumFractionDigits || (config.maximumFractionDigits = network.fractionDigits);
                }
            }
            else {
                if (options.subunit) {
                    throw new Error('The `subunit` option is only supported for the network currencies');
                }
                if (MARKET.crypto.indexOf(config.currency) !== -1) {
                    cryptoCurrency = config.currencyDisplay === 'symbol'
                        ? MARKET.currencies[config.currency].symbol
                        : config.currency;
                    config.maximumFractionDigits || (config.maximumFractionDigits = MARKET.currencies[config.currency].fractionDigits);
                }
            }
            if (cryptoCurrency) {
                config.currency = cryptoPlaceholder;
            }
            var formatted = this.$n(value.toString(), config);
            // When using cryptocurrencies, add a space between the symbol and the number
            if (cryptoCurrency) {
                return formatted
                    .replace(/\s/g, '')
                    .replace(cryptoPlaceholder, "\u00A0" + cryptoCurrency + "\u00A0")
                    .replace(cryptoPlaceholderSymbol, "\u00A0" + cryptoCurrency + "\u00A0")
                    .trim();
            }
            return formatted;
        },
        currency_simpleFormatCrypto: function (value, network) {
            var token = (network || this.session_network).token;
            return value + " " + token;
        },
        currency_toBuilder: function (value, network) {
            var fractionDigits = (network || this.session_network).fractionDigits;
            return new NumberBuilder(value).decimalPlaces(fractionDigits);
        },
        currency_subToUnit: function (value, network) {
            var fractionDigits = (network || this.session_network).fractionDigits;
            return new NumberBuilder(value).decimalPlaces(fractionDigits).toHuman().value;
        },
        currency_unitToSub: function (value, network) {
            var fractionDigits = (network || this.session_network).fractionDigits;
            return new NumberBuilder(value).decimalPlaces(fractionDigits).toArktoshi().value;
        },
        currency_cryptoToCurrency: function (value, fromSubUnit, fractionDigits) {
            if (fromSubUnit === void 0) { fromSubUnit = true; }
            if (fractionDigits === void 0) { fractionDigits = 2; }
            if (fromSubUnit) {
                value = this.currency_subToUnit(value);
            }
            var price = this.$store.getters['market/lastPrice'];
            return new NumberBuilder(value)
                .decimalPlaces(fractionDigits)
                .multiply(price)
                .value
                .toFixed();
        }
    }
};
//# sourceMappingURL=currency.js.map