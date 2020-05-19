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
import Vue from 'vue';
import { uniqBy } from 'lodash';
import crypto from 'crypto';
import BaseModule from '../base';
import ProfileModel from '@/models/profile';
import * as base58 from 'bs58check';
import BigNumber from '@/plugins/bignumber';
export default new BaseModule(ProfileModel, {
    getters: {
        byCompatibleAddress: function (state, _, __, rootGetters) { return function (address) {
            var publicKeyHash = base58.decode(address)[0];
            var profiles = [];
            for (var _i = 0, _a = state.all; _i < _a.length; _i++) {
                var profile = _a[_i];
                var network = rootGetters['network/byId'](profile.networkId);
                if (network.version === publicKeyHash) {
                    profiles.push(profile);
                }
            }
            return profiles;
        }; },
        doesExist: function (state) { return function (checkName) {
            var normalize = function (name) { return name.toLowerCase().replace(/^\s+|\s+$/g, ''); };
            checkName = normalize(checkName);
            return state.all.find(function (profile) { return normalize(profile.name) === checkName; });
        }; },
        balance: function (state, _, __, rootGetters) { return function (id) {
            var wallets = rootGetters['wallet/byProfileId'](id);
            return wallets.reduce(function (total, wallet) {
                return new BigNumber(wallet.balance).plus(total);
            }, 0);
        }; },
        balanceWithLedger: function (state, _, __, rootGetters) { return function (id) {
            var wallets = rootGetters['wallet/byProfileId'](id);
            // Only include the wallets of the Ledger that are on the same network than the profile
            var profile = rootGetters['profile/byId'](id);
            if (profile.networkId === rootGetters['session/network'].id) {
                wallets = __spreadArrays(wallets, rootGetters['ledger/wallets']);
            }
            return uniqBy(wallets, 'address').reduce(function (total, wallet) {
                return new BigNumber(wallet.balance).plus(total);
            }, 0);
        }; },
        public: function (state, _, __, rootGetters) { return function (all) {
            if (all === void 0) { all = false; }
            var isDarkTheme = function (theme) {
                if (['light', 'dark'].includes(theme)) {
                    return theme === 'dark';
                }
                return rootGetters['plugin/themes'][theme].darkMode;
            };
            var minimiseProfile = function (profile) { return ({
                avatar: profile.avatar,
                currency: profile.currency,
                theme: {
                    name: profile.theme,
                    isDark: isDarkTheme(profile.theme)
                },
                language: profile.language,
                name: profile.name,
                network: rootGetters['network/byId'](profile.networkId),
                wallets: rootGetters['wallet/publicByProfileId'](profile.id),
                contacts: rootGetters['wallet/publicByProfileId'](profile.id, true)
            }); };
            if (!all) {
                return minimiseProfile(rootGetters['session/profile']);
            }
            return state.all.map(function (profile) { return minimiseProfile(profile); });
        }; }
    },
    mutations: {
        SET_MULTI_SIGNATURE_PEER: function (state, _a) {
            var host = _a.host, port = _a.port, profileId = _a.profileId;
            for (var peerId in state.all) {
                if (state.all[peerId].id === profileId) {
                    Vue.set(state.all[peerId], 'multiSignaturePeer', { host: host, port: port });
                    break;
                }
            }
        }
    },
    actions: {
        /**
         * This default action is overridden to generate a random unique ID
         */
        create: function (_a, model) {
            var commit = _a.commit;
            model.id = crypto.randomBytes(12).toString('base64');
            var data = ProfileModel.deserialize(model);
            commit('CREATE', data);
            return data;
        },
        /**
         * This default action is overridden to remove the wallets of this profile first
         */
        delete: function (_a, _b) {
            var commit = _a.commit, dispatch = _a.dispatch, rootGetters = _a.rootGetters;
            var id = _b.id;
            return __awaiter(this, void 0, void 0, function () {
                var transactionIds, _i, transactionIds_1, transactionId, walletIds, _c, walletIds_1, walletId;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            transactionIds = rootGetters['transaction/byProfileId'](id).map(function (transaction) { return transaction.id; });
                            _i = 0, transactionIds_1 = transactionIds;
                            _d.label = 1;
                        case 1:
                            if (!(_i < transactionIds_1.length)) return [3 /*break*/, 4];
                            transactionId = transactionIds_1[_i];
                            return [4 /*yield*/, dispatch('transaction/delete', { id: transactionId, profileId: id }, { root: true })];
                        case 2:
                            _d.sent();
                            _d.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            walletIds = rootGetters['wallet/byProfileId'](id).map(function (wallet) { return wallet.id; });
                            _c = 0, walletIds_1 = walletIds;
                            _d.label = 5;
                        case 5:
                            if (!(_c < walletIds_1.length)) return [3 /*break*/, 8];
                            walletId = walletIds_1[_c];
                            return [4 /*yield*/, dispatch('wallet/delete', { id: walletId, profileId: id }, { root: true })];
                        case 6:
                            _d.sent();
                            _d.label = 7;
                        case 7:
                            _c++;
                            return [3 /*break*/, 5];
                        case 8:
                            commit('DELETE', id);
                            return [2 /*return*/];
                    }
                });
            });
        },
        setMultiSignaturePeer: function (_a, _b) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            var host = _b.host, port = _b.port;
            var profileId = rootGetters['session/profileId'];
            commit('SET_MULTI_SIGNATURE_PEER', { host: host, port: port, profileId: profileId });
        }
    }
});
//# sourceMappingURL=profile.js.map