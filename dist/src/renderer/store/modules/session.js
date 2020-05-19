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
import { I18N, MARKET } from '@config';
export default {
    namespaced: true,
    state: function () { return ({
        avatar: null,
        background: null,
        currency: null,
        language: null,
        hideWalletButtonText: false,
        isMarketChartEnabled: true,
        isAdvancedModeEnabled: false,
        marketChartOptions: { isEnabled: true, isExpanded: true, period: 'day' },
        name: null,
        profileId: null,
        theme: null,
        pluginManagerLayout: null,
        walletLayout: null,
        walletSidebarSortParams: null,
        walletSidebarFilters: null,
        walletSortParams: null,
        contactSortParams: null,
        pluginSortParams: null,
        screenshotProtection: true,
        backgroundUpdateLedger: null,
        broadcastPeers: null,
        ledgerCache: null,
        transactionTableRowCount: 10,
        unconfirmedVotes: [],
        lastFees: {},
        multiSignaturePeer: null,
        filterBlacklistedPlugins: true,
        pluginAdapter: 'npm',
        priceApi: 'coingecko',
        pluginMenuOpen: true,
        defaultChosenFee: 'AVERAGE'
    }); },
    getters: {
        profileId: function (state) {
            return state.profileId;
        },
        profile: function (state, _, __, rootGetters) {
            if (!state.profileId) {
                return;
            }
            return rootGetters['profile/byId'](state.profileId);
        },
        network: function (state, getters, __, rootGetters) {
            if (!getters.profile) {
                return;
            }
            var networkId = getters.profile.networkId;
            var network = rootGetters['network/byId'](networkId);
            if (!network) {
                network = rootGetters['network/customNetworkById'](networkId);
            }
            return network;
        },
        avatar: function (state) { return state.avatar; },
        background: function (state) { return state.background; },
        currency: function (state) { return state.currency; },
        timeFormat: function (state) { return state.timeFormat; },
        hideWalletButtonText: function (state) { return state.hideWalletButtonText; },
        isMarketChartEnabled: function (state) { return state.isMarketChartEnabled; },
        isAdvancedModeEnabled: function (state) { return state.isAdvancedModeEnabled; },
        marketChartOptions: function (state) { return (__assign({}, state.marketChartOptions)); },
        theme: function (state) { return state.theme; },
        pluginManagerLayout: function (state) { return state.pluginManagerLayout; },
        walletLayout: function (state) { return state.walletLayout; },
        walletSidebarSortParams: function (state) { return (__assign({}, state.walletSidebarSortParams)); },
        walletSidebarFilters: function (state) { return (__assign({}, state.walletSidebarFilters)); },
        walletSortParams: function (state) { return state.walletSortParams; },
        contactSortParams: function (state) { return state.contactSortParams; },
        pluginSortParams: function (state) { return state.pluginSortParams; },
        language: function (state) { return state.language; },
        bip39Language: function (state) { return state.bip39Language; },
        name: function (state) { return state.name; },
        hasWalletGridLayout: function (state) { return state.walletLayout === 'grid'; },
        screenshotProtection: function (state) { return state.screenshotProtection; },
        backgroundUpdateLedger: function (state) { return state.backgroundUpdateLedger; },
        broadcastPeers: function (state) { return state.broadcastPeers; },
        ledgerCache: function (state) { return state.ledgerCache; },
        transactionTableRowCount: function (state) { return state.transactionTableRowCount; },
        unconfirmedVotes: function (state) { return state.unconfirmedVotes; },
        lastFees: function (state) { return state.lastFees; },
        lastFeeByType: function (state) { return function (type, typeGroup) {
            return (state.lastFees && state.lastFees[typeGroup]) ? state.lastFees[typeGroup][type] : null;
        }; },
        multiSignaturePeer: function (state) { return state.multiSignaturePeer; },
        filterBlacklistedPlugins: function (state) { return state.filterBlacklistedPlugins; },
        pluginAdapter: function (state) { return state.pluginAdapter; },
        priceApi: function (state) { return state.priceApi; },
        pluginMenuOpen: function (state) { return state.pluginMenuOpen; },
        defaultChosenFee: function (state) { return state.defaultChosenFee; }
    },
    mutations: {
        SET_AVATAR: function (state, avatar) {
            state.avatar = avatar;
        },
        SET_BACKGROUND: function (state, background) {
            state.background = background;
        },
        SET_CURRENCY: function (state, currency) {
            state.currency = currency;
        },
        SET_TIME_FORMAT: function (state, format) {
            state.timeFormat = format;
        },
        SET_HIDE_WALLET_BUTTON_TEXT: function (state, isHidden) {
            state.hideWalletButtonText = isHidden;
        },
        SET_IS_MARKET_CHART_ENABLED: function (state, isEnabled) {
            state.isMarketChartEnabled = isEnabled;
        },
        SET_IS_ADVANCED_MODE_ENABLED: function (state, isEnabled) {
            state.isAdvancedModeEnabled = isEnabled;
        },
        SET_MARKET_CHART_OPTIONS: function (state, marketChartOptions) {
            state.marketChartOptions = marketChartOptions;
        },
        SET_LANGUAGE: function (state, language) {
            state.language = language;
        },
        SET_BIP39_LANGUAGE: function (state, bip39Language) {
            state.bip39Language = bip39Language;
        },
        SET_NAME: function (state, name) {
            state.name = name;
        },
        SET_PROFILE_ID: function (state, profileId) {
            state.profileId = profileId;
        },
        SET_THEME: function (state, theme) {
            state.theme = theme;
        },
        SET_PLUGIN_MANAGER_LAYOUT: function (state, pluginManagerLayout) {
            state.pluginManagerLayout = pluginManagerLayout;
        },
        SET_WALLET_LAYOUT: function (state, walletLayout) {
            state.walletLayout = walletLayout;
        },
        SET_WALLET_SIDEBAR_SORT_PARAMS: function (state, params) {
            state.walletSidebarSortParams = params;
        },
        SET_WALLET_SIDEBAR_FILTERS: function (state, filters) {
            state.walletSidebarFilters = filters;
        },
        SET_WALLET_TABLE_SORT_PARAMS: function (state, walletSortParams) {
            state.walletSortParams = walletSortParams;
        },
        SET_CONTACT_TABLE_SORT_PARAMS: function (state, contactSortParams) {
            state.contactSortParams = contactSortParams;
        },
        SET_PLUGIN_TABLE_SORT_PARAMS: function (state, pluginSortParams) {
            state.pluginSortParams = pluginSortParams;
        },
        SET_SCREENSHOT_PROTECTION: function (state, protection) {
            state.screenshotProtection = protection;
        },
        SET_BACKGROUND_UPDATE_LEDGER: function (state, update) {
            state.backgroundUpdateLedger = update;
        },
        SET_BROADCAST_PEERS: function (state, broadcast) {
            state.broadcastPeers = broadcast;
        },
        SET_LEDGER_CACHE: function (state, enabled) {
            state.ledgerCache = enabled;
        },
        SET_TRANSACTION_TABLE_ROW_COUNT: function (state, count) {
            state.transactionTableRowCount = count;
        },
        SET_UNCONFIRMED_VOTES: function (state, votes) {
            state.unconfirmedVotes = votes;
        },
        SET_LAST_FEES_BY_TYPE: function (state, _a) {
            var fee = _a.fee, type = _a.type, typeGroup = _a.typeGroup;
            if (!state.lastFees[typeGroup]) {
                state.lastFees[typeGroup] = {};
            }
            state.lastFees[typeGroup][type] = fee;
        },
        SET_MULTI_SIGNATURE_PEER: function (state, peer) {
            state.multiSignaturePeer = peer;
        },
        SET_FILTER_BLACKLISTED_PLUGINS: function (state, filterBlacklistedPlugins) {
            state.filterBlacklistedPlugins = filterBlacklistedPlugins;
        },
        SET_PLUGIN_ADAPTER: function (state, pluginAdapter) {
            state.pluginAdapter = pluginAdapter;
        },
        SET_PRICE_API: function (state, priceApi) {
            state.priceApi = priceApi;
        },
        SET_PLUGIN_MENU_OPEN: function (state, pluginMenuOpen) {
            state.pluginMenuOpen = pluginMenuOpen;
        },
        SET_DEFAULT_CHOSEN_FEE: function (state, defaultChosenFee) {
            state.defaultChosenFee = defaultChosenFee;
        },
        RESET: function (state) {
            state.avatar = 'pages/new-profile-avatar.svg';
            state.background = null;
            state.currency = MARKET.defaultCurrency;
            state.timeFormat = 'Default';
            state.hideWalletButtonText = false;
            state.isMarketChartEnabled = true;
            state.isAdvancedModeEnabled = false;
            state.marketChartOptions = { isEnabled: true, isExpanded: true, period: 'day' };
            state.language = I18N.defaultLocale;
            state.bip39Language = 'english';
            state.name = null;
            state.theme = 'light';
            state.pluginManagerLayout = 'grid';
            state.walletLayout = 'grid';
            state.walletSidebarSortParams = { field: 'name', type: 'asc' };
            state.walletSidebarFilters = {};
            state.walletSortParams = { field: 'balance', type: 'desc' };
            state.contactSortParams = { field: 'name', type: 'asc' };
            state.pluginSortParams = { field: 'title', type: 'asc' };
            state.backgroundUpdateLedger = true;
            state.broadcastPeers = true;
            state.screenshotProtection = true;
            state.ledgerCache = false;
            state.transactionTableRowCount = 10;
            state.unconfirmedVotes = [];
            state.lastFees = {};
            state.multiSignaturePeer = null;
            state.filterBlacklistedPlugins = true;
            state.pluginAdapter = 'npm';
            state.priceApi = 'coingecko';
            state.pluginMenuOpen = true;
            state.defaultChosenFee = 'AVERAGE';
        },
        REPLACE: function (state, value) {
            state.avatar = value.avatar;
            state.background = value.background;
            state.currency = value.currency;
            state.timeFormat = value.timeFormat;
            state.hideWalletButtonText = value.hideWalletButtonText;
            state.isMarketChartEnabled = value.isMarketChartEnabled;
            state.isAdvancedModeEnabled = value.isAdvancedModeEnabled;
            state.marketChartOptions = value.marketChartOptions;
            state.language = value.language;
            state.bip39Language = value.bip39Language;
            state.name = value.name;
            state.theme = value.theme;
            state.pluginManagerLayout = value.pluginManagerLayout;
            state.walletLayout = value.walletLayout;
            state.walletSidebarSortParams = value.walletSidebarSortParams;
            state.walletSidebarFilters = value.walletSidebarFilters;
            state.walletSortParams = value.walletSortParams;
            state.contactSortParams = value.contactSortParams;
            state.pluginSortParams = value.pluginSortParams;
            state.backgroundUpdateLedger = value.backgroundUpdateLedger;
            state.broadcastPeers = value.broadcastPeers;
            state.screenshotProtection = value.screenshotProtection;
            state.ledgerCache = value.ledgerCache;
            state.transactionTableRowCount = value.transactionTableRowCount;
            state.unconfirmedVotes = value.unconfirmedVotes;
            state.lastFees = value.lastFees;
            state.multiSignaturePeer = value.multiSignaturePeer;
            state.filterBlacklistedPlugins = value.filterBlacklistedPlugins;
            state.pluginAdapter = value.pluginAdapter;
            state.priceApi = value.priceApi;
            state.pluginMenuOpen = value.pluginMenuOpen !== undefined ? value.pluginMenuOpen : true;
            state.defaultChosenFee = value.defaultChosenFee;
        }
    },
    actions: {
        load: function (_a, profileId) {
            var commit = _a.commit, rootGetters = _a.rootGetters, dispatch = _a.dispatch;
            var profile = rootGetters['profile/byId'](profileId);
            if (!profile)
                return;
            if (!profile.unconfirmedVotes) {
                profile.unconfirmedVotes = [];
                dispatch('profile/update', profile, { root: true });
            }
            commit('REPLACE', profile);
            return profile;
        },
        reset: function (_a) {
            var commit = _a.commit;
            commit('RESET');
        },
        setAvatar: function (_a, value) {
            var commit = _a.commit;
            commit('SET_AVATAR', value);
        },
        setBackground: function (_a, value) {
            var commit = _a.commit;
            commit('SET_BACKGROUND', value);
        },
        setCurrency: function (_a, value) {
            var commit = _a.commit;
            commit('SET_CURRENCY', value);
        },
        setTimeFormat: function (_a, value) {
            var commit = _a.commit;
            commit('SET_TIME_FORMAT', value);
        },
        setHideWalletButtonText: function (_a, value) {
            var commit = _a.commit;
            commit('SET_HIDE_WALLET_BUTTON_TEXT', value);
        },
        setIsMarketChartEnabled: function (_a, value) {
            var commit = _a.commit;
            commit('SET_IS_MARKET_CHART_ENABLED', value);
        },
        setIsAdvancedModeEnabled: function (_a, value) {
            var commit = _a.commit;
            commit('SET_IS_ADVANCED_MODE_ENABLED', value);
        },
        setMarketChartOptions: function (_a, value) {
            var commit = _a.commit;
            commit('SET_MARKET_CHART_OPTIONS', value);
        },
        setLanguage: function (_a, value) {
            var commit = _a.commit;
            commit('SET_LANGUAGE', value);
        },
        setBip39Language: function (_a, value) {
            var commit = _a.commit;
            commit('SET_BIP39_LANGUAGE', value);
        },
        setName: function (_a, value) {
            var commit = _a.commit;
            commit('SET_NAME', value);
        },
        setScreenshotProtection: function (_a, value) {
            var commit = _a.commit;
            commit('SET_SCREENSHOT_PROTECTION', value);
        },
        setBackgroundUpdateLedger: function (_a, value) {
            var commit = _a.commit;
            commit('SET_BACKGROUND_UPDATE_LEDGER', value);
        },
        setBroadcastPeers: function (_a, value) {
            var commit = _a.commit;
            commit('SET_BROADCAST_PEERS', value);
        },
        setLedgerCache: function (_a, value) {
            var commit = _a.commit;
            commit('SET_LEDGER_CACHE', value);
        },
        setProfileId: function (_a, value) {
            var commit = _a.commit, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            commit('SET_PROFILE_ID', value);
                            return [4 /*yield*/, dispatch('load', value)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        setTheme: function (_a, value) {
            var commit = _a.commit;
            commit('SET_THEME', value);
        },
        setPluginManagerLayout: function (_a, value) {
            var commit = _a.commit;
            commit('SET_PLUGIN_MANAGER_LAYOUT', value);
        },
        setWalletLayout: function (_a, value) {
            var commit = _a.commit;
            commit('SET_WALLET_LAYOUT', value);
        },
        setWalletSidebarSortParams: function (_a, value) {
            var commit = _a.commit;
            commit('SET_WALLET_SIDEBAR_SORT_PARAMS', value);
        },
        setWalletSidebarFilters: function (_a, value) {
            var commit = _a.commit;
            commit('SET_WALLET_SIDEBAR_FILTERS', value);
        },
        setWalletSortParams: function (_a, value) {
            var commit = _a.commit;
            commit('SET_WALLET_TABLE_SORT_PARAMS', value);
        },
        setContactSortParams: function (_a, value) {
            var commit = _a.commit;
            commit('SET_CONTACT_TABLE_SORT_PARAMS', value);
        },
        setPluginSortParams: function (_a, value) {
            var commit = _a.commit;
            commit('SET_PLUGIN_TABLE_SORT_PARAMS', value);
        },
        setTransactionTableRowCount: function (_a, value) {
            var commit = _a.commit;
            commit('SET_TRANSACTION_TABLE_ROW_COUNT', value);
        },
        setUnconfirmedVotes: function (_a, value) {
            var commit = _a.commit;
            commit('SET_UNCONFIRMED_VOTES', value);
        },
        setLastFeeByType: function (_a, _b) {
            var commit = _a.commit;
            var fee = _b.fee, type = _b.type, typeGroup = _b.typeGroup;
            commit('SET_LAST_FEES_BY_TYPE', { fee: fee, type: type, typeGroup: typeGroup });
        },
        setMultiSignaturePeer: function (_a, _b) {
            var commit = _a.commit;
            var host = _b.host, port = _b.port;
            commit('SET_MULTI_SIGNATURE_PEER', { host: host, port: port });
        },
        setFilterBlacklistedPlugins: function (_a, value) {
            var commit = _a.commit;
            commit('SET_FILTER_BLACKLISTED_PLUGINS', value);
        },
        setPluginAdapter: function (_a, value) {
            var commit = _a.commit;
            commit('SET_PLUGIN_ADAPTER', value);
        },
        setPriceApi: function (_a, value) {
            var commit = _a.commit;
            commit('SET_PRICE_API', value);
        },
        setPluginMenuOpen: function (_a, value) {
            var commit = _a.commit;
            commit('SET_PLUGIN_MENU_OPEN', value);
        },
        setDefaultChosenFee: function (_a, value) {
            var commit = _a.commit;
            commit('SET_DEFAULT_CHOSEN_FEE', value);
        }
    }
};
//# sourceMappingURL=session.js.map