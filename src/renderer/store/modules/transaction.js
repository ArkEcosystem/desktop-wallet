import { findIndex, unionBy } from 'lodash'
import eventBus from '@/plugins/event-bus'
import TransactionModel from '@/models/transaction'
import Vue from 'vue'

const includes = (objects, find) => objects.map(a => a.id).includes(find.id)

/**
 * This module stores unconfirmed transactions, so it does not persist currently:
 * it is not required and avoids managing their lifecycle when they are confirmed.
 *
 * Internally the transactions are stored aggregated by `profileId``
 */
export default {
  namespaced: true,

  state: {
    transactions: {}
  },

  getters: {
    byAddress: (state, _, __, rootGetters) => address => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.transactions[profileId]) {
        return []
      }

      return state.transactions[profileId].filter(transaction => {
        return transaction.recipient === address || transaction.sender === address
      })
    },

    byProfileId: (state, _, __, rootGetters) => profileId => {
      if (!state.transactions[profileId]) {
        return []
      }

      return state.transactions[profileId]
    }
  },

  mutations: {
    CREATE (state, transaction) {
      if (!state.transactions[transaction.profileId]) {
        Vue.set(state.transactions, transaction.profileId, [])
      }

      if (includes(state.transactions[transaction.profileId], transaction)) {
        throw new Error(`Cannot create transaction '${transaction.id}' - it already exists`)
      }

      state.transactions[transaction.profileId].push(transaction)
    },
    STORE (state, transaction) {
      if (!state.transactions[transaction.profileId]) {
        Vue.set(state.transactions, transaction.profileId, [])
      }
      state.transactions[transaction.profileId] = unionBy([transaction, ...state.transactions[transaction.profileId]], 'id')
    },
    UPDATE (state, transaction) {
      if (!includes(state.transactions[transaction.profileId], transaction)) {
        throw new Error(`Cannot update transaction '${transaction.id}' - it does not exist on the state`)
      }
      state.transactions[transaction.profileId] = unionBy([transaction, ...state.transactions[transaction.profileId]], 'id')
    },
    DELETE (state, transaction) {
      const index = findIndex(state.transactions[transaction.profileId], { id: transaction.id })
      if (index === -1) {
        throw new Error(`Cannot delete transaction '${transaction.id}' - it does not exist on the state`)
      }
      state.transactions[transaction.profileId].splice(index, 1)
    }
  },

  actions: {
    create ({ commit }, transaction) {
      const data = TransactionModel.deserialize(transaction)
      commit('CREATE', data)

      eventBus.emit(`wallet:${transaction.sender}:transaction:new`)

      return data
    },
    store ({ commit }, transactions) {
      commit('STORE', transactions)
    },
    update ({ commit }, transaction) {
      const data = TransactionModel.deserialize(transaction)
      commit('UPDATE', data)

      return data
    },
    delete ({ commit }, transaction) {
      commit('DELETE', transaction)
    }
  }
}
