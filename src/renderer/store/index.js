import Vue from 'vue'
import Vuex from 'vuex'

import apiClient from '@/plugins/api-client'

import AnnouncementsModule from '@/store/modules/announcements'
import MarketDataModule from '@/store/modules/market-data'
import NetworkModule from '@/store/modules/network'
import ProfilesModule from '@/store/modules/profiles'
import SessionModule from '@/store/modules/session'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    announcements: AnnouncementsModule,
    marketData: MarketDataModule,
    network: NetworkModule,
    profiles: ProfilesModule,
    session: SessionModule
  },
  plugins: [apiClient],
  strict: process.env.NODE_ENV !== 'production'
})
