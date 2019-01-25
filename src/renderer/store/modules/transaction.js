import dayjs from 'dayjs'
import { findIndex, unionBy } from 'lodash'
import config from '@config'
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
    transactions: {},
    staticFees: {}
  },

  getters: {
    byAddress: (state, _, __, rootGetters) => (address, showExpired = false) => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.transactions[profileId]) {
        return []
      }

      const transactions = state.transactions[profileId].filter(transaction => {
        return transaction.recipient === address || transaction.sender === address
      }).map(transaction => {
        transaction.isSender = transaction.sender === address
        transaction.isReceiver = transaction.recipient === address
        transaction.totalAmount = transaction.amount + transaction.fee

        return transaction
      })

      if (showExpired) {
        return transactions
      }

      return transactions.filter(transaction => !transaction.isExpired)
    },

    byProfileId: (state, _, __, rootGetters) => (profileId, showExpired = false) => {
      if (!state.transactions[profileId]) {
        return []
      }

      const addresses = rootGetters['wallet/byProfileId'](profileId).map(wallet => {
        return wallet.address
      })

      const transactions = state.transactions[profileId].map(transaction => {
        transaction.isSender = addresses.includes(transaction.sender)
        transaction.isReceiver = addresses.includes(transaction.recipient)
        transaction.totalAmount = transaction.amount + transaction.fee

        return transaction
      })

      if (showExpired) {
        return transactions
      }

      return transactions.filter(transaction => !transaction.isExpired)
    },

    /**
     * Get a static fee based on type.
     * @param  {Number} type
     * @return {(Number|null)}
     */
    staticFee: (state, _, __, rootGetters) => (type) => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.staticFees[profileId]) {
        return null
      }

      return state.staticFees[profileId][type]
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
    },
    SET_STATIC_FEES (state, data) {
      state.staticFees[data.profileId] = data.staticFees
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
    clearExpired ({ commit, getters, rootGetters }) {
      const expired = []
      const profileId = rootGetters['session/profileId']
      const threshold = dayjs().subtract(config.APP.transactionExpiryMinutes, 'minute')
      for (const transaction of getters['byProfileId'](profileId)) {
        if (dayjs(transaction.timestamp).isBefore(threshold)) {
          transaction.isExpired = true
          expired.push(transaction.id)
          commit('UPDATE', transaction)
        }
      }

      return expired
    },
    delete ({ commit }, transaction) {
      commit('DELETE', transaction)
    },
    deleteBulk ({ commit }, { transactions = [], profileId = null }) {
      for (const transaction of transactions) {
        transaction.profileId = profileId
        try {
          commit('DELETE', transaction)
        } catch (error) {
          //
        }
      }
    },

    /**
     * Update static fees from API and store against profile.
     * @return {void}
     */
    async updateStaticFees ({ commit, rootGetters }) {
      commit('SET_STATIC_FEES', {
        profileId: rootGetters['session/profileId'],
        staticFees: await this._vm.$client.fetchStaticFees()
      })
    }
  }
}
