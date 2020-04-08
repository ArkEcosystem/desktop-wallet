import Vue from 'vue'
import Vuex from 'vuex'
import apiClient from '@/plugins/api-client'
import config from '@config'
import { random } from 'lodash'
import store from '@/store'
import { generateValidPeer } from '../../__fixtures__/store/peer'
import { network1, network2 } from '../../__fixtures__/store/network'
import { profile1 } from '../../__fixtures__/store/profile'

Vue.use(Vuex)
Vue.use(apiClient)

network1.nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'

/*
  The IDs over this array are used to select networks.
  networkList[0] is current network.
*/
const networkList = [
  network1,
  network2
]

const peerList = [
  [generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer()],
  [generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer()]
]

const seedPeerList = [
  [generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer()],
  [generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer(), generateValidPeer()]
]

function currentNetwork () {
  const session = store.state.session
  const profile = store.state.profile.all.find(profile => profile.id === session.profileId)
  const network = store.state.network.all.find(network => network.id === profile.networkId)
  return network
}

function currentNetworkPeers () {
  const network = currentNetwork()
  const peers = store.state.peer.available[network.id].peers
  return peers
}

function currentPeer () {
  const network = currentNetwork()
  const peer = store.state.peer.current[network.id]
  return peer
}

function randomPeerFromCurrentNetwork () {
  const peers = currentNetworkPeers()
  const peer = peers[random(0, peers.length - 1)]
  return peer
}

beforeAll(() => {
  /*
    This is not ideal. The correct way is to set the state manually or switch
    the getters, actions e mutations to use a manually created state. This breaks
    the unit principle.
  */
  store.commit('network/SET_ALL', networkList)
  store.commit('profile/CREATE', profile1)
  store.commit('session/SET_PROFILE_ID', profile1.id)
})

