import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import ModalExportWallets from '@/components/Modal/ModalExportWallets';
import StringMixin from '@/mixins/strings';
import WalletMixin from '@/mixins/wallet';
Vue.use(Vuelidate);
var i18n = useI18nGlobally();
describe('ModalExportWallets', function () {
    var mountComponent = function () {
        var wallets = [
            { address: 'A1', name: null, balance: 0 },
            { address: 'A2', name: '', balance: 1 },
            { address: 'A3', name: 'wallet_a3', balance: 0 },
            { address: 'A4', name: 'wallet_a4', balance: 1 }
        ];
        var ledgerWallets = [
            { address: 'A5', name: null, balance: 0 },
            { address: 'A6', name: 'ledger_a6', balance: 1 }
        ];
        return shallowMount(ModalExportWallets, {
            i18n: i18n,
            mixins: [StringMixin, WalletMixin],
            mocks: {
                session_network: {
                    knownWallets: {}
                },
                $store: {
                    getters: {
                        'delegate/byAddress': jest.fn(),
                        'wallet/contactsByProfileId': function () { return []; },
                        'wallet/byProfileId': function () { return wallets; },
                        'ledger/wallets': function () { return ledgerWallets; }
                    }
                }
            }
        });
    };
    it('should render modal', function () {
        var wrapper = mountComponent();
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('toggleOption', function () {
        it('should exclude empty wallets', function () {
            var wrapper = mountComponent();
            wrapper.vm.toggleOption('excludeEmpty');
            var walletsWithBalance = [
                { address: 'A2', name: '', balance: 1 },
                { address: 'A4', name: 'wallet_a4', balance: 1 }
            ];
            expect(wrapper.vm.wallets).toEqual(walletsWithBalance);
        });
        it('should exclude wallets with no name', function () {
            var wrapper = mountComponent();
            wrapper.vm.toggleOption('excludeUnnamed');
            var walletsWithName = [
                { address: 'A3', name: 'wallet_a3', balance: 0 },
                { address: 'A4', name: 'wallet_a4', balance: 1 }
            ];
            expect(wrapper.vm.wallets).toEqual(walletsWithName);
        });
    });
});
//# sourceMappingURL=ModalExportWallets.spec.js.map