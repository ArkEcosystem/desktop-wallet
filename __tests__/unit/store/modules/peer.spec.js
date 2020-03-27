import nock from 'nock'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient from '@/plugins/api-client'
import store from '@/store'
import { goodPeer1, goodPeer2, goodPeer4, goodPeer5 } from '../../__fixtures__/store/peer'
import { network1, network2 } from '../../__fixtures__/store/network'
import { profile1 } from '../../__fixtures__/store/profile'

Vue.use(Vuex)
Vue.use(apiClient)

beforeAll(() => {
  network1.nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
  store.commit('network/SET_ALL', [network1])
  store.commit('profile/CREATE', profile1)
  store.commit('session/SET_PROFILE_ID', profile1.id)

  store.commit('peer/SET_PEERS', {
    peers: [goodPeer1, goodPeer2],
    networkId: network1.id
  })

  store.commit('peer/SET_PEERS', {
    peers: [goodPeer4, goodPeer5],
    networkId: network2.id
  })

  store.commit('peer/SET_CURRENT_PEER', {
    peer: goodPeer1,
    networkId: network1.id
  })
})

beforeEach(() => {
  nock.cleanAll()
})

describe('peer store module', () => {
  describe('getters', () => {
    beforeEach(() => {

    })

    describe('all', () => {
      it('should be able to get all the peers from the current network', () => {
        // profile1 is from network1. Check fixtures
        const peers = [goodPeer1, goodPeer2]
        expect(store.getters['peer/all']()).toIncludeAllMembers(peers)
      })

      it('should be able to get all peers from a specific network', () => {
        const networkId = network2.id
        const peers = [goodPeer4, goodPeer5]
        expect(store.getters['peer/all']({ networkId })).toIncludeAllMembers(peers)
      })

      it('should be able to ignore current peer', () => {
        const currentPeer = goodPeer1
        expect(store.getters['peer/all']({ ignoreCurrent: true })).not.toIncludeAnyMembers([currentPeer])
      })
    })

    describe('ip', () => {
      it('should be able to get peer by its ip address', () => {
        const ip = '2.2.2.2'
        const peer = goodPeer2
        expect(store.getters['peer/get']({ ip })).toEqual(peer)
      })
    })

    describe('best', () => {
      it('should be able to get the best peer from current network', () => {
        const possibleBest = [goodPeer1, goodPeer2]
        expect(store.getters['peer/best']()).toBeOneOf(possibleBest)
      })
      it('should be able to get the best peer ignoring the current peer', () => {
        const possibleBest = [goodPeer2]
        expect(store.getters['peer/best']({ ignoreCurrent: true })).toBeOneOf(possibleBest)
      })
      it('should be able to get the best peer from a network', () => {
        const possibleBest = [goodPeer4, goodPeer5]
        const networkId = network2.id
        expect(store.getters['peer/best']({ networkId })).toBeOneOf(possibleBest)
      })
    })
  })
})
