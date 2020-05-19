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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { dayjs } from '@/services/datetime';
import { unionBy } from 'lodash';
import { APP, TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config';
import eventBus from '@/plugins/event-bus';
import TransactionModel from '@/models/transaction';
import TransactionService from '@/services/transaction';
import Vue from 'vue';
var includes = function (objects, find) { return objects.map(function (a) { return a.id; }).includes(find.id); };
/**
 * This module stores unconfirmed transactions, so it does not persist currently:
 * it is not required and avoids managing their lifecycle when they are confirmed.
 *
 * Internally the transactions are stored aggregated by `profileId`
 */
export default {
    namespaced: true,
    state: {
        transactions: {},
        // TODO This should not be stored here: it depends on the network, not the transactions
        staticFees: {}
    },
    getters: {
        byAddress: function (state, _, __, rootGetters) { return function (address, _a) {
            var includeExpired = (_a === void 0 ? {} : _a).includeExpired;
            var profileId = rootGetters['session/profileId'];
            if (!profileId || !state.transactions[profileId]) {
                return [];
            }
            var transactions = state.transactions[profileId].filter(function (transaction) {
                return transaction.recipient === address || transaction.sender === address;
            }).map(function (transaction) {
                transaction.isSender = transaction.sender === address;
                transaction.isRecipient = transaction.recipient === address;
                transaction.totalAmount = TransactionService.getTotalAmount(transaction);
                return transaction;
            });
            if (includeExpired) {
                return transactions;
            }
            return transactions.filter(function (transaction) { return !transaction.isExpired; });
        }; },
        byProfileId: function (state, _, __, rootGetters) { return function (profileId, _a) {
            var includeExpired = (_a === void 0 ? {} : _a).includeExpired;
            if (!state.transactions[profileId]) {
                return [];
            }
            var addresses = rootGetters['wallet/byProfileId'](profileId).map(function (wallet) {
                return wallet.address;
            });
            var transactions = state.transactions[profileId].map(function (transaction) {
                transaction.isSender = addresses.includes(transaction.sender);
                transaction.isRecipient = addresses.includes(transaction.recipient);
                transaction.totalAmount = TransactionService.getTotalAmount(transaction);
                return transaction;
            });
            if (includeExpired) {
                return transactions;
            }
            return transactions.filter(function (transaction) { return !transaction.isExpired; });
        }; },
        /**
         * Get a static fee based on type.
         * @param  {Number} type
         * @return {(Number|null)}
         */
        staticFee: function (state, _, __, rootGetters) { return function (type, group) {
            var networkId = rootGetters['session/profile'].networkId;
            if (!networkId || !state.staticFees[networkId]) {
                return null;
            }
            if (state.staticFees[networkId][0]) {
                return state.staticFees[networkId][type];
            }
            else if (!state.staticFees[networkId][group]) {
                return null;
            }
            return state.staticFees[networkId][group][type];
        }; }
    },
    mutations: {
        CREATE: function (state, transaction) {
            if (!state.transactions[transaction.profileId]) {
                Vue.set(state.transactions, transaction.profileId, []);
            }
            if (includes(state.transactions[transaction.profileId], transaction)) {
                throw new Error("Cannot create transaction '" + transaction.id + "' - it already exists");
            }
            state.transactions[transaction.profileId].push(transaction);
        },
        STORE: function (state, transaction) {
            if (!state.transactions[transaction.profileId]) {
                Vue.set(state.transactions, transaction.profileId, []);
            }
            state.transactions[transaction.profileId] = unionBy(__spreadArrays([transaction], state.transactions[transaction.profileId]), 'id');
        },
        UPDATE: function (state, transaction) {
            if (!includes(state.transactions[transaction.profileId], transaction)) {
                throw new Error("Cannot update transaction '" + transaction.id + "' - it does not exist on the state");
            }
            state.transactions[transaction.profileId] = unionBy(__spreadArrays([transaction], state.transactions[transaction.profileId]), 'id');
        },
        UPDATE_BULK: function (state, _a) {
            var transactions = _a.transactions, profileId = _a.profileId;
            for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
                var transaction = transactions_1[_i];
                var index = null;
                for (var _b = 0, _c = Object.keys(state.transactions[profileId]); _b < _c.length; _b++) {
                    var profileTransactionIndex = _c[_b];
                    if (state.transactions[profileId][profileTransactionIndex].id === transaction.id) {
                        index = profileTransactionIndex;
                        break;
                    }
                }
                if (!index) {
                    continue;
                }
                Vue.set(state.transactions[profileId], index, transaction);
                state.transactions[profileId].splice(index, 1);
            }
        },
        DELETE: function (state, transaction) {
            var index = state.transactions[transaction.profileId].findIndex(function (profileTransaction) { return profileTransaction.id === transaction.id; });
            if (index === -1) {
                throw new Error("Cannot delete transaction '" + transaction.id + "' - it does not exist on the state");
            }
            state.transactions[transaction.profileId].splice(index, 1);
        },
        DELETE_BULK: function (state, _a) {
            var transactions = _a.transactions, profileId = _a.profileId;
            for (var _i = 0, transactions_2 = transactions; _i < transactions_2.length; _i++) {
                var transaction = transactions_2[_i];
                var index = null;
                if (!state.transactions[profileId]) {
                    continue;
                }
                for (var _b = 0, _c = Object.keys(state.transactions[profileId]); _b < _c.length; _b++) {
                    var profileTransactionIndex = _c[_b];
                    if (state.transactions[profileId][profileTransactionIndex].id === transaction.id) {
                        index = profileTransactionIndex;
                        break;
                    }
                }
                if (!index) {
                    continue;
                }
                state.transactions[profileId].splice(index, 1);
            }
        },
        SET_STATIC_FEES: function (state, data) {
            state.staticFees[data.networkId] = data.staticFees;
        }
    },
    actions: {
        create: function (_a, transaction) {
            var commit = _a.commit;
            var data = TransactionModel.deserialize(transaction);
            commit('CREATE', data);
            eventBus.emit("wallet:" + transaction.sender + ":transaction:new");
            return data;
        },
        store: function (_a, transactions) {
            var commit = _a.commit;
            commit('STORE', transactions);
        },
        update: function (_a, transaction) {
            var commit = _a.commit;
            var data = TransactionModel.deserialize(transaction);
            commit('UPDATE', data);
            return data;
        },
        processVotes: function (_a, transactions) {
            var dispatch = _a.dispatch, rootGetters = _a.rootGetters;
            if (transactions === void 0) { transactions = []; }
            var unconfirmedVotes = rootGetters['session/unconfirmedVotes'];
            var profile = rootGetters['session/profile'];
            if (!unconfirmedVotes || !unconfirmedVotes.length || !profile) {
                return;
            }
            var votes = transactions.filter(function (tx) { return tx.type === TRANSACTION_TYPES.GROUP_1.VOTE; });
            if (!votes.length) {
                return;
            }
            var ids = votes.map(function (vote) { return vote.id; });
            var pendingVotes = unconfirmedVotes.filter(function (vote) {
                return !ids.includes(vote.id);
            });
            dispatch('session/setUnconfirmedVotes', pendingVotes, { root: true });
            dispatch('profile/update', __assign(__assign({}, profile), { unconfirmedVotes: pendingVotes }), { root: true });
        },
        clearUnconfirmedVotes: function (_a) {
            var dispatch = _a.dispatch, rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                var unconfirmedVotes, profile, pendingVotes;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            unconfirmedVotes = rootGetters['session/unconfirmedVotes'];
                            profile = rootGetters['session/profile'];
                            if (!unconfirmedVotes || !unconfirmedVotes.length || !profile) {
                                return [2 /*return*/];
                            }
                            pendingVotes = unconfirmedVotes.filter(function (vote) {
                                if (!vote.timestamp) {
                                    return false;
                                }
                                return !dayjs().isAfter(dayjs(vote.timestamp).add(6, 'hour'));
                            });
                            return [4 /*yield*/, dispatch('session/setUnconfirmedVotes', pendingVotes, { root: true })];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, dispatch('profile/update', __assign(__assign({}, profile), { unconfirmedVotes: pendingVotes }), { root: true })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        clearExpired: function (_a) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            var expired = [];
            var profileId = rootGetters['session/profileId'];
            var threshold = dayjs().subtract(APP.transactionExpiryMinutes, 'minute');
            for (var _i = 0, _b = getters.byProfileId(profileId); _i < _b.length; _i++) {
                var transaction = _b[_i];
                if (dayjs(transaction.timestamp).isBefore(threshold)) {
                    transaction.isExpired = true;
                    expired.push(transaction.id);
                }
            }
            commit('UPDATE_BULK', { transactions: expired, profileId: profileId });
            return expired;
        },
        delete: function (_a, transaction) {
            var commit = _a.commit;
            commit('DELETE', transaction);
        },
        deleteBulk: function (_a, _b) {
            var commit = _a.commit;
            var _c = _b.transactions, transactions = _c === void 0 ? [] : _c, _d = _b.profileId, profileId = _d === void 0 ? null : _d;
            commit('DELETE_BULK', { transactions: transactions, profileId: profileId });
        },
        /**
         * Update static fees from API and store against a network.
         * @return {void}
         */
        updateStaticFees: function (_a) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                var staticFees, feesResponse, _i, _b, group;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            staticFees = {};
                            return [4 /*yield*/, this._vm.$client.fetchStaticFees()];
                        case 1:
                            feesResponse = _c.sent();
                            if (feesResponse.transfer) {
                                staticFees = Object.values(feesResponse);
                            }
                            else {
                                for (_i = 0, _b = Object.values(TRANSACTION_GROUPS); _i < _b.length; _i++) {
                                    group = _b[_i];
                                    if (!feesResponse[group]) {
                                        continue;
                                    }
                                    staticFees[group] = Object.values(feesResponse[group]);
                                }
                            }
                            commit('SET_STATIC_FEES', {
                                networkId: rootGetters['session/profile'].networkId,
                                staticFees: staticFees
                            });
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
};
//# sourceMappingURL=transaction.js.map