import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import { useI18n } from '../../__utils__/i18n';
import router from '@/router';
import WalletAll from '@/pages/Wallet/WalletAll';
var localVue = createLocalVue();
var i18n = useI18n(localVue);
localVue.use(VueRouter);
describe('pages > WalletAll', function () {
    var ledgerWallets = [
        { id: 'Aledger1', address: 'Aledger1', name: 'L1' },
        { id: 'Aledger2', address: 'Aledger2', name: 'L2' },
        { id: 'Aledger3', address: 'Aledger3', name: 'L3' }
    ];
    var wallets = [
        { id: 'A1', address: 'A1', name: 'N1' },
        { id: 'A2', address: 'A2', name: 'N2' },
        { id: 'A3', address: 'A3', name: 'N3' }
    ];
    var mountPage = function () {
        return mount(WalletAll, {
            localVue: localVue,
            router: router,
            i18n: i18n,
            mocks: {
                $store: {
                    getters: {
                        'ledger/isConnected': false,
                        'ledger/wallets': ledgerWallets,
                        'profile/balanceWithLedger': jest.fn(),
                        'session/hasWalletGridLayout': true,
                        'wallet/byProfileId': function () { return wallets; }
                    }
                },
                session_network: {
                    symbol: 'Ѧ',
                    market: {
                        enabled: true
                    }
                },
                session_profile: {
                    name: 'jest'
                },
                wallet_sortByName: function () { return wallets; },
                formatter_networkCurrency: jest.fn(),
                wallet_name: function (value) { return value; }
            },
            stubs: {
                ButtonLetter: true
            }
        });
    };
    it('should have the right name', function () {
        var wrapper = mountPage();
        expect(wrapper.name()).toEqual('WalletAll');
    });
    it('should render component', function () {
        var wrapper = mountPage();
        expect(wrapper.contains('.WalletAll')).toBeTruthy();
    });
    describe('removeWallet', function () {
        it('should remove the wallet from the selectable wallets', function () {
            var wrapper = mountPage();
            wrapper.vm.selectableWallets = [
                wallets[0],
                wallets[1],
                wallets[2],
                ledgerWallets[0]
            ];
            wrapper.vm.removeWallet(wallets[1]);
            var selectableWallets = [
                wallets[0],
                wallets[2],
                ledgerWallets[0]
            ];
            expect(wrapper.vm.selectableWallets).toEqual(selectableWallets);
        });
    });
});
//# sourceMappingURL=WalletAll.spec.js.map