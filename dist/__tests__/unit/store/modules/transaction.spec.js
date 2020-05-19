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
import nock from 'nock';
import Vue from 'vue';
import Vuex from 'vuex';
import apiClient, { client as ClientService } from '@/plugins/api-client';
import store from '@/store';
import dayjs from 'dayjs';
import { network1 } from '../../__fixtures__/store/network';
import { profile1 } from '../../__fixtures__/store/profile';
Vue.use(Vuex);
Vue.use(apiClient);
describe('TransactionModule', function () {
    var transactions = [
        { id: 0, recipient: 'A0', sender: 'A4', profileId: 'otherId' },
        { id: 1, recipient: 'A1', sender: 'A2', profileId: profile1.id },
        { id: 3, recipient: 'A3', sender: 'A2', profileId: 'otherId' },
        { id: 4, recipient: 'A3', sender: 'A3', profileId: profile1.id },
        { id: 5, recipient: 'A4', sender: 'A3', profileId: profile1.id },
        { id: 6, recipient: 'A5', sender: 'A1', profileId: profile1.id },
        { id: 7, recipient: 'A5', sender: 'A1', profileId: profile1.id },
        { id: 8, recipient: 'A5', sender: 'Aex', profileId: profile1.id, isExpired: true },
        { id: 9, recipient: 'A5', sender: 'Aex', profileId: profile1.id, isExpired: true }
    ];
    var wallets = [
        { id: 1, address: 'A2', profileId: profile1.id, name: 'name1' },
        { id: 2, address: 'A3', profileId: profile1.id, name: 'name2' },
        { id: 3, address: 'A4', profileId: profile1.id, name: 'name3' },
        { id: 4, address: 'A5', profileId: profile1.id, name: 'name4' },
        { id: 5, address: 'Aex', profileId: profile1.id, name: 'expirable' }
    ];
    beforeAll(function () {
        store.commit('network/SET_ALL', [network1]);
        store.commit('profile/CREATE', profile1);
        store.commit('session/SET_PROFILE_ID', profile1.id);
    });
    beforeEach(function () {
        transactions.forEach(function (transaction) { return store.commit('transaction/STORE', transaction); });
        wallets.forEach(function (wallet) { return store.commit('wallet/STORE', wallet); });
        ClientService.host = 'http://127.0.0.1:4003';
        nock.cleanAll();
    });
    describe('getters byAddress', function () {
        describe('when the address param does not exist', function () {
            it('should return an empty `Array`', function () {
                expect(store.getters['transaction/byAddress']('AunKno0n')).toBeEmpty();
            });
        });
        describe('when the address is used as recipient', function () {
            it('should find and return the transactions of the current profile', function () {
                var found = store.getters['transaction/byAddress']('A4');
                expect(found).toEqual([
                    transactions[4]
                ]);
                found.forEach(function (transaction) {
                    expect(transaction).toHaveProperty('totalAmount');
                    expect(transaction).toHaveProperty('isSender');
                    expect(transaction).toHaveProperty('isRecipient', true);
                });
            });
        });
        describe('when the address is used as sender', function () {
            it('should find and return the transactions of the current profile', function () {
                var found = store.getters['transaction/byAddress']('A2');
                expect(found).toIncludeSameMembers([
                    transactions[1]
                ]);
                found.forEach(function (transaction) {
                    expect(transaction).toHaveProperty('totalAmount');
                    expect(transaction).toHaveProperty('isSender', true);
                    expect(transaction).toHaveProperty('isRecipient');
                });
            });
        });
        describe('when the address is used as recipient and sender', function () {
            it('should find and return the transactions of the current profile', function () {
                var found = store.getters['transaction/byAddress']('A3');
                expect(found).toIncludeSameMembers([
                    transactions[3],
                    transactions[4]
                ]);
                found.forEach(function (transaction) {
                    expect(transaction).toHaveProperty('totalAmount');
                    expect(transaction).toHaveProperty('isSender', transaction.sender === 'A3');
                    expect(transaction).toHaveProperty('isRecipient', transaction.recipient === 'A3');
                });
            });
        });
        describe('when not passing `includeExpired`', function () {
            it('should find and return the transactions of the current profile that have not expired', function () {
                var found = store.getters['transaction/byAddress']('A5');
                expect(found).toIncludeSameMembers([
                    transactions[5],
                    transactions[6]
                ]);
                found.forEach(function (transaction) {
                    expect(transaction).toHaveProperty('totalAmount');
                    expect(transaction).toHaveProperty('isSender', transaction.sender === 'A5');
                });
            });
        });
        describe('when passing `includeExpired` as `false`', function () {
            it('should find and return the transactions of the current profile that have not expired', function () {
                var found = store.getters['transaction/byAddress']('A5', { includeExpired: false });
                expect(found).toIncludeSameMembers([
                    transactions[5],
                    transactions[6]
                ]);
                found.forEach(function (transaction) {
                    expect(transaction).toHaveProperty('totalAmount');
                    expect(transaction).toHaveProperty('isSender', transaction.sender === 'A5');
                });
            });
        });
        describe('when passing `includeExpired` as `true`', function () {
            it('should find and return all the transactions of the current profile, even those that have expired', function () {
                var found = store.getters['transaction/byAddress']('A5', { includeExpired: true });
                expect(found).toIncludeSameMembers([
                    transactions[5],
                    transactions[6],
                    transactions[7],
                    transactions[8]
                ]);
                found.forEach(function (transaction) {
                    expect(transaction).toHaveProperty('totalAmount');
                    expect(transaction).toHaveProperty('isSender', transaction.sender === 'A5');
                });
            });
        });
    });
    describe.skip('getters byProfileId', function () {
        describe('when the profile does not have any transaction', function () {
            it('should return an empty `Array`', function () {
                expect(store.getters['transaction/byProfileId']('unknownId')).toBeEmpty();
            });
        });
        describe('when the profile has transactions', function () {
            it('should return them, without transactions from other profiles', function () {
                var transactions = store.getters['transaction/byProfileId'](profile1.id);
                expect(transactions).toIncludeSameMembers([
                    transactions[1],
                    transactions[3],
                    transactions[4],
                    transactions[5]
                ]);
                transactions.forEach(function (transaction) {
                    expect(transaction).toHaveProperty('totalAmount');
                    expect(transaction).toHaveProperty('isSender');
                    expect(transaction).toHaveProperty('isRecipient');
                });
            });
        });
    });
    describe('getters staticFee', function () {
        it('should return a single fee', function () {
            store.commit('transaction/SET_STATIC_FEES', {
                networkId: network1.id,
                staticFees: [1, 2, 3, 4, 5]
            });
            expect(store.getters['transaction/staticFee'](0)).toEqual(1);
            expect(store.getters['transaction/staticFee'](1)).toEqual(2);
            expect(store.getters['transaction/staticFee'](2)).toEqual(3);
            expect(store.getters['transaction/staticFee'](3)).toEqual(4);
            expect(store.getters['transaction/staticFee'](4)).toEqual(5);
        });
        it('should return null if no fee', function () {
            store.commit('transaction/SET_STATIC_FEES', {
                networkId: network1.id,
                staticFees: []
            });
            expect(store.getters['transaction/staticFee'](0)).not.toBe(expect.anything());
        });
    });
    describe('dispatch updateStaticFees', function () {
        it('should return update all fees on v2', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nock('http://127.0.0.1:4003')
                            .get('/api/transactions/fees')
                            .reply(200, {
                            data: {
                                transfer: 1,
                                secondSignature: 2,
                                delegateRegistration: 3,
                                vote: 4,
                                multiSignature: 5
                            }
                        });
                        return [4 /*yield*/, store.dispatch('transaction/updateStaticFees')];
                    case 1:
                        _a.sent();
                        expect(store.getters['transaction/staticFee'](0)).toEqual(1);
                        expect(store.getters['transaction/staticFee'](1)).toEqual(2);
                        expect(store.getters['transaction/staticFee'](2)).toEqual(3);
                        expect(store.getters['transaction/staticFee'](3)).toEqual(4);
                        expect(store.getters['transaction/staticFee'](4)).toEqual(5);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('clear unconfirmed votes', function () {
        beforeEach(function () {
            store.commit('session/SET_UNCONFIRMED_VOTES', [
                {
                    id: 1,
                    timestamp: dayjs().subtract(6, 'hour').valueOf()
                },
                {
                    id: 2,
                    timestamp: dayjs().subtract(5, 'hour').valueOf()
                },
                {
                    id: 3
                }
            ]);
        });
        it('should clear unconfirmed votes after 6h or no timestamp', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(store.getters['session/unconfirmedVotes'].length).toBe(3);
                        return [4 /*yield*/, store.dispatch('transaction/clearUnconfirmedVotes')];
                    case 1:
                        _a.sent();
                        expect(store.getters['session/unconfirmedVotes'].length).toBe(1);
                        expect(store.getters['session/unconfirmedVotes'][0].id).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=transaction.spec.js.map