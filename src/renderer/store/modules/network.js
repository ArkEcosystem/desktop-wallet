import { Managers } from "@arkecosystem/crypto";
import { NETWORKS } from "@config";
import { cloneDeep } from "lodash";
import Vue from "vue";

import { AppEvent, StoreBinding, StoreCommit } from "@/enums";
import NetworkModel from "@/models/network";
import eventBus from "@/plugins/event-bus";
import Client from "@/services/client";
import { isEmpty } from "@/utils";
import { reqwest } from "@/utils/http";

import BaseModule from "../base";

export default new BaseModule(NetworkModel, {
	state: () => ({
		all: [],
		customNetworks: {},
	}),

	getters: {
		bySymbol: (state) => (symbol) => {
			return state.all.find((network) => network.symbol === symbol);
		},
		byToken: (state) => (token) => {
			return state.all.find((network) => network.token === token);
		},
		byName: (state) => (name) => {
			return state.all.find((network) => network.name === name);
		},
		customNetworkById: (state) => (id) => {
			return state.customNetworks[id];
		},
		customNetworks: (state) => state.customNetworks,
	},

	mutations: {
		SET_ALL(state, value) {
			state.all = value;
		},
		ADD_CUSTOM_NETWORK(state, value) {
			Vue.set(state.customNetworks, value.id, value);
		},
		UPDATE_CUSTOM_NETWORK(state, value) {
			if (state.customNetworks[value.id]) {
				Vue.set(state.customNetworks, value.id, value);
			}
		},
		REMOVE_CUSTOM_NETWORK(state, value) {
			Vue.delete(state.customNetworks, value);
		},
	},

	actions: {
		load({ commit, getters, rootGetters }) {
			const all = cloneDeep(getters.all);
			if (!isEmpty(all)) {
				// TODO: remove in future major version
				// This is a "hack" to make sure all custom networks are in state.all
				let missingCustom = false;
				for (const custom of Object.values(getters.customNetworks)) {
					if (!all.find((network) => network.name === custom.name)) {
						all.push(custom);
						missingCustom = true;
					}
				}
				if (missingCustom) {
					commit(StoreCommit.SetAll, all);
				}
			} else {
				commit(StoreCommit.SetAll, NETWORKS);
			}

			const sessionNetwork = rootGetters["session/network"];
			if (sessionNetwork && sessionNetwork.crypto && sessionNetwork.constants) {
				Managers.configManager.setConfig(cloneDeep(sessionNetwork.crypto));
				Managers.configManager.setHeight(sessionNetwork.constants.height);
			}
		},

		/*
		 * Update data of the network
		 */
		async updateData({ commit, rootGetters }, network = null) {
			if (!network) {
				network = cloneDeep(rootGetters["session/network"]);
			}

			try {
				const crypto = await Client.fetchNetworkCrypto(network.server);
				const { constants } = await Client.fetchNetworkConfig(network.server);

				// TODO: remove in future major version
				// this is a "hack" to make sure the known wallets url is set on the default networks
				if (!network.knownWalletsUrl) {
					const defaultNetwork = NETWORKS.find((defaultNetwork) => defaultNetwork.id === network.id);

					if (defaultNetwork) {
						network.knownWalletsUrl = defaultNetwork.knownWalletsUrl;
					}
				}

				if (network.knownWalletsUrl) {
					try {
						const knownWallets = await reqwest(network.knownWalletsUrl, {
							json: true,
						});
						network.knownWallets = knownWallets.body;
					} catch (error) {
						this._vm.$logger.error("Could not retrieve known wallets: ", error);
					}
				}

				commit(StoreCommit.Update, {
					...network,
					constants,
				});

				Managers.configManager.setConfig(cloneDeep(crypto));
				Managers.configManager.setHeight(constants.height);
			} catch (error) {
				this._vm.$logger.error("Could not update network data: ", error);
			}
		},

		/*
		 * Update the fee statistics of the current network
		 */
		async fetchFees({ commit, rootGetters }, network = null) {
			if (!network) {
				network = rootGetters["session/network"];
			}

			try {
				const feeStatistics = await Client.fetchFeeStatistics(network.server);
				commit(StoreCommit.Update, {
					...network,
					feeStatistics: { ...feeStatistics },
				});
			} catch (error) {
				// Fees couldn't be updated
			}
		},

		async addCustomNetwork({ dispatch, commit }, network) {
			commit(StoreCommit.AddCustomNetwork, network);
			dispatch("create", network);

			await dispatch("fetchFees", network);
		},

		async updateCustomNetwork({ dispatch, commit, rootGetters }, network) {
			commit(StoreCommit.UpdateCustomNetwork, network);
			dispatch("update", network);

			// Trigger a profile change/reload if updating current network
			const currentNetwork = rootGetters["session/network"];
			if (currentNetwork.id === network.id) {
				await dispatch(StoreBinding.SessionSetProfileId, rootGetters["session/profileId"], { root: true });
				eventBus.$emit(AppEvent.ClientChanged);
			}

			await dispatch("fetchFees", network);
		},

		removeCustomNetwork({ dispatch, commit }, id) {
			commit(StoreCommit.RemoveCustomNetwork, id);
			dispatch("delete", { id });
		},
	},
});
