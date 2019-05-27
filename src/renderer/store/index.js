import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import localforage from 'localforage'
import { isNull, pullAll, keys } from 'lodash'

import packageJson from '@package.json'

import vuexPersistReady from '@/store/plugins/vuex-persist-ready'
import VuexPersistMigrations from '@/store/plugins/vuex-persist-migrations'
import AnnouncementsModule from '@/store/modules/announcements'
import AppModule from '@/store/modules/app'
import DelegateModule from '@/store/modules/delegate'
import LedgerModule from '@/store/modules/ledger'
import MarketModule from '@/store/modules/market'
import NetworkModule from '@/store/modules/network'
import PeerModule from '@/store/modules/peer'
import PluginModule from '@/store/modules/plugin'
import ProfileModule from '@/store/modules/profile'
import SessionModule from '@/store/modules/session'
import TransactionModule from '@/store/modules/transaction'
import WalletModule from '@/store/modules/wallet'

Vue.use(Vuex)

const modules = {
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
  wallet: WalletModule
}

// Modules that should not be persisted
const ignoreModules = []

const vuexMigrations = new VuexPersistMigrations({
  untilVersion: packageJson.version,
  fromVersion (store) {
    const version = store.getters['app/latestAppliedMigration']
    return isNull(version) ? '0.0.0' : version
  }
})

const vuexPersist = new VuexPersistence({
  // It is necessary to enable the strict mode to watch to mutations, such as `RESTORE_MUTATION`
  strictMode: true,
  asyncStorage: true,
  key: 'ark-desktop',
  storage: localforage,
  modules: pullAll(keys(modules), ignoreModules)
})

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  mutations: {
    RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
  },
  actions: {
    resetData () {
      return localforage.clear()
    }
  },
  plugins: [
    vuexMigrations.plugin,
    vuexPersist.plugin,
    vuexPersistReady
  ]
})
