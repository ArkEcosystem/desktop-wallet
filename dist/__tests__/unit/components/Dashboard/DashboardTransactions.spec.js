var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { DashboardTransactions } from '@/components/Dashboard';
var i18n = useI18nGlobally();
var wrapper;
var wallets;
var transactions;
var walletTransactions;
var fetchTransactionsForWallets;
var loggerError = jest.fn();
var alertError = jest.fn();
var transactionByProfileId = jest.fn(function () { return 'profileId'; });
var walletByProfileId = jest.fn(function () { return wallets; });
var mocks;
beforeEach(function () {
    transactions = [
        { id: 'tx1', timestamp: 300 * 1000 },
        { id: 'tx2', timestamp: 400 * 1000 },
        { id: 'tx3', timestamp: 200 * 1000 },
        { id: 'tx4', timestamp: 110 * 1000 },
        { id: 'tx5', timestamp: 120 * 1000 }
    ];
    wallets = [
        { address: 'A1', transactions: {} },
        { address: 'A2', transactions: {} },
        { address: 'A3', transactions: {} },
        { address: 'A4', transactions: {} }
    ];
    walletTransactions = {
        A1: [
            transactions[0],
            transactions[1]
        ],
        A2: [
            transactions[2]
        ],
        A4: [
            transactions[3],
            transactions[4]
        ]
    };
    fetchTransactionsForWallets = jest.fn(function () { return walletTransactions; });
    // walletByProfileId = jest.fn(() => wallets)
    mocks = {
        $client: {
            fetchTransactionsForWallets: fetchTransactionsForWallets
        },
        $error: alertError,
        $logger: {
            error: loggerError
        },
        $store: {
            getters: {
                'transaction/byProfileId': transactionByProfileId,
                'wallet/byProfileId': walletByProfileId,
                'ledger/wallets': []
            }
        }
    };
    wrapper = shallowMount(DashboardTransactions, {
        i18n: i18n,
        mocks: mocks
    });
});
describe('DashboardTransactions', function () {
    it('should render modal', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('processTransactions', function () {
        it('should remove duplicate transactions', function () {
            var toProcess = __spreadArrays(transactions, [
                transactions[0],
                transactions[2]
            ]);
            expect(wrapper.vm.processTransactions(toProcess)).toIncludeSameMembers(transactions);
        });
        it('should sort transactions by `timestamp` descently', function () {
            expect(wrapper.vm.processTransactions(transactions)).toEqual([
                transactions[1],
                transactions[0],
                transactions[2],
                transactions[4],
                transactions[3]
            ]);
        });
    });
});
//# sourceMappingURL=DashboardTransactions.spec.js.map