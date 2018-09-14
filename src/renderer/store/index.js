import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import localforage from 'localforage'
import { pullAll, keys } from 'lodash'

import AnnouncementsModule from '@/store/modules/announcements'
import AppModule from '@/store/modules/app'
import MarketModule from '@/store/modules/market'
import NetworkModule from '@/store/modules/network'
import ProfileModule from '@/store/modules/profile'
import SessionModule from '@/store/modules/session'
import TimerModule from '@/store/modules/timer'

Vue.use(Vuex)

const modules = {
  announcements: AnnouncementsModule,
  app: AppModule,
  market: MarketModule,
  network: NetworkModule,
  profile: ProfileModule,
  session: SessionModule,
  timer: TimerModule
}

const ignoreModules = [
  'timer'
]

const vuexPersist = new VuexPersistence({
  strictMode: process.env.NODE_ENV !== 'production',
  asyncStorage: true,
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
    vuexPersist.plugin
  ]
})
