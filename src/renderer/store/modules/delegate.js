import DelegateModel from '@/models/delegate'
import Vue from 'vue'

export default {
  namespaced: true,

  state: {
    delegates: {}
  },

  getters: {
    all: (state, _, __, rootGetters) => {
      const network = rootGetters['session/network']
      if (!network || !state.delegates[network.id]) {
        return false
      }

      return state.delegates
    },

    byAddress: (state, _, __, rootGetters) => address => {
      const network = rootGetters['session/network']

      if (!address || !network || !state.delegates[network.id]) {
        return false
      }

      return state.delegates[network.id][address] || false
    },

    byPublicKey: (state, _, __, rootGetters) => publicKey => {
      const network = rootGetters['session/network']

      if (!publicKey || !network || !state.delegates[network.id]) {
        return false
      }

      return Object.values(state.delegates[network.id]).find(delegate => {
        return delegate.publicKey === publicKey
      }) || false
    }
  },

  mutations: {
    SET_DELEGATES (state, { delegates, networkId }) {
      const result = delegates.reduce((acc, delegate) => {
        acc[delegate.address] = delegate

        return acc
      }, {})

      Vue.set(state.delegates, networkId, result)
    },
    ADD_DELEGATE (state, { delegate, networkId }) {
      Vue.set(state.delegates, networkId, { [delegate.address]: delegate })
    }
  },

  actions: {
    async load ({ dispatch, rootGetters }) {
      const network = rootGetters['session/network']
      const delegates = []
      const limit = this._vm.$client.version === 1 ? (network.constants.activeDelegates || 51) : 100
      let page = 1
      let totalCount = null
      while (!totalCount || delegates.length < totalCount) {
        const delegateResponse = await this._vm.$client.fetchDelegates({
          page,
          limit
        })
        delegateResponse.delegates = delegateResponse.delegates.map((delegate) => {
          let delegateMapping = {
            username: delegate.username,
            address: delegate.address,
            publicKey: delegate.publicKey
          }

          if (this._vm.$client.version === 2) {
            delegateMapping = {
              ...delegateMapping,
              voteWeight: delegate.votes,
              producedBlocks: delegate.blocks.produced,
              missedBlocks: delegate.blocks.missed,
              rank: delegate.rank,
              approval: delegate.production.approval,
              productivity: delegate.production.productivity
            }
          } else {
            delegateMapping = {
              ...delegateMapping,
              voteWeight: delegate.vote,
              producedBlocks: delegate.producedblocks,
              missedBlocks: delegate.missedblocks,
              rank: delegate.rate,
              approval: delegate.approval,
              productivity: delegate.productivity
            }
          }

          return delegateMapping
        })
        delegates.push(...delegateResponse.delegates)
        totalCount = delegateResponse.totalCount
        page++
      }

      dispatch('set', delegates)
    },

    set ({ commit, rootGetters }, delegates) {
      const network = rootGetters['session/network']
      commit('SET_DELEGATES', {
        delegates: delegates.map(delegate => DelegateModel.deserialize(delegate)),
        networkId: network.id
      })
    },

    add ({ commit, rootGetters }, delegate) {
      const network = rootGetters['session/network']
      commit('ADD_DELEGATE', {
        delegate: DelegateModel.deserialize(delegate),
        networkId: network.id
      })
    }
  }
}
