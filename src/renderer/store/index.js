import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'
import { merge, pullAll } from 'lodash'

import packageJson from '@package.json'

import { VuexPersistence } from '@/store/plugins/vuex-persist'
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
import UpdaterModule from '@/store/modules/updater'
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
  updater: UpdaterModule,
  wallet: WalletModule
}

const vuexMigrations = new VuexPersistMigrations({
  untilVersion: packageJson.version,
  fromVersion (store) {
    const version = store.getters['app/latestAppliedMigration']
    return version === null ? '0.0.0' : version
  }
})

const modulesWithoutPersistence = pullAll(Object.keys(modules), ['delegate', 'market', 'updater'])

const vuexPersist = new VuexPersistence({
  key: 'ark-desktop',
  storage: localforage,
  reducer: state => {
    const networks = Object.values(state.network.all).concat(
      Object.values(state.network.customNetworks)
    )

    for (const network of networks) {
      delete network.crypto
    }

    return modulesWithoutPersistence.reduce(
      (a, i) => merge(a, { [i]: state[i] }),
      {}
    )
  }
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
