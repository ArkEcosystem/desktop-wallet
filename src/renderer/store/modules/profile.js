import { map, uniqBy } from 'lodash'
import crypto from 'crypto'
import BaseModule from '../base'
import ProfileModel from '@/models/profile'
import * as base58 from 'bs58check'
import BigNumber from '@/plugins/bignumber'

export default new BaseModule(ProfileModel, {
  getters: {
    byCompatibleAddress: (state, _, __, rootGetters) => address => {
      const publicKeyHash = base58.decode(address)[0]
      const profiles = []
      for (const profile of state.all) {
        const network = rootGetters['network/byId'](profile.networkId)
        if (network.version === publicKeyHash) {
          profiles.push(profile)
        }
      }

      return profiles
    },

    doesExist: state => checkName => {
      const normalize = (name) => name.toLowerCase().replace(/^\s+|\s+$/g, '')
      checkName = normalize(checkName)

      return state.all.find(profile => normalize(profile.name) === checkName)
    },
    balance: (state, _, __, rootGetters) => id => {
      const wallets = rootGetters['wallet/byProfileId'](id)
      return wallets.reduce((total, wallet) => {
        return new BigNumber(wallet.balance).plus(total)
      }, 0)
    },
    balanceWithLedger: (state, _, __, rootGetters) => id => {
      let wallets = rootGetters['wallet/byProfileId'](id)

      // Only include the wallets of the Ledger that are on the same network than the profile
      const profile = rootGetters['profile/byId'](id)
      if (profile.networkId === rootGetters['session/network'].id) {
        wallets = [
          ...wallets,
          ...rootGetters['ledger/wallets']
        ]
      }

      return uniqBy(wallets, 'address').reduce((total, wallet) => {
        return new BigNumber(wallet.balance).plus(total)
      }, 0)
    },

    public: (state, _, __, rootGetters) => (all = false) => {
      const minimiseProfile = (profile) => ({
        avatar: profile.avatar,
        currency: profile.currency,
        language: profile.language,
        name: profile.name,
        network: rootGetters['network/byId'](profile.networkId),
        wallets: rootGetters['wallet/publicByProfileId'](profile.id),
        contacts: rootGetters['wallet/publicByProfileId'](profile.id, true)
      })

      if (!all) {
        return minimiseProfile(rootGetters['session/profile'])
      }

      return state.all.map(profile => minimiseProfile(profile))
    }
  },

  actions: {
    /**
     * This default action is overridden to generate a random unique ID
     */
    create ({ commit }, model) {
      model.id = crypto.randomBytes(12).toString('base64')

      const data = ProfileModel.deserialize(model)

      commit('CREATE', data)
      return data
    },
    /**
     * This default action is overridden to remove the wallets of this profile first
     */
    async delete ({ commit, dispatch, rootGetters }, { id }) {
      // This getter returns a reference that is modified on each deletion
      const transactionIds = map(rootGetters['transaction/byProfileId'](id), 'id')
      for (const transactionId of transactionIds) {
        await dispatch('transaction/delete', { id: transactionId, profileId: id }, { root: true })
      }

      // This getter returns a reference that is modified on each deletion
      const walletIds = map(rootGetters['wallet/byProfileId'](id), 'id')
      for (const walletId of walletIds) {
        await dispatch('wallet/delete', { id: walletId, profileId: id }, { root: true })
      }

      commit('DELETE', id)
    }
  }
})
