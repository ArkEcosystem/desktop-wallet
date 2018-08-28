import Vue from 'vue'
import Vuex from 'vuex'

import AnnouncementsModule from '@/store/modules/announcements'
import MarketDataModule from '@/store/modules/market-data'
import NetworkModule from '@/store/modules/network'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    announcements: AnnouncementsModule,
    marketData: MarketDataModule,
    network: NetworkModule
  },
  strict: process.env.NODE_ENV !== 'production'
})