describe('peer store module', () => {
  describe('getters', () => {
    beforeAll(() => {
      store.commit('peer/available/SET_PEERS', {
        peers: peerList[0],
        networkId: networkList[0].id
      })

      store.commit('peer/available/SET_PEERS', {
        peers: peerList[1],
        networkId: networkList[1].id
      })

      store.commit('peer/current/SET_CURRENT_PEER', {
        peer: peerList[0][0],
        networkId: networkList[0].id
      })
    })

    describe('available/all', () => {
      it('should be able to get all the peers from the current network', () => {
        const peers = currentNetworkPeers()
        expect(store.getters['peer/available/all']()).toIncludeAllMembers(peers)
      })

      it('should be able to get all peers from a specific network', () => {
        const id = 1
        const networkId = networkList[id].id
        const peers = peerList[id]
        expect(store.getters['peer/available/all']({ networkId })).toIncludeAllMembers(peers)
      })

      it('should be able to ignore current peer', () => {
        expect(store.getters['peer/available/all']({ ignoreCurrent: true })).not.toIncludeAnyMembers([currentPeer()])
      })
    })

    describe('available/ip', () => {
      it('should be able to get peer by its ip address', () => {
        const peer = randomPeerFromCurrentNetwork()
        const ip = peer.ip
        expect(store.getters['peer/available/get']({ ip })).toEqual(peer)
      })
    })

    describe('available/best', () => {
      it('should be able to get the best peer from current network', () => {
        const possibleBest = currentNetworkPeers()
        expect(store.getters['peer/available/best']()).toIncludeAnyMembers(possibleBest)
      })
      it('should be able to get the best peer ignoring the current peer', () => {
        const impossibleBest = currentPeer()
        const possibleBest = currentNetworkPeers()
        const getter = store.getters['peer/available/best']({ ignoreCurrent: true })
        expect(getter).not.toInclude(impossibleBest)
        expect(getter).toIncludeAnyMembers(possibleBest)
      })
      it('should be able to get the best peer from a network', () => {
        const id = 1
        const possibleBest = peerList[id]
        const networkId = networkList[id].id
        expect(store.getters['peer/available/best']({ networkId })).toIncludeAnyMembers(possibleBest)
      })
      it('should be able to get at least 2 best peers from a network', () => {
        const id = 1
        const mandatoryBest = peerList[id]
        const min = mandatoryBest.length
        const networkId = networkList[id].id
        expect(store.getters['peer/available/best']({ networkId, min })).toIncludeSameMembers(mandatoryBest)
      })
      it('should be able to get at most 1 best peers from a network', () => {
        const id = 0
        const possibleBest = peerList[id]
        const networkId = networkList[id].id
        const getter = store.getters['peer/available/best']({ networkId, max: 1 })
        expect(getter).toIncludeAnyMembers(possibleBest)
        expect(getter.length).toBe(1)
      })
    })

    describe('available/random', () => {
      it('should be able to get 5 random peers from current network', () => {
        const possiblePeers = currentNetworkPeers()
        const amount = Math.min(5, possiblePeers.length)
        const getter = store.getters['peer/available/random']()
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter.length).toBe(amount)
      })

      it('should be able to get 10 random peers from current network', () => {
        const possiblePeers = currentNetworkPeers()
        const amount = Math.min(10, possiblePeers.length) - 1 // -1 to exclude current peer.
        const getter = store.getters['peer/available/random']({ amount })
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter.length).toBe(amount)
      })

      it('should be able to get 10 random peers from current network, including the current', () => {
        const possiblePeers = currentNetworkPeers()
        const amount = Math.min(10, possiblePeers.length)
        const getter = store.getters['peer/available/random']({ amount, ignoreCurrent: false })
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter.length).toBe(amount)
      })

      it('should be able to get 1 random peer from current network', () => {
        const possiblePeers = currentNetworkPeers()
        const amount = Math.min(1, possiblePeers.length)
        const getter = store.getters['peer/available/random']({ amount })
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter.length).toBe(amount)
      })

      it('should be able to get 5 random peer from an specific network', () => {
        const id = 1
        const possiblePeers = peerList[id]
        const networkId = networkList[id].id
        const amount = Math.min(5, possiblePeers.length)
        const getter = store.getters['peer/available/random']({ networkId })
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter.length).toBe(amount)
      })

      it('should be able to get 5 random peer from current network, but ignoring current', () => {
        const possiblePeers = currentNetworkPeers()
        const impossiblePeer = currentPeer()
        const amount = Math.min(5, possiblePeers.length)
        const getter = store.getters['peer/available/random']({ ignoreCurrent: true })
        expect(getter).toIncludeAnyMembers(possiblePeers)
        expect(getter).not.toInclude(impossiblePeer)
        expect(getter.length).toBe(amount)
      })
    })

    describe('seed', () => {
      beforeAll(() => {
        // ID 0 is aways current network
        config.PEERS[networkList[0].id] = seedPeerList[0]
        config.PEERS[networkList[1].id] = seedPeerList[1]
      })

      describe('seed/all', () => {
        it('should be able to get all seed peers from current network', () => {
          const id = 0
          const possibleSeedPeers = seedPeerList[id]
          const getter = store.getters['peer/seed/all']()
          expect(getter).toIncludeSameMembers(possibleSeedPeers)
        })

        it('should be able to get all seed peers from a specific network', () => {
          const id = 1
          const possibleSeedPeers = seedPeerList[id]
          const networkId = networkList[id].id
          const getter = store.getters['peer/seed/all']({ networkId })
          expect(getter).toIncludeSameMembers(possibleSeedPeers)
        })
      })

      describe('seed/random', () => {
        it('should be able to get 5 random seed peers from current network', () => {
          const id = 0
          const possibleSeedPeers = seedPeerList[id]
          const getter = store.getters['peer/seed/random']()
          expect(possibleSeedPeers).toIncludeAllMembers(getter)
        })
        it('should be able to get a random seed peers from current network', () => {
          const id = 0
          const possibleSeedPeers = seedPeerList[id]
          const getter = store.getters['peer/seed/random']({ amount: 1 })[0]
          expect(possibleSeedPeers).toInclude(getter)
        })
        it('should be able to get seed peers from a specific network', () => {
          const id = 1
          const possibleSeedPeers = seedPeerList[id]
          const networkId = networkList[id].id
          const getter = store.getters['peer/seed/random']({ networkId })
          expect(possibleSeedPeers).toIncludeAnyMembers(getter)
        })
      })
    })

    describe('broadcast', () => {
      it('should be able to get the broadcast peers from current network', () => {
        const id = 0
        const possibleTop = peerList[id]
        const possibleRandom = peerList[id]
        const possibleSeed = seedPeerList[id]
        const getter = store.getters['peer/available/broadcast']()
        expect(getter).toIncludeAnyMembers([...possibleTop, ...possibleRandom, ...possibleSeed])
      })
      test.todo('should be able to get the broadcast peers from an specific network')
    })

    describe('current', () => {
      it('should be able to get the current peer from the current network', () => {
        const peer = currentPeer()
        const getter = store.getters['peer/current/get']()
        expect(getter).toBe(peer)
      })
    })

    describe('discovery', () => {
      describe('default networks (ark.mainnet & ark.devnet)', () => {
        test.todo('should be able to get the peer discovery instance for the current network')
        test.todo('should be able to get the peer discovery instance for a specific network')
      })
      describe('custom networks', () => {
        test.todo('should be able to get the peer discovery instance for a custom network')
      })
    })
  })

  describe('mutations', () => {
    describe('SET_PEERS', () => {
      test.todo('should be able to set the peers to a network.')
      test.todo('should be able to update the lastUpdate date.')
    })
    describe('CLEAR_PEERS', () => {
      test.todo('should be able to clear all the peers from a network.')
    })
    describe('SET_CURRENT_PEER', () => {
      test.todo('should be able to set the current peer for a network.')
    })
    describe('CLEAR_CURRENT_PEER', () => {
      test.todo('should be able to clear the current peer for a network.')
    })
  })

  describe('actions', () => {
    describe('peers/set', () => {
      test.todo('should be able to set available peers for the current network')
      test.todo('should be able to set available peers for a specific network.')
      test.todo('should not be able to set available peers to a falsy value')
      test.todo('should not be able to set available peers if it is not an array') // can be improved.
      test.todo('should not be able to set available peers to an empty vector')
    })
    describe('current/set', () => {
      test.todo('should be able to set the current peer for the current network')
      test.todo('should be able to set the current peer for a specific network')
      test.todo('should not be able to set a falsy value as the current peer')
      test.todo('should not be able to set an empty object as the current peer')
      test.todo('should be able to update the peer before setting it as the current peer')
      test.todo('should be able to not update the peer before setting it as the current peer')
    })

    describe('peers/clear', () => {
      test.todo('should be able to clear peers for the current network')
      test.todo('should be able to clear peers for a specific network')
    })

    describe('current/clear', () => {
      test.todo('should be able to clear peers for the current network')
      test.todo('should be able to clear peers for a specific network')
    })

    describe('refresh', () => {
      test.todo('should be able to refresh the peers available for the current network')
      test.todo('should be able to refresh the peers available for a specific network')
    })
  })
})
