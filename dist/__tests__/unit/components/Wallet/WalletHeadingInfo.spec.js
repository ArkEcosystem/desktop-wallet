import { createLocalVue, mount } from '@vue/test-utils';
import useI18n from '../../__utils__/i18n';
import CurrencyMixin from '@/mixins/currency';
import FormatterMixin from '@/mixins/formatter';
import truncate from '@/filters/truncate';
import { WalletHeadingInfo } from '@/components/Wallet';
var network = {
    token: 'NET',
    symbol: '×',
    fractionDigits: 8,
    market: {
        enabled: false
    },
    knownWallets: []
};
var sampleWalletData = {
    address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
    balance: 797.8921,
    profileId: 'abc'
};
var alternativeCurrency = 'EUR';
var price = 12;
var wrapper;
describe('WalletHeadingInfo component', function () {
    beforeEach(function () {
        var localVue = createLocalVue();
        var i18n = useI18n(localVue);
        localVue.filter('truncate', truncate);
        wrapper = mount(WalletHeadingInfo, {
            localVue: localVue,
            i18n: i18n,
            mixins: [CurrencyMixin, FormatterMixin],
            propsData: sampleWalletData,
            mocks: {
                $store: {
                    getters: {
                        'market/lastPrice': price,
                        'network/byToken': jest.fn(),
                        'network/bySymbol': jest.fn(),
                        'session/network': network,
                        'session/currency': alternativeCurrency,
                        'transaction/byAddress': jest.fn(function () { return []; })
                    }
                },
                session_network: network,
                wallet_fromRoute: sampleWalletData,
                wallet_formatAddress: function (address) { return address; },
                wallet_name: function (value) { return value; },
                wallet_nameOnContact: function (value) { return value; },
                wallet_nameOnProfile: function (value) { return value; },
                wallet_truncate: function (value) { return value; }
            }
        });
    });
    it('should be instatiated', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should display the identicon', function () {
        var identicon = wrapper.find('.WalletHeading__identicon');
        expect(identicon.html()).toContain('class="Identicon');
    });
    it('should not allow selecting the identicon badge', function () {
        var identicon = wrapper.find('.WalletHeading__identicon');
        expect(identicon.html()).toContain('select-none');
    });
    it('should display the address', function () {
        var address = wrapper.find('.WalletHeading__address');
        expect(address.text()).toContain(sampleWalletData.address);
    });
    it('should display the balance in the currency network', function () {
        var balance = wrapper.find('.WalletHeading__balance');
        var arkBalance = wrapper.vm.currency_subToUnit(sampleWalletData.balance);
        var formattedBalance = wrapper.vm.currency_format(arkBalance, { currencyFrom: 'network' });
        expect(balance.text()).toContain(formattedBalance);
    });
    describe('when the session network has the market enabled', function () {
        beforeEach(function () {
            network.market.enabled = true;
        });
        it('should display the balance in the alternative currency too', function () {
            var balance = wrapper.find('.WalletHeading__balance__alternative');
            var arkBalance = wrapper.vm.currency_subToUnit(sampleWalletData.balance);
            var formattedBalance = wrapper.vm.currency_format(arkBalance * price, { currency: alternativeCurrency });
            expect(balance.text()).toContain(formattedBalance);
        });
    });
});
//# sourceMappingURL=WalletHeadingInfo.spec.js.map