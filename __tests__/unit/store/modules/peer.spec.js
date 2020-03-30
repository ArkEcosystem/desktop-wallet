import nock from 'nock'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient from '@/plugins/api-client'
import { random } from 'lodash'
import store from '@/store'
import { goodPeer1, goodPeer2, goodPeer4, goodPeer5, generateValidPeer } from '../../__fixtures__/store/peer'
import { network1, network2 } from '../../__fixtures__/store/network'
import { profile1 } from '../../__fixtures__/store/profile'

Vue.use(Vuex)
Vue.use(apiClient)

network1.nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'

const peerList = [
  [goodPeer1, goodPeer2, generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer()],
  [goodPeer4, goodPeer5, generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer()]
]

const networkList = [
  network1,
  network2
]

function currentNetwork () {
  const session = store.state.session
  const profile = store.state.profile.all.find(profile => profile.id === session.profileId)
  const network = store.state.network.all.find(network => network.id === profile.networkId)
  return network
}

function currentNetworkPeers () {
  const network = currentNetwork()
  const peers = store.state.peer.all[network.id].peers
  return peers
}

function currentPeer () {
  const peer = store.state.peer.current
  return peer
}

function randomPeerFromCurrentNetwork () {
  const peers = currentNetworkPeers()
  const peer = peers[random(0, peers.length - 1)]
  return peer
}

beforeAll(() => {
  store.commit('network/SET_ALL', networkList)
  store.commit('profile/CREATE', profile1)
  store.commit('session/SET_PROFILE_ID', profile1.id)

  store.commit('peer/SET_PEERS', {
    peers: peerList[0],
    networkId: networkList[0].id
  })

  store.commit('peer/SET_PEERS', {
    peers: peerList[1],
    networkId: networkList[1].id
  })

  store.commit('peer/SET_CURRENT_PEER', {
    peer: peerList[0][0],
    networkId: networkList[0]
  })
})

beforeEach(() => {
  nock.cleanAll()
})

describe('peer store module', () => {
  describe('getters', () => {
    describe('all', () => {
      it('should be able to get all the peers from the current network', () => {
        const peers = currentNetworkPeers()
        expect(store.getters['peer/all']()).toIncludeAllMembers(peers)
      })

      it('should be able to get all peers from a specific network', () => {
        const id = 1
        const networkId = networkList[id].id
        const peers = peerList[id]
        expect(store.getters['peer/all']({ networkId })).toIncludeAllMembers(peers)
      })

      it('should be able to ignore current peer', () => {
        expect(store.getters['peer/all']({ ignoreCurrent: true })).not.toIncludeAnyMembers([currentPeer()])
      })
    })

    describe('ip', () => {
      it('should be able to get peer by its ip address', () => {
        const peer = randomPeerFromCurrentNetwork()
        const ip = peer.ip
        expect(store.getters['peer/get']({ ip })).toEqual(peer)
      })
    })

    describe('best', () => {
      it('should be able to get the best peer from current network', () => {
        const possibleBest = currentNetworkPeers()
        expect(store.getters['peer/best']()).toIncludeAnyMembers(possibleBest)
      })
      it('should be able to get the best peer ignoring the current peer', () => {
        const impossibleBest = currentPeer()
        const possibleBest = currentNetworkPeers()
        const getter = store.getters['peer/best']({ ignoreCurrent: true })
        expect(getter).not.toInclude(impossibleBest)
        expect(getter).toIncludeAnyMembers(possibleBest)
      })
      it('should be able to get the best peer from a network', () => {
        const id = 1
        const possibleBest = peerList[id]
        const networkId = networkList[id].id
        expect(store.getters['peer/best']({ networkId })).toIncludeAnyMembers(possibleBest)
      })
      it('should be able to get at least 2 best peers from a network', () => {
        const id = 1
        const mandatoryBest = peerList[id]
        const min = mandatoryBest.length
        const networkId = networkList[id].id
        expect(store.getters['peer/best']({ networkId, min })).toIncludeSameMembers(mandatoryBest)
      })
      it('should be able to get at most 1 best peers from a network', () => {
        const id = 0
        const possibleBest = peerList[id]
        const networkId = networkList[id].id
        const getter = store.getters['peer/best']({ networkId, max: 1 })
        expect(getter).toIncludeAnyMembers(possibleBest)
        expect(getter.length).toBe(1)
      })
    })

    describe('random', () => {
      it('should be able to get 5 random peers from current network', () => {
        const possiblePeers = currentNetworkPeers()
        const amount = Math.min(5, possiblePeers.length)
        const getter = store.getters['peer/random']()
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter.length).toBe(amount)
      })

      it('should be able to get 10 random peers from current network', () => {
        const possiblePeers = currentNetworkPeers()
        const amount = Math.min(10, possiblePeers.length)
        const getter = store.getters['peer/random']({ amount })
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter.length).toBe(amount)
      })

      it('should be able to get 1 random peer from current network', () => {
        const possiblePeers = currentNetworkPeers()
        const amount = Math.min(1, possiblePeers.length)
        const getter = store.getters['peer/random']({ amount })
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter.length).toBe(amount)
      })

      it('should be able to get 5 random peer from an specific network', () => {
        const id = 1
        const possiblePeers = peerList[id]
        const networkId = networkList[id].id
        const amount = Math.min(5, possiblePeers.length)
        const getter = store.getters['peer/random']({ networkId })
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter.length).toBe(amount)
      })

      it('should be able to get 5 random peer from current network, but ignoring current', () => {
        const possiblePeers = currentNetworkPeers()
        const impossiblePeer = currentPeer()
        const amount = Math.min(5, possiblePeers.length)
        const getter = store.getters['peer/random']({ ignoreCurrent: true })
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter).not.toInclude(impossiblePeer)
        expect(getter.length).toBe(amount)
      })
    })

    // This needs proper mocking over @config and handling.
    describe('seed/all', () => {
      test.todo('should be able to get all seed peers')
      test.todo('should be able to get all seed peers from a specific network')
    })

    describe('seed/random', () => {
      test.todo('should be able to get seed peers')
      test.todo('should be able to get seed peers from a specific network')
    })
  })
})
