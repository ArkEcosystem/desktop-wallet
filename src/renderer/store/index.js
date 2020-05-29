import Vue from "vue";
import Vuex from "vuex";
import { createPersistedState, createSharedMutations } from "vuex-electron";

import AppModule from "@/store/modules/app";
import DelegateModule from "@/store/modules/delegate";
import LedgerModule from "@/store/modules/ledger";
import MarketModule from "@/store/modules/market";
import NetworkModule from "@/store/modules/network";
import PeerModule from "@/store/modules/peer";
import PluginModule from "@/store/modules/plugin";
import ProfileModule from "@/store/modules/profile";
import SessionModule from "@/store/modules/session";
import TransactionModule from "@/store/modules/transaction";
import UpdaterModule from "@/store/modules/updater";
import WalletModule from "@/store/modules/wallet";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		app: AppModule,
		delegate: DelegateModule,
		ledger: LedgerModule,
		market: MarketModule,
		network: NetworkModule,
		peer: PeerModule,
		plugin: PluginModule,
		profile: ProfileModule,
		session: SessionModule,
		transaction: TransactionModule,
		updater: UpdaterModule,
		wallet: WalletModule,
	},
	strict: process.env.NODE_ENV !== "production",
	plugins: [createPersistedState(), createSharedMutations()],
});
