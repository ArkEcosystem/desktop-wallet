import Vue from 'vue'
import Vuex from 'vuex'

import NetworkModule from '@/store/modules/network'
import AnnouncementsModule from '@/store/modules/announcements'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    announcements: AnnouncementsModule,
    network: NetworkModule
  },
  strict: process.env.NODE_ENV !== 'production'
})
