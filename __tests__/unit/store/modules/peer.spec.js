import Vue from 'vue'
import Vuex from 'vuex'
import apiClient from '@/plugins/api-client'
import nock from 'nock'
import config from '@config'
import { random } from 'lodash'
import { PeerDiscovery } from '@arkecosystem/peers'
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

function setPeerNocks (peer) {
  const baseUrl = `${peer.isHttps ? 'https://' : 'http://'}${peer.ip}:${peer.port}`

  nock(baseUrl)
    .get('/api/v2/node/syncing')
    .reply(200, {
      data: {
        height: peer.height
      }
    })

  nock(baseUrl)
    .get('/api/v2/transactions/fees')
    .reply(200, {
      data: {
        transfer: {}
      }
    })

  nock(baseUrl)
    .log(console.log)
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

afterEach(function () {
  nock.cleanAll()
  jest.clearAllMocks()
})

describe('peer', () => {
  describe('modules', () => {
    beforeEach(() => {
      networkList.forEach(network => {
        store.commit('peer/available/CLEAR_PEERS', network.id)
        store.commit('peer/current/CLEAR_CURRENT_PEER', network.id)
      })
    })
    describe('available', () => {
      describe('getters', () => {
        describe('all', () => {
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

        describe('ip', () => {
          it('should be able to get peer by its ip address', () => {
            const peer = randomPeerFromCurrentNetwork()
            const ip = peer.ip
            expect(store.getters['peer/available/get']({ ip })).toEqual(peer)
          })
        })

        describe('best', () => {
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

        describe('random', () => {
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
        describe('broadcast', () => {
          it('should be able to get the broadcast peers from current network', () => {
            const id = 0
            const possibleTop = peerList[id]
            const possibleRandom = peerList[id]
            const possibleSeed = seedPeerList[id]
            const getter = store.getters['peer/available/broadcast']()
            expect(getter).toIncludeAnyMembers([...possibleTop, ...possibleRandom, ...possibleSeed])
          })
          it('should be able to get the broadcast peers from an specific network', () => {
            const id = 1
            const possibleTop = peerList[id]
            const possibleRandom = peerList[id]
            const possibleSeed = seedPeerList[id]
            const networkId = networkList[id].id
            const getter = store.getters['peer/available/broadcast']({ networkId })
            expect(getter).toIncludeAnyMembers([...possibleTop, ...possibleRandom, ...possibleSeed])
          })
        })
      })
      describe('mutations', () => {
        describe('SET_PEERS', () => {
          test.todo('should be able to set the peers to a network and set lastUpdate')
        })
        describe('CLEAR_PEERS', () => {
          test.todo('should be able to clear all the peers from a network.')
        })
      })
      describe('actions', () => {
        describe('set', () => {
          it('should be able to set available peers for the current network', async () => {
            const networkId = currentNetwork().id
            const peers = currentNetworkPeers()
            await store.dispatch('peer/available/set', { peers })
            expect(store.state.peer.available[networkId].peers).toBe(peers)
          })
          it('should be able to set available peers for a specific network.', async () => {
            const id = 1
            const networkId = networkList[id].id
            const peers = peerList[id]
            await store.dispatch('peer/available/set', { peers, networkId })
            expect(store.state.peer.available[networkId].peers).toBe(peers)
          })
          it('should not be able to set available peers to anything but an array', async () => {
            const id = 1
            const networkId = networkList[id].id
            const stateBefore = store.state.peer.available[networkId].peers
            const peers = false
            const action = () => store.dispatch('peer/available/set', { peers, networkId })
            await expect(action).toThrow()
            const stateAfter = store.state.peer.available[networkId].peers
            expect(stateAfter).toBe(stateBefore)
          })
        })
        describe('clear', () => {
          beforeEach(() => {
            store.commit('peer/available/SET_PEERS', {
              peers: peerList[0],
              networkId: networkList[0].id
            })

            store.commit('peer/available/SET_PEERS', {
              peers: peerList[1],
              networkId: networkList[1].id
            })
          })
          it('should be able to clear peers for the current network', async () => {
            const peers = currentNetworkPeers()
            const networkId = currentNetwork().id
            expect(peers.length).toBeGreaterThan(0)
            store.dispatch('peer/available/clear')
            expect(store.state.peer.available[networkId]).toBeFalsy()
          })
          it('should be able to clear peers for a specific network', () => {
            const id = 1
            const networkId = networkList[id].id
            const peers = store.state.peer.available[networkId].peers
            expect(peers.length).toBeGreaterThan(0)
            store.dispatch('peer/available/clear', { networkId })
            expect(store.state.peer.available[networkId]).toBeFalsy()
          })
        })
        describe('refresh', () => {
          it('should be able to refresh the peer list from current network', async () => {
            const networkId = currentNetwork().id
            const peers = [generateValidPeer(), generateValidPeer(), generateValidPeer()]
            const spy = jest.spyOn(PeerDiscovery, 'new').mockImplementationOnce(() => ({
              withLatency: jest.fn().mockReturnThis(),
              sortBy: jest.fn().mockReturnThis(),
              findPeersWithPlugin: jest.fn().mockReturnValue(peers)
            }))
            await store.dispatch('peer/available/refresh')
            expect(spy).toHaveBeenCalledWith({ networkOrHost: networkId })
            expect(currentNetworkPeers()).toBe(peers)
          })
          it('should be able to refresh the peer list from another network', async () => {
            const id = 1
            const networkId = networkList[id].id
            const peers = [generateValidPeer(), generateValidPeer(), generateValidPeer()]
            const spy = jest.spyOn(PeerDiscovery, 'new').mockImplementationOnce(() => ({
              withLatency: jest.fn().mockReturnThis(),
              sortBy: jest.fn().mockReturnThis(),
              findPeersWithPlugin: jest.fn().mockReturnValue(peers)
            }))
            await store.dispatch('peer/available/refresh', { networkId })
            expect(spy).toHaveBeenCalledWith({ networkOrHost: networkId })
            expect(store.state.peer.available[networkId].peers).toBe(peers)
          })
        })
        describe('findBest', () => {
          it('should be able to find the best peer for the current network', async () => {
            let peers = currentNetworkPeers()
            const networkId = currentNetwork().id
            peers.map(peer => setPeerNocks(peer))

            const spyDiscovery = jest.spyOn(PeerDiscovery, 'new').mockImplementationOnce(() => {
              return {
                withLatency: jest.fn().mockReturnThis(),
                sortBy: jest.fn().mockReturnThis(),
                findPeersWithPlugin: jest.fn().mockReturnValue(peers)
              }
            })

            const response = await store.dispatch('peer/available/findBest')

            // normalize latency
            response.latency = 0
            peers = peers.map(peer => ({ ...peer, latency: 0 }))

            expect(spyDiscovery).toHaveBeenCalledWith({ networkOrHost: networkId })
            expect(response).toStrictEqual(peers.find(peer => peer.host === response.host))
          })

          it('should be able to find the best peer for an specific network', async () => {
            const id = 1
            let peers = peerList[id]
            const networkId = networkList[id].id
            peers.map(peer => setPeerNocks(peer))

            const spyDiscovery = jest.spyOn(PeerDiscovery, 'new').mockImplementationOnce(() => {
              return {
                withLatency: jest.fn().mockReturnThis(),
                sortBy: jest.fn().mockReturnThis(),
                findPeersWithPlugin: jest.fn().mockReturnValue(peers)
              }
            })

            const response = await store.dispatch('peer/available/findBest', { networkId })

            // normalize latency
            response.latency = 0
            peers = peers.map(peer => ({ ...peer, latency: 0 }))

            expect(spyDiscovery).toHaveBeenCalledWith({ networkOrHost: networkId })
            expect(response).toStrictEqual(peers.find(peer => peer.host === response.host))
          })

          it('should be able to find the best peer without refreashing the list', async () => {
            let peers = currentNetworkPeers()
            peers.map(peer => setPeerNocks(peer))

            const spyDiscovery = jest.spyOn(PeerDiscovery, 'new').mockImplementationOnce(() => {
              return {
                withLatency: jest.fn().mockReturnThis(),
                sortBy: jest.fn().mockReturnThis(),
                findPeersWithPlugin: jest.fn().mockReturnValue(peers)
              }
            })

            const response = await store.dispatch('peer/available/findBest', { refresh: false })

            // normalize latency
            response.latency = 0
            peers = peers.map(peer => ({ ...peer, latency: 0 }))

            expect(spyDiscovery).not.toHaveBeenCalled()
            expect(response).toStrictEqual(peers.find(peer => peer.host === response.host))
          })
        })
        describe('connectToBest', () => {
          test.todo('it should be able to connet to best peer from current network')
          test.todo('it should be able to skip current peer if is custom network')
          test.todo('it should be able to connet to best peer without refreshing the network')
          test.todo('it should be able to clear the system in case cannot connect to best peer')
        })
      })
    })

    describe('current', () => {
      describe('getters', () => {
        describe('get', () => {
          it('should be able to get the current peer from the current network', () => {
            const peer = currentPeer()
            const getter = store.getters['peer/current/get']()
            expect(getter).toBe(peer)
          })
        })
      })
      describe('mutations', () => {
        describe('SET_CURRENT_PEER', () => {
          test.todo('should be able to set the current peer for a network.')
        })
        describe('CLEAR_CURRENT_PEER', () => {
          test.todo('should be able to clear the current peer for a network.')
        })
      })
      describe('actions', () => {
        describe('set', () => {
          it('should be able to set the current peer for the current network', async () => {
            const peer = generateValidPeer()
            let current = currentPeer()

            expect(current).not.toBe(peer)

            setPeerNocks(peer)
            await store.dispatch('peer/current/set', { peer })
            current = currentPeer()

            // Remove parameters that are set during the response.
            delete current.latency
            delete peer.latency

            expect(current).toStrictEqual(peer)
          })
          it('should be able to set the current peer for a specific network', async () => {
            const id = 1
            const networkId = networkList[id].id

            const peer = generateValidPeer()
            let current = store.state.peer.current[networkId]

            expect(current).not.toBe(peer)

            setPeerNocks(peer)
            await store.dispatch('peer/current/set', { peer, networkId })

            current = store.state.peer.current[networkId]

            delete current.latency
            delete peer.latency

            expect(current).toStrictEqual(peer)
          })
          it('should not be able to set a falsy value as the current peer', async () => {
            const peer = false
            await expect(store.dispatch('peer/current/set', { peer })).rejects.toThrow()
          })
          it('should not be able to set an empty object as the current peer', async () => {
            const peer = {}
            await expect(store.dispatch('peer/current/set', { peer })).rejects.toThrow()
          })
          it('should be able to not update the peer before setting it as the current peer', async () => {
            const peer = generateValidPeer()
            const networkId = currentNetwork().id
            setPeerNocks(peer)
            await store.dispatch('peer/current/set', { peer, update: false })
            const current = store.state.peer.current[networkId]
            expect(current).toBe(peer)
          })
        })

        describe('clear', () => {
          beforeEach(() => {
            store.commit('peer/current/SET_CURRENT_PEER', {
              peer: peerList[0][0],
              networkId: networkList[0].id
            })

            store.commit('peer/current/SET_CURRENT_PEER', {
              peer: peerList[1][0],
              networkId: networkList[1].id
            })
          })
          it('should be able to clear the current peer for the current network', async () => {
            let peer = currentPeer()
            const networkId = currentNetwork().id
            expect(peer).toBeTruthy()
            await store.dispatch('peer/current/clear')
            peer = store.state.peer.current[networkId]
            expect(peer).toBeFalsy()
          })
          it('should be able to clear the current peer for a specific network', async () => {
            const id = 1
            const networkId = networkList[id].id
            let peer = store.state.peer.current[networkId]
            expect(peer).toBeTruthy()
            await store.dispatch('peer/current/clear', { networkId })
            peer = store.state.peer.current[networkId]
            expect(peer).toBeFalsy()
          })
        })
      })
    })

    describe('discovery', () => {
      describe('getters', () => {
        describe('get', () => {
          describe('default networks (ark.mainnet & ark.devnet)', () => {
            it('should be able to get the peer discovery instance for the current network', async () => {
              const spy = jest.spyOn(PeerDiscovery, 'new').mockImplementation(() => jest.fn())
              const networkId = currentNetwork().id
              await store.getters['peer/discovery/get']()
              expect(spy).toHaveBeenCalledWith({ networkOrHost: networkId })
            })
            it('should be able to get the peer discovery instance for a specific network', async () => {
              const spy = jest.spyOn(PeerDiscovery, 'new').mockImplementation(() => jest.fn())
              const id = 1
              const networkId = networkList[id].id
              await store.getters['peer/discovery/get']({ networkId })
              expect(spy).toHaveBeenCalledWith({ networkOrHost: networkId })
            })
            it('should be able to get the peer discovery instance for default network names', async () => {
              const networkId = 'ark.devnet'
              const spy = jest.spyOn(PeerDiscovery, 'new').mockImplementation(() => jest.fn())
              await store.getters['peer/discovery/get']({ networkId })
              expect(spy).toHaveBeenCalledWith({ networkOrHost: 'devnet' })
            })
          })
        })
      })
    })

    describe('seed', () => {
      describe('getters', () => {
        beforeAll(() => {
          // ID 0 is aways current network
          config.PEERS[networkList[0].id] = seedPeerList[0]
          config.PEERS[networkList[1].id] = seedPeerList[1]
        })

        afterAll(() => {
          delete config.PEERS[networkList[0].id]
          delete config.PEERS[networkList[1].id]
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
    })

    describe('system', () => {
      describe('actions', () => {
        describe('update', () => {
          test.todo('it should be able to update the whole peer system')
        })
        describe('clear', () => {
          test.todo('it should be able to clear all the peer system')
        })
      })
    })
  })
})
