var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import store from '@/store';
import BigNumber from '@/plugins/bignumber';
describe('ProfileModule', function () {
    it('should getter all profiles', function () {
        expect(store.getters['profile/all']).toBeEmpty();
    });
    it('should fail to create a new profile', function () {
        expect(function () { return store.dispatch('profile/create', { id: 'test' }); }).toThrow();
    });
    describe('getters > balance', function () {
        var profileId = 'balanceId';
        var profile = { id: profileId };
        var wallets = [
            { id: 'A1', profileId: profileId, balance: 1000 },
            { id: 'A2', profileId: profileId, balance: 173 },
            { id: 'A3', profileId: profileId, balance: 97 },
            { id: 'A4', profileId: 'other', balance: 50000 }
        ];
        beforeEach(function () {
            store.commit('profile/CREATE', profile);
            wallets.forEach(function (wallet) { return store.commit('wallet/STORE', wallet); });
        });
        afterEach(function () {
            wallets.forEach(function (wallet) { return store.commit('wallet/DELETE', wallet); });
            store.commit('profile/DELETE', profile.id);
        });
        it('should return the balance of the profile wallets', function () {
            var balance = store.getters['profile/balance'](profileId);
            expect(balance).toBeInstanceOf(BigNumber);
            expect(balance.toString()).toEqual('1270');
        });
    });
    describe('getters > balanceWithLedger', function () {
        var networks = [
            { id: 'main', symbol: 'm', token: 'MAI', subunit: 'mainito', fractionDigits: 8 },
            { id: 'other', symbol: 'o', token: 'OTH', subunit: 'another', fractionDigits: 8 }
        ];
        var profileId = 'balanceId';
        var profile = { id: profileId, networkId: networks[0].id };
        var wallets;
        var ledgerWallets;
        beforeEach(function () {
            wallets = [
                { id: 'A1', address: 'A1', profileId: profileId, balance: 1000 },
                { id: 'A2', address: 'A2', profileId: profileId, balance: 173 },
                { id: 'A3', address: 'A3', profileId: profileId, balance: 97 },
                { id: 'A4', address: 'A4', profileId: 'other', balance: 50000 }
            ];
            ledgerWallets = [
                { id: 'AxLedger1', address: 'AxLedger1', balance: 1330 },
                { id: 'AxLedger2', address: 'AxLedger2', balance: 301 }
            ];
            store.commit('network/SET_ALL', networks);
            store.commit('profile/CREATE', profile);
            wallets.forEach(function (wallet) { return store.commit('wallet/STORE', wallet); });
            store.commit('session/SET_PROFILE_ID', profileId);
        });
        afterEach(function () {
            wallets.forEach(function (wallet) { return store.commit('wallet/DELETE', wallet); });
            store.commit('profile/DELETE', profile.id);
        });
        describe('when the Ledger does not have wallets', function () {
            beforeEach(function () {
                store.commit('ledger/SET_WALLETS', []);
            });
            it('should return the balance of the profile wallets only', function () {
                var balance = store.getters['profile/balanceWithLedger'](profileId);
                expect(balance).toBeInstanceOf(BigNumber);
                expect(balance.toString()).toEqual('1270');
            });
        });
        describe('when the Ledger has wallets on the current network', function () {
            beforeEach(function () {
                store.commit('ledger/SET_WALLETS', ledgerWallets);
            });
            it('should return the balance of the profile wallets and the Ledger wallets', function () {
                var balance = store.getters['profile/balanceWithLedger'](profileId);
                expect(balance).toBeInstanceOf(BigNumber);
                expect(balance.toString()).toEqual('2901');
            });
            describe('when those wallets are already included in the profile', function () {
                beforeEach(function () {
                    ledgerWallets[0] = wallets[0];
                    store.commit('ledger/SET_WALLETS', ledgerWallets);
                });
                it('should ignore them', function () {
                    var balance = store.getters['profile/balanceWithLedger'](profileId);
                    expect(balance).toBeInstanceOf(BigNumber);
                    expect(balance.toString()).toEqual('1571');
                });
            });
        });
    });
    describe('actions > delete', function () {
        var profileId = 'deleteId';
        var profile = { id: profileId };
        var wallets = [
            { id: 'A1', profileId: profileId },
            { id: 'A2', profileId: profileId },
            { id: 'A3', profileId: profileId }
        ];
        var transactions = [
            { id: 'tx1', profileId: profileId },
            { id: 'tx2', profileId: profileId },
            { id: 'tx3', profileId: profileId }
        ];
        beforeEach(function () {
            store.commit('profile/CREATE', profile);
            wallets.forEach(function (wallet) { return store.commit('wallet/STORE', wallet); });
            transactions.forEach(function (transaction) { return store.commit('transaction/STORE', transaction); });
        });
        it('should delete the profile', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(store.getters['profile/all']).toEqual([profile]);
                        return [4 /*yield*/, store.dispatch('profile/delete', { id: profileId })];
                    case 1:
                        _a.sent();
                        expect(store.getters['profile/all']).toBeEmpty();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should delete the wallets of the profile', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(store.getters['wallet/byProfileId'](profileId)).toIncludeSameMembers(wallets);
                        return [4 /*yield*/, store.dispatch('profile/delete', { id: profileId })];
                    case 1:
                        _a.sent();
                        expect(store.getters['wallet/byProfileId'](profileId)).toBeEmpty();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should delete the transactions of the profile', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(store.getters['transaction/byProfileId'](profileId)).toIncludeSameMembers(transactions);
                        return [4 /*yield*/, store.dispatch('profile/delete', { id: profileId })];
                    case 1:
                        _a.sent();
                        expect(store.getters['transaction/byProfileId'](profileId)).toBeEmpty();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=profile.spec.js.map