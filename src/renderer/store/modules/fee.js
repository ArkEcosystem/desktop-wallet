import { toPlainObject } from 'lodash'

import Vue from 'vue'

export default {
  namespaced: true,

  state: {
    data: {},
    meta: 0,
    lastUpdate: 0
  },

  getters: {
    all: state => state.data,
    byTransactionType: state => transactionType => toPlainObject(state.data)[transactionType],
    byGroup: state => group => state.data[group]
  },

  mutations: {
    SET_FEES: (state, { data, meta }) => () => {
      Vue.set(state.data, data)
      Vue.set(state.meta, meta)
      Vue.set(state.lastUpdate, Date.now())
    }
  },

  actions: {
    update: async () => {
      try {
        //
      } catch (err) {
        //
      }
    }
  }
}
