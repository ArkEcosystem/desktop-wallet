import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import localforage from 'localforage'
import { pullAll, keys } from 'lodash'

import vuexPersistReady from '@/store/plugins/vuex-persist-ready'
import AnnouncementsModule from '@/store/modules/announcements'
import AppModule from '@/store/modules/app'
import LedgerModule from '@/store/modules/ledger'
import MarketModule from '@/store/modules/market'
import NetworkModule from '@/store/modules/network'
import PeerModule from '@/store/modules/peer'
import ProfileModule from '@/store/modules/profile'
import SessionModule from '@/store/modules/session'
import TimerModule from '@/store/modules/timer'
import WalletModule from '@/store/modules/wallet'

Vue.use(Vuex)

const modules = {
  announcements: AnnouncementsModule,
  app: AppModule,
  ledger: LedgerModule,
  market: MarketModule,
  network: NetworkModule,
  peer: PeerModule,
  profile: ProfileModule,
  session: SessionModule,
  timer: TimerModule,
  wallet: WalletModule
}

const ignoreModules = [
  'ledger',
  'timer'
]

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
  plugins: [
    vuexPersist.plugin,
    vuexPersistReady
  ]
})
