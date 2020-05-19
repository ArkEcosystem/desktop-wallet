import { createLocalVue, shallowMount } from '@vue/test-utils';
import useI18n from '../__utils__/i18n';
import CurrencyMixin from '@/mixins/currency';
import FormatterMixin from '@/mixins/formatter';
import WalletMixin from '@/mixins/wallet';
describe('Mixins > Wallet', function () {
    var network = {
        token: 'NET',
        symbol: '×',
        fractionDigits: 8,
        knownWallets: [],
        version: 11
    };
    var wrapper;
    var walletsByProfile;
    var contactsByProfile;
    beforeEach(function () {
        var localVue = createLocalVue();
        var i18n = useI18n(localVue);
        var TestComponent = {
            name: 'TestComponent',
            template: '<div/>'
        };
        walletsByProfile = [];
        contactsByProfile = [];
        wrapper = shallowMount(TestComponent, {
            localVue: localVue,
            i18n: i18n,
            mixins: [CurrencyMixin, FormatterMixin, WalletMixin],
            mocks: {
                session_network: network,
                $store: {
                    getters: {
                        'wallet/byProfileId': function () { return walletsByProfile; },
                        'wallet/contactsByProfileId': function () { return contactsByProfile; },
                        'delegate/byAddress': function (address) {
                            if (address === 'DTRdbaUW3RQQSL5By4G43JVaeHiqfVp9oh') {
                                return {
                                    username: 'test',
                                    address: address,
                                    publicKey: '034da006f958beba78ec54443df4a3f52237253f7ae8cbdb17dccf3feaa57f3126'
                                };
                            }
                        }
                    }
                }
            }
        });
    });
    describe('wallet_nameOnContact', function () {
        describe('when the contacts includes the wallet address', function () {
            it('should return the its name', function () {
                var address = 'AeXAmpleWiThLongName';
                contactsByProfile = [
                    { address: address, name: 'example' }
                ];
                expect(wrapper.vm.wallet_nameOnContact(address)).toEqual(contactsByProfile[0].name);
            });
        });
        describe('when the profile does not include the wallet address', function () {
            it('should return `undefined`', function () {
                expect(wrapper.vm.wallet_nameOnContact('AeXAmpleWiThLongName', 5)).toBeNull();
            });
        });
    });
    describe('wallet_nameOnProfile', function () {
        describe('when the profile includes the wallet address', function () {
            it('should return the its name', function () {
                var address = 'AeXAmpleWiThLongName';
                walletsByProfile = [
                    { address: address, name: 'example' }
                ];
                expect(wrapper.vm.wallet_nameOnProfile(address)).toEqual(walletsByProfile[0].name);
            });
        });
        describe('when the profile does not include the wallet address', function () {
            it('should return `undefined`', function () {
                expect(wrapper.vm.wallet_nameOnContact('AeXAmpleWiThLongName', 5)).toBeNull();
            });
        });
    });
    describe('wallet_formatAddress', function () {
        describe('when receiving an address that is not known wallet, included on the profile or is a contact', function () {
            it('should return the entire address', function () {
                expect(wrapper.vm.wallet_formatAddress('AeXAmpleWiThLongName')).toEqual('AeXAmpleWiThLongName');
            });
            describe('whent the `truncateLength` is passed', function () {
                it('should return the address, but truncated', function () {
                    expect(wrapper.vm.wallet_formatAddress('AeXAmpleWiThLongName', 5)).toEqual('Ae…me');
                });
            });
        });
    });
});
//# sourceMappingURL=wallet.spec.js.map