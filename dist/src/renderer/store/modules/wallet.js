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
import { unionBy, uniqBy } from 'lodash';
import WalletModel from '@/models/wallet';
import Vue from 'vue';
var includes = function (objects, find) { return objects.map(function (a) { return a.id; }).includes(find.id); };
var includesMessage = function (objects, find) { return objects.map(function (a) { return a.timestamp; }).includes(find.timestamp); };
var sanitizeWallet = function (wallet) {
    if (wallet.attributes && wallet.attributes.business && wallet.attributes.business.businessAsset) {
        wallet.business = wallet.attributes.business.businessAsset;
        wallet.business.resigned = !!wallet.attributes.business.resigned;
    }
    return wallet;
};
/**
 * Internally the wallets are stored aggregated by `profileId`
 */
export default {
    namespaced: true,
    state: {
        wallets: {},
        ledgerNames: {},
        secondaryButtonsVisible: false,
        signedMessages: {}
    },
    getters: {
        byAddress: function (state, _, __, rootGetters) { return function (address) {
            var profileId = rootGetters['session/profileId'];
            if (!profileId || !state.wallets[profileId]) {
                return null;
            }
            return state.wallets[profileId].find(function (wallet) { return wallet.address === address; });
        }; },
        byName: function (state, _, __, rootGetters) { return function (name) {
            var profileId = rootGetters['session/profileId'];
            if (!profileId || !state.wallets[profileId]) {
                return null;
            }
            return state.wallets[profileId].find(function (wallet) { return wallet.name === name; });
        }; },
        byProfileId: function (state) { return function (profileId) {
            if (!state.wallets[profileId]) {
                return [];
            }
            return state.wallets[profileId].filter(function (wallet) { return !wallet.isContact; });
        }; },
        publicByProfileId: function (state, _, __, rootGetters) { return function (profileId, getContacts) {
            if (getContacts === void 0) { getContacts = false; }
            var profileWallets = state.wallets[profileId] || [];
            var ledgerWallets = rootGetters['ledger/byProfileId'](profileId);
            var wallets = uniqBy(__spreadArrays(ledgerWallets, profileWallets), 'address');
            if (!wallets.length) {
                return [];
            }
            return wallets.filter(function (wallet) {
                return wallet.isContact === getContacts || wallet.isContact === undefined;
            }).map(function (wallet) { return (__assign({ address: wallet.address, balance: wallet.balance, name: wallet.name, publicKey: wallet.publicKey, vote: wallet.vote }, (wallet.isLedger && { isLedger: wallet.isLedger }))); });
        }; },
        contactsByProfileId: function (state) { return function (profileId) {
            if (!state.wallets[profileId]) {
                return [];
            }
            return state.wallets[profileId].filter(function (wallet) { return wallet.isContact; });
        }; },
        ledgerNameByAddress: function (state, _, __, rootGetters) { return function (address) {
            var profileId = rootGetters['session/profileId'];
            if (!state.ledgerNames[profileId]) {
                return null;
            }
            return state.ledgerNames[profileId][address];
        }; },
        secondaryButtonsVisible: function (state) { return state.secondaryButtonsVisible; },
        signedMessages: function (state) { return function (address) {
            if (!state.signedMessages[address]) {
                return [];
            }
            return state.signedMessages[address];
        }; }
    },
    mutations: {
        CREATE: function (state, wallet) {
            if (!state.wallets[wallet.profileId]) {
                Vue.set(state.wallets, wallet.profileId, []);
            }
            if (includes(state.wallets[wallet.profileId], wallet)) {
                throw new Error("Cannot create wallet '" + wallet.id + "' - it already exists");
            }
            state.wallets[wallet.profileId].push(wallet);
        },
        STORE: function (state, wallet) {
            if (!state.wallets[wallet.profileId]) {
                Vue.set(state.wallets, wallet.profileId, []);
            }
            state.wallets[wallet.profileId] = unionBy(__spreadArrays([wallet], state.wallets[wallet.profileId]), 'id');
        },
        UPDATE: function (state, wallet) {
            if (!includes(state.wallets[wallet.profileId], wallet)) {
                throw new Error("Cannot update wallet '" + wallet.id + "' - it does not exist on the state");
            }
            state.wallets[wallet.profileId] = unionBy(__spreadArrays([wallet], state.wallets[wallet.profileId]), 'id');
        },
        UPDATE_BULK: function (state, wallets) {
            var profileId = wallets[0].profileId;
            wallets.forEach(function (wallet) {
                if (profileId !== wallet.profileId) {
                    throw new Error("Updating wallets of different profile is not supported ('" + profileId + "' != '" + wallet.profileId + "')");
                }
                if (!includes(state.wallets[profileId], wallet)) {
                    throw new Error("Cannot update wallet '" + wallet.id + "' - it does not exist on the state");
                }
            });
            state.wallets[profileId] = unionBy(__spreadArrays(wallets, state.wallets[profileId]), 'id');
        },
        DELETE: function (state, wallet) {
            if (state.wallets[wallet.profileId]) {
                var index = state.wallets[wallet.profileId].findIndex(function (profileWallet) { return profileWallet.id === wallet.id; });
                if (index === -1) {
                    throw new Error("Cannot delete wallet '" + wallet.id + "' - it does not exist on the state");
                }
                state.wallets[wallet.profileId].splice(index, 1);
            }
        },
        SET_LEDGER_NAME: function (state, _a) {
            var address = _a.address, name = _a.name, profileId = _a.profileId;
            if (!state.ledgerNames[profileId]) {
                state.ledgerNames[profileId] = {};
            }
            state.ledgerNames[profileId][address] = name;
        },
        SET_SECONDARY_BUTTON: function (state, visibility) {
            state.secondaryButtonsVisible = visibility;
        },
        ADD_SIGNED_MESSAGE: function (state, message) {
            if (!state.signedMessages[message.address]) {
                state.signedMessages[message.address] = [];
            }
            if (!includesMessage(state.signedMessages[message.address], message)) {
                state.signedMessages[message.address].push(message);
            }
        },
        DELETE_SIGNED_MESSAGE: function (state, message) {
            if (state.signedMessages[message.address]) {
                var index = state.signedMessages[message.address].findIndex(function (signedMessage) { return signedMessage.timestamp === message.timestamp; });
                if (index !== -1) {
                    state.signedMessages[message.address].splice(index, 1);
                }
            }
        }
    },
    actions: {
        create: function (_a, wallet) {
            var commit = _a.commit;
            var data = WalletModel.deserialize(wallet);
            commit('CREATE', data);
            return data;
        },
        store: function (_a, wallets) {
            var commit = _a.commit;
            commit('STORE', wallets);
        },
        update: function (_a, wallet) {
            var commit = _a.commit;
            var data = WalletModel.deserialize(sanitizeWallet(wallet));
            commit('UPDATE', data);
            return data;
        },
        updateBulk: function (_a, wallets) {
            var commit = _a.commit;
            var data = wallets.map(function (wallet) { return WalletModel.deserialize(sanitizeWallet(wallet)); });
            commit('UPDATE_BULK', data);
            return data;
        },
        delete: function (_a, wallet) {
            var commit = _a.commit;
            commit('DELETE', wallet);
        },
        setLedgerName: function (_a, _b) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            var address = _b.address, name = _b.name;
            if (!address) {
                throw new Error('No address specified');
            }
            if (!name || !name.replace(/\s/g, '').length) {
                throw new Error('No name specified');
            }
            var profileId = rootGetters['session/profileId'];
            commit('SET_LEDGER_NAME', { address: address, name: name, profileId: profileId });
        },
        setSecondaryButtonsVisible: function (_a, visibility) {
            var commit = _a.commit;
            commit('SET_SECONDARY_BUTTON', visibility);
        },
        addSignedMessage: function (_a, message) {
            var commit = _a.commit;
            commit('ADD_SIGNED_MESSAGE', message);
        },
        deleteSignedMessage: function (_a, message) {
            var commit = _a.commit;
            commit('DELETE_SIGNED_MESSAGE', message);
        }
    }
};
//# sourceMappingURL=wallet.js.map