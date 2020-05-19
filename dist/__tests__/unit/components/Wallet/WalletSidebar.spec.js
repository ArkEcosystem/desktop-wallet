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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { createLocalVue, shallowMount } from '@vue/test-utils';
import installI18n from '../../__utils__/i18n';
import WalletMixin from '@/mixins/wallet';
import WalletSidebar from '@/components/Wallet/WalletSidebar';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var contacts = [];
var wallets = [];
var mount = function (propsData, mocks) {
    if (propsData === void 0) { propsData = {}; }
    if (mocks === void 0) { mocks = {}; }
    mocks = __assign({ $route: {}, $store: {
            getters: {
                'delegate/byAddress': jest.fn(),
                'wallet/contactsByProfileId': function () { return contacts; },
                'wallet/byProfileId': function () { return wallets; },
                'session/walletSidebarFilters': { hideEmpty: false, hideLedger: false },
                'session/walletSidebarSortParams': { field: 'name', type: 'asc' }
            },
            dispatch: jest.fn()
        }, session_network: {
            knownWallets: {}
        } }, mocks);
    return shallowMount(WalletSidebar, {
        propsData: propsData,
        i18n: i18n,
        localVue: localVue,
        mixins: [WalletMixin],
        mocks: mocks
    });
};
describe('WalletSidebar', function () {
    it('should be instantiated', function () {
        var wrapper = mount();
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('filterWallets', function () {
        var wallets = [
            { address: 'A1', isLedger: false, balance: '23' },
            { address: 'A2', isLedger: false, balance: '22' }
        ];
        var ledgerWallets = [
            { address: 'Aledger1', isLedger: true, balance: '10' },
            { address: 'Aledger2', isLedger: true, balance: '12' }
        ];
        var emptyWallets = [
            { address: 'A3', isLedger: false, balance: '0' },
            { address: 'Aledger3', isLedger: true, balance: '0' }
        ];
        var allWallets = __spreadArrays(wallets, ledgerWallets, emptyWallets);
        describe('when no filter is passed', function () {
            it('should return all wallets', function () {
                var wrapper = mount();
                expect(wrapper.vm.filterWallets(allWallets)).toEqual(allWallets);
            });
        });
        describe('when several filters are passed', function () {
            it('should return the wallets that pass them all', function () {
                var wrapper = mount();
                var filters = {
                    hideEmpty: true,
                    hideLedger: true
                };
                wrapper.vm.$store.getters['session/walletSidebarFilters'] = filters;
                wrapper.vm.applyFilters(filters);
                expect(wrapper.vm.filterWallets(allWallets)).toEqual(wallets);
            });
        });
        describe('when `hideLedger` is enabled', function () {
            it('should not return the Ledger wallets', function () {
                var wrapper = mount();
                var filters = {
                    hideLedger: true
                };
                wrapper.vm.$store.getters['session/walletSidebarFilters'] = filters;
                wrapper.vm.applyFilters(filters);
                expect(wrapper.vm.filterWallets(allWallets)).toEqual(__spreadArrays(wallets, [
                    emptyWallets[0]
                ]));
            });
        });
        describe('when `hideEmpty` is enabled', function () {
            it('should not return the empty wallets', function () {
                var wrapper = mount();
                var filters = {
                    hideEmpty: true
                };
                wrapper.vm.$store.getters['session/walletSidebarFilters'] = filters;
                wrapper.vm.applyFilters(filters);
                expect(wrapper.vm.filterWallets(allWallets)).toEqual(__spreadArrays(wallets, ledgerWallets));
            });
        });
        describe('when a search query (`searchQuery`) is passed', function () {
            var wallets = [
                { address: 'A1xd', name: 'example', balance: '13223' },
                { address: 'A2xd', name: 'name', balance: '13' },
                { address: 'A3dx', name: 'other', balance: '937' }
            ];
            var wrapper;
            beforeEach(function () {
                wrapper = mount();
            });
            describe('when wallet addresses match', function () {
                it('should return only those wallets', function () {
                    wrapper.vm.applySearch('xd');
                    expect(wrapper.vm.filterWallets(wallets)).toEqual([
                        wallets[0],
                        wallets[1]
                    ]);
                });
                it('should not ignore the case', function () {
                    wrapper.vm.applySearch('Xd');
                    expect(wrapper.vm.filterWallets(wallets)).toBeEmpty();
                });
            });
            describe('when wallet balances match', function () {
                it('should return only those wallets', function () {
                    wrapper.vm.applySearch('13');
                    expect(wrapper.vm.filterWallets(wallets)).toEqual([
                        wallets[0],
                        wallets[1]
                    ]);
                });
            });
            describe('when wallet names match', function () {
                it('should return only those wallets', function () {
                    wrapper.vm.applySearch('am');
                    expect(wrapper.vm.filterWallets(wallets)).toEqual([
                        wallets[0],
                        wallets[1]
                    ]);
                });
                it('should ignore the case', function () {
                    wrapper.vm.applySearch('Am');
                    expect(wrapper.vm.filterWallets(wallets)).toEqual([
                        wallets[0],
                        wallets[1]
                    ]);
                });
            });
            describe('when wallet alternative (delegate, network, etc.) names match', function () {
                it('should return only those wallets', function () {
                    wrapper.vm.wallet_name = jest.fn().mockImplementation(function (address) {
                        var wallet = wallets.find(function (wallet) { return wallet.address === address; });
                        return wallet.name + "s";
                    });
                    wrapper.vm.applySearch('examples');
                    expect(wrapper.vm.filterWallets(wallets)).toEqual([
                        wallets[0]
                    ]);
                });
                it('should ignore the case', function () {
                    wrapper.vm.wallet_name = jest.fn().mockImplementation(function (address) {
                        var wallet = wallets.find(function (wallet) { return wallet.address === address; });
                        return wallet.name + "s";
                    });
                    wrapper.vm.applySearch('eXaMples');
                    expect(wrapper.vm.filterWallets(wallets)).toEqual([
                        wallets[0]
                    ]);
                });
            });
        });
    });
    describe('sortWallets', function () {
        var wallets = [
            { address: 'AA', name: 'example', balance: '132' },
            { address: 'AD', name: '', balance: '0' },
            { address: 'AB', name: 'name', balance: '13' },
            { address: 'AC', name: 'other', balance: '937' }
        ];
        var wrapper;
        beforeEach(function () {
            wrapper = mount();
        });
        describe('when the order is `name-asc`', function () {
            beforeEach(function () {
                wrapper.vm.$store.getters['session/walletSidebarSortParams'] = { field: 'name', type: 'asc' };
            });
            it('should sort the wallets by name ascendently', function () {
                wrapper.vm.applySortOrder({ field: 'name', type: 'asc' });
                expect(wrapper.vm.sortWallets(wallets.slice())).toEqual([
                    wallets[1],
                    wallets[0],
                    wallets[2],
                    wallets[3]
                ]);
            });
        });
        describe('when the order is `name-desc`', function () {
            beforeEach(function () {
                wrapper.vm.$store.getters['session/walletSidebarSortParams'] = { field: 'name', type: 'desc' };
            });
            it('should sort the wallets by name descendently', function () {
                wrapper.vm.applySortOrder({ field: 'name', type: 'desc' });
                expect(wrapper.vm.sortWallets(wallets.slice())).toEqual([
                    wallets[3],
                    wallets[2],
                    wallets[0],
                    wallets[1]
                ]);
            });
        });
        describe('when the order is `balance-asc`', function () {
            beforeEach(function () {
                wrapper.vm.$store.getters['session/walletSidebarSortParams'] = { field: 'balance', type: 'asc' };
            });
            it('should sort the wallets by balance ascendently', function () {
                wrapper.vm.applySortOrder({ field: 'balance', type: 'asc' });
                expect(wrapper.vm.sortWallets(wallets.slice())).toEqual([
                    wallets[1],
                    wallets[2],
                    wallets[0],
                    wallets[3]
                ]);
            });
        });
        describe('when the order is `balance-desc`', function () {
            beforeEach(function () {
                wrapper.vm.$store.getters['session/walletSidebarSortParams'] = { field: 'balance', type: 'desc' };
            });
            it('should sort the wallets by balance descendently', function () {
                wrapper.vm.applySortOrder({ field: 'balance', type: 'desc' });
                expect(wrapper.vm.sortWallets(wallets.slice())).toEqual([
                    wallets[3],
                    wallets[0],
                    wallets[2],
                    wallets[1]
                ]);
            });
        });
    });
});
//# sourceMappingURL=WalletSidebar.spec.js.map