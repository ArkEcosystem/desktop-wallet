import Vue from 'vue';
import Vuex from 'vuex';
import localforage from 'localforage';
import { merge, pullAll } from 'lodash';
import packageJson from '@package.json';
import { VuexPersistence } from '@/store/plugins/vuex-persist';
import vuexPersistReady from '@/store/plugins/vuex-persist-ready';
import VuexPersistMigrations from '@/store/plugins/vuex-persist-migrations';
import AnnouncementsModule from '@/store/modules/announcements';
import AppModule from '@/store/modules/app';
import DelegateModule from '@/store/modules/delegate';
import LedgerModule from '@/store/modules/ledger';
import MarketModule from '@/store/modules/market';
import NetworkModule from '@/store/modules/network';
import PeerModule from '@/store/modules/peer';
import PluginModule from '@/store/modules/plugin';
import ProfileModule from '@/store/modules/profile';
import SessionModule from '@/store/modules/session';
import TransactionModule from '@/store/modules/transaction';
import UpdaterModule from '@/store/modules/updater';
import WalletModule from '@/store/modules/wallet';
Vue.use(Vuex);
var modules = {
    announcements: AnnouncementsModule,
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
    wallet: WalletModule
};
var vuexMigrations = new VuexPersistMigrations({
    untilVersion: packageJson.version,
    fromVersion: function (store) {
        var version = store.getters['app/latestAppliedMigration'];
        return version === null ? '0.0.0' : version;
    }
});
var modulesWithoutPersistence = pullAll(Object.keys(modules), ['delegate', 'market', 'updater']);
var vuexPersist = new VuexPersistence({
    key: 'ark-desktop',
    storage: localforage,
    reducer: function (state) {
        var networks = Object.values(state.network.all).concat(Object.values(state.network.customNetworks));
        for (var _i = 0, networks_1 = networks; _i < networks_1.length; _i++) {
            var network = networks_1[_i];
            delete network.crypto;
        }
        return modulesWithoutPersistence.reduce(function (a, i) {
            var _a;
            return merge(a, (_a = {}, _a[i] = state[i], _a));
        }, {});
    }
});
export default new Vuex.Store({
    modules: modules,
    strict: process.env.NODE_ENV !== 'production',
    mutations: {
        RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
    },
    actions: {
        resetData: function () {
            return localforage.clear();
        }
    },
    plugins: [
        vuexMigrations.plugin,
        vuexPersist.plugin,
        vuexPersistReady
    ]
});
//# sourceMappingURL=index.js.map