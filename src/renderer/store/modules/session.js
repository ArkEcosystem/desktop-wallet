import { I18N, MARKET } from "@config";

import { StoreBinding, StoreCommit } from "@/enums";

export default {
	namespaced: true,

	state: () => ({
		avatar: null,
		background: null,
		currency: null,
		language: null,
		hideWalletButtonText: false,
		isMarketChartEnabled: true,
		isAdvancedModeEnabled: false,
		marketChartOptions: { isEnabled: true, isExpanded: true, period: "day" },
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
		pluginAdapter: "npm",
		priceApi: "coingecko",
		pluginMenuOpen: true,
		defaultChosenFee: "AVERAGE",
	}),

	getters: {
		profileId(state) {
			return state.profileId;
		},
		profile(state, _, __, rootGetters) {
			if (!state.profileId) {
				return;
			}

			return rootGetters["profile/byId"](state.profileId);
		},
		network(state, getters, __, rootGetters) {
			if (!getters.profile) {
				return;
			}

			const { networkId } = getters.profile;
			let network = rootGetters["network/byId"](networkId);

			if (!network) {
				network = rootGetters["network/customNetworkById"](networkId);
			}
			return network;
		},
		avatar: (state) => state.avatar,
		background: (state) => state.background,
		currency: (state) => state.currency,
		timeFormat: (state) => state.timeFormat,
		hideWalletButtonText: (state) => state.hideWalletButtonText,
		isMarketChartEnabled: (state) => state.isMarketChartEnabled,
		isAdvancedModeEnabled: (state) => state.isAdvancedModeEnabled,
		marketChartOptions: (state) => ({ ...state.marketChartOptions }),
		theme: (state) => state.theme,
		pluginManagerLayout: (state) => state.pluginManagerLayout,
		walletLayout: (state) => state.walletLayout,
		walletSidebarSortParams: (state) => ({ ...state.walletSidebarSortParams }),
		walletSidebarFilters: (state) => ({ ...state.walletSidebarFilters }),
		walletSortParams: (state) => state.walletSortParams,
		contactSortParams: (state) => state.contactSortParams,
		pluginSortParams: (state) => state.pluginSortParams,
		language: (state) => state.language,
		bip39Language: (state) => state.bip39Language,
		name: (state) => state.name,
		hasWalletGridLayout: (state) => state.walletLayout === "grid",
		screenshotProtection: (state) => state.screenshotProtection,
		backgroundUpdateLedger: (state) => state.backgroundUpdateLedger,
		broadcastPeers: (state) => state.broadcastPeers,
		ledgerCache: (state) => state.ledgerCache,
		transactionTableRowCount: (state) => state.transactionTableRowCount,
		unconfirmedVotes: (state) => state.unconfirmedVotes,
		lastFees: (state) => state.lastFees,
		lastFeeByType: (state) => (type, typeGroup) => {
			return state.lastFees && state.lastFees[typeGroup] ? state.lastFees[typeGroup][type] : null;
		},
		multiSignaturePeer: (state) => state.multiSignaturePeer,
		filterBlacklistedPlugins: (state) => state.filterBlacklistedPlugins,
		pluginAdapter: (state) => state.pluginAdapter,
		priceApi: (state) => state.priceApi,
		pluginMenuOpen: (state) => state.pluginMenuOpen,
		defaultChosenFee: (state) => state.defaultChosenFee,
	},

	mutations: {
		SET_AVATAR(state, avatar) {
			state.avatar = avatar;
		},

		SET_BACKGROUND(state, background) {
			state.background = background;
		},

		SET_CURRENCY(state, currency) {
			state.currency = currency;
		},

		SET_TIME_FORMAT(state, format) {
			state.timeFormat = format;
		},

		SET_HIDE_WALLET_BUTTON_TEXT(state, isHidden) {
			state.hideWalletButtonText = isHidden;
		},

		SET_IS_MARKET_CHART_ENABLED(state, isEnabled) {
			state.isMarketChartEnabled = isEnabled;
		},

		SET_IS_ADVANCED_MODE_ENABLED(state, isEnabled) {
			state.isAdvancedModeEnabled = isEnabled;
		},

		SET_MARKET_CHART_OPTIONS(state, marketChartOptions) {
			state.marketChartOptions = marketChartOptions;
		},

		SET_LANGUAGE(state, language) {
			state.language = language;
		},

		SET_BIP39_LANGUAGE(state, bip39Language) {
			state.bip39Language = bip39Language;
		},

		SET_NAME(state, name) {
			state.name = name;
		},

		SET_PROFILE_ID(state, profileId) {
			state.profileId = profileId;
		},

		SET_THEME(state, theme) {
			state.theme = theme;
		},

		SET_PLUGIN_MANAGER_LAYOUT(state, pluginManagerLayout) {
			state.pluginManagerLayout = pluginManagerLayout;
		},

		SET_WALLET_LAYOUT(state, walletLayout) {
			state.walletLayout = walletLayout;
		},

		SET_WALLET_SIDEBAR_SORT_PARAMS(state, params) {
			state.walletSidebarSortParams = params;
		},

		SET_WALLET_SIDEBAR_FILTERS(state, filters) {
			state.walletSidebarFilters = filters;
		},

		SET_WALLET_TABLE_SORT_PARAMS(state, walletSortParams) {
			state.walletSortParams = walletSortParams;
		},

		SET_CONTACT_TABLE_SORT_PARAMS(state, contactSortParams) {
			state.contactSortParams = contactSortParams;
		},

		SET_PLUGIN_TABLE_SORT_PARAMS(state, pluginSortParams) {
			state.pluginSortParams = pluginSortParams;
		},

		SET_SCREENSHOT_PROTECTION(state, protection) {
			state.screenshotProtection = protection;
		},

		SET_BACKGROUND_UPDATE_LEDGER(state, update) {
			state.backgroundUpdateLedger = update;
		},

		SET_BROADCAST_PEERS(state, broadcast) {
			state.broadcastPeers = broadcast;
		},

		SET_LEDGER_CACHE(state, enabled) {
			state.ledgerCache = enabled;
		},

		SET_TRANSACTION_TABLE_ROW_COUNT(state, count) {
			state.transactionTableRowCount = count;
		},

		SET_UNCONFIRMED_VOTES(state, votes) {
			state.unconfirmedVotes = votes;
		},

		SET_LAST_FEES_BY_TYPE(state, { fee, type, typeGroup }) {
			if (!state.lastFees[typeGroup]) {
				state.lastFees[typeGroup] = {};
			}
			state.lastFees[typeGroup][type] = fee;
		},

		SET_MULTI_SIGNATURE_PEER(state, peer) {
			state.multiSignaturePeer = peer;
		},

		SET_FILTER_BLACKLISTED_PLUGINS(state, filterBlacklistedPlugins) {
			state.filterBlacklistedPlugins = filterBlacklistedPlugins;
		},

		SET_PLUGIN_ADAPTER(state, pluginAdapter) {
			state.pluginAdapter = pluginAdapter;
		},

		SET_PRICE_API(state, priceApi) {
			state.priceApi = priceApi;
		},

		SET_PLUGIN_MENU_OPEN(state, pluginMenuOpen) {
			state.pluginMenuOpen = pluginMenuOpen;
		},

		SET_DEFAULT_CHOSEN_FEE(state, defaultChosenFee) {
			state.defaultChosenFee = defaultChosenFee;
		},

		RESET(state) {
			state.avatar = "pages/new-profile-avatar.svg";
			state.background = null;
			state.currency = MARKET.defaultCurrency;
			state.timeFormat = "Default";
			state.hideWalletButtonText = false;
			state.isMarketChartEnabled = true;
			state.isAdvancedModeEnabled = false;
			state.marketChartOptions = { isEnabled: true, isExpanded: true, period: "day" };
			state.language = I18N.defaultLocale;
			state.bip39Language = "english";
			state.name = null;
			state.theme = "light";
			state.pluginManagerLayout = "grid";
			state.walletLayout = "grid";
			state.walletSidebarSortParams = { field: "name", type: "asc" };
			state.walletSidebarFilters = {};
			state.walletSortParams = { field: "balance", type: "desc" };
			state.contactSortParams = { field: "name", type: "asc" };
			state.pluginSortParams = { field: "title", type: "asc" };
			state.backgroundUpdateLedger = true;
			state.broadcastPeers = true;
			state.screenshotProtection = true;
			state.ledgerCache = false;
			state.transactionTableRowCount = 10;
			state.unconfirmedVotes = [];
			state.lastFees = {};
			state.multiSignaturePeer = null;
			state.filterBlacklistedPlugins = true;
			state.pluginAdapter = "npm";
			state.priceApi = "coingecko";
			state.pluginMenuOpen = true;
			state.defaultChosenFee = "AVERAGE";
		},

		REPLACE(state, value) {
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
		},
	},

	actions: {
		load({ commit, rootGetters, dispatch }, profileId) {
			const profile = rootGetters["profile/byId"](profileId);
			if (!profile) return;

			if (!profile.unconfirmedVotes) {
				profile.unconfirmedVotes = [];
				dispatch(StoreBinding.ProfileUpdate, profile, { root: true });
			}

			commit(StoreCommit.Replace, profile);

			return profile;
		},

		reset({ commit }) {
			commit(StoreCommit.Reset);
		},

		setAvatar({ commit }, value) {
			commit(StoreCommit.SetAvatar, value);
		},

		setBackground({ commit }, value) {
			commit(StoreCommit.SetBackground, value);
		},

		setCurrency({ commit }, value) {
			commit(StoreCommit.SetCurrency, value);
		},

		setTimeFormat({ commit }, value) {
			commit(StoreCommit.SetTimeFormat, value);
		},

		setHideWalletButtonText({ commit }, value) {
			commit(StoreCommit.SetHideWalletButtonText, value);
		},

		setIsMarketChartEnabled({ commit }, value) {
			commit(StoreCommit.SetIsMarketChartEnabled, value);
		},

		setIsAdvancedModeEnabled({ commit }, value) {
			commit(StoreCommit.SetIsAdvancedModeEnabled, value);
		},

		setMarketChartOptions({ commit }, value) {
			commit(StoreCommit.SetMarketChartOptions, value);
		},

		setLanguage({ commit }, value) {
			commit(StoreCommit.SetLanguage, value);
		},

		setBip39Language({ commit }, value) {
			commit(StoreCommit.SetBip39Language, value);
		},

		setName({ commit }, value) {
			commit(StoreCommit.SetName, value);
		},

		setScreenshotProtection({ commit }, value) {
			commit(StoreCommit.SetScreenshotProtection, value);
		},

		setBackgroundUpdateLedger({ commit }, value) {
			commit(StoreCommit.SetBackgroundUpdateLedger, value);
		},

		setBroadcastPeers({ commit }, value) {
			commit(StoreCommit.SetBroadcastPeers, value);
		},

		setLedgerCache({ commit }, value) {
			commit(StoreCommit.SetLedgerCache, value);
		},

		async setProfileId({ commit, dispatch }, value) {
			commit(StoreCommit.SetProfileId, value);
			await dispatch("load", value);
		},

		setTheme({ commit }, value) {
			commit(StoreCommit.SetTheme, value);
		},

		setPluginManagerLayout({ commit }, value) {
			commit(StoreCommit.SetPluginManagerLayout, value);
		},

		setWalletLayout({ commit }, value) {
			commit(StoreCommit.SetWalletLayout, value);
		},

		setWalletSidebarSortParams({ commit }, value) {
			commit(StoreCommit.SetWalletSidebarSortParams, value);
		},

		setWalletSidebarFilters({ commit }, value) {
			commit(StoreCommit.SetWalletSidebarFilters, value);
		},

		setWalletSortParams({ commit }, value) {
			commit(StoreCommit.SetWalletTableSortParams, value);
		},

		setContactSortParams({ commit }, value) {
			commit(StoreCommit.SetContactTableSortParams, value);
		},

		setPluginSortParams({ commit }, value) {
			commit(StoreCommit.SetPluginTableSortParams, value);
		},

		setTransactionTableRowCount({ commit }, value) {
			commit(StoreCommit.SetTransactionTableRowCount, value);
		},

		setUnconfirmedVotes({ commit }, value) {
			commit(StoreCommit.SetUnconfirmedVotes, value);
		},

		setLastFeeByType({ commit }, { fee, type, typeGroup }) {
			commit(StoreCommit.SetLastFeesByType, { fee, type, typeGroup });
		},

		setMultiSignaturePeer({ commit }, { host, port }) {
			commit(StoreCommit.SetMultiSignaturePeer, { host, port });
		},

		setFilterBlacklistedPlugins({ commit }, value) {
			commit(StoreCommit.SetFilterBlacklistedPlugins, value);
		},

		setPluginAdapter({ commit }, value) {
			commit(StoreCommit.SetPluginAdapter, value);
		},

		setPriceApi({ commit }, value) {
			commit(StoreCommit.SetPriceApi, value);
		},

		setPluginMenuOpen({ commit }, value) {
			commit(StoreCommit.SetPluginMenuOpen, value);
		},

		setDefaultChosenFee({ commit }, value) {
			commit(StoreCommit.SetDefaultChosenFee, value);
		},
	},
};
