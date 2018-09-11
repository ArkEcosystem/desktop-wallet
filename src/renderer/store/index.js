import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import localforage from 'localforage'

import apiClient from '@/plugins/api-client'

import AnnouncementsModule from '@/store/modules/announcements'
import MarketDataModule from '@/store/modules/market-data'
import NetworkModule from '@/store/modules/network'
import ProfilesModule from '@/store/modules/profiles'
import SessionModule from '@/store/modules/session'

Vue.use(Vuex)

const vuexPersist = new VuexPersistence({
  strictMode: process.env.NODE_ENV !== 'production',
  asyncStorage: true,
  storage: localforage
})

export default new Vuex.Store({
  modules: {
    announcements: AnnouncementsModule,
    marketData: MarketDataModule,
    network: NetworkModule,
    profiles: ProfilesModule,
    session: SessionModule
  },
  strict: process.env.NODE_ENV !== 'production',
  mutations: {
    RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
  },
  plugins: [vuexPersist.plugin, apiClient]
})
