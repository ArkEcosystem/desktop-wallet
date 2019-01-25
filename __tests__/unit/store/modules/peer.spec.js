import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient, { client } from '@/plugins/api-client'
import PeerModule from '@/store/modules/peer'
import peers, { goodPeer1, goodPeer2, goodPeer4, goodPeer5, badPeer1 } from '../../__fixtures__/store/peer'

Vue.use(Vuex)
Vue.use(apiClient)

const nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
const store = new Vuex.Store({
  modules: {
    peer: PeerModule,
    session: {
      namespaced: true,
      getters: {
        profile () {
          return {
            networkId: 'abc'
          }
        },
        network () {
          return {
            id: 'abc',
            nethash
          }
        }
      }
    }
  },
  strict: true
})

const axiosMock = new AxiosMockAdapter(axios)

beforeEach(() => {
  store.dispatch('peer/set', peers)
  client.version = 1
  axiosMock.reset()
})

describe('peer store module', () => {
  it('should get peer list', () => {
    expect(store.getters['peer/all']()).toIncludeAllMembers(peers)
  })

  it('should get a single peer', () => {
    expect(store.getters['peer/get']('2.2.2.2')).toEqual(goodPeer2)
  })

  it('should get one of the best peers', () => {
    const bestPeer = store.getters['peer/best']()
    expect(bestPeer).toBeOneOf(peers)
    expect(bestPeer).not.toEqual(badPeer1)
  })

  it('should get peers in random order', () => {
    const randomPeers = store.getters['peer/randomPeers']()
    expect(randomPeers[0]).toBeOneOf(peers)
    const randomPeers2 = store.getters['peer/randomPeers']()
    expect(randomPeers).not.toEqual(randomPeers2)
  })

  it('should get random seed server peer', () => {
    const randomSeedPeers = store.getters['peer/randomSeedPeers'](5, 'ark.mainnet')
    const randomSeedPeers2 = store.getters['peer/randomSeedPeers'](5, 'ark.mainnet')
    expect(randomSeedPeers).not.toEqual(randomSeedPeers2)
  })

  it('should get & set current peer', async () => {
    await store.dispatch('peer/setCurrentPeer', goodPeer1)
    expect(store.getters['peer/current']()).toEqual(goodPeer1)
    await store.dispatch('peer/setCurrentPeer', goodPeer2)
    expect(store.getters['peer/current']()).toEqual(goodPeer2)
    await store.dispatch('peer/setCurrentPeer', goodPeer4)
    expect(store.getters['peer/current']()).toEqual(goodPeer4)
    await store.dispatch('peer/setCurrentPeer', goodPeer5)
    expect(store.getters['peer/current']()).toEqual(goodPeer5)
  })

  it('should return false if no initial peer', () => {
    store.commit('peer/SET_CURRENT_PEER', { peer: null, networkId: 'abc' })
    expect(store.getters['peer/current']()).toEqual(false)
  })

  it('should get a last updated date', () => {
    expect(store.getters['peer/lastUpdated']).toBeTruthy()
  })

  it('should reset peer list', () => {
    store.dispatch('peer/set', [goodPeer1, goodPeer2])
    expect(store.getters['peer/all']()).toIncludeAllMembers([goodPeer1, goodPeer2])
  })

  it('should connect to best peer', async () => {
    for (const peer of peers) {
      axiosMock
        .onGet(`http://${peer.ip}:${peer.port}/api/loader/status/sync`)
        .reply(200, {
          height: 20000
        })

      axiosMock
        .onGet(`http://${peer.ip}:${peer.port}/api/loader/autoconfigure`)
        .reply(200, {
          network: {
            nethash
          }
        })

      axiosMock
        .onGet(`http://${peer.ip}:${peer.port}/api/blocks/getEpoch`)
        .reply(200, {
          epoch: new Date()
        })
    }

    const bestPeer = await store.dispatch('peer/connectToBest', { refresh: false })
    expect(bestPeer).toEqual(store.getters['peer/current']())
    expect(bestPeer.ip).toBeOneOf(peers.map(peer => peer.ip))
    expect(bestPeer.ip).not.toEqual(badPeer1.ip)
  })

  it('should refresh peer list for v1', async () => {
    jest.setTimeout(15000)
    const badPeer2 = { ...badPeer1, ip: '5.5.5.5', status: 'stale' }
    const refreshPeers = [goodPeer1, badPeer2]

    for (const peer of refreshPeers) {
      axiosMock
        .onGet(`http://${peer.ip}:${peer.port}/api/peers`)
        .reply(200, {
          success: true,
          peers: refreshPeers
        })
    }

    store.dispatch('peer/set', refreshPeers)
    await store.dispatch('peer/refresh')
    expect(store.getters['peer/all']()).toEqual([goodPeer1])
  })

  it('should refresh peer list for v2', async () => {
    jest.setTimeout(15000)
    client.version = 2
    const goodV2Peer = { ...goodPeer1, status: 200, version: '2.0.0' }
    const badV2Peer = { ...badPeer1, ip: '5.5.5.5', status: 'stale', version: '2.0.0' }
    const refreshPeers = [goodV2Peer, badV2Peer]
    store.dispatch('peer/set', refreshPeers)

    for (const peer of refreshPeers) {
      peer.latency = peer.delay
      delete peer.delay
    }

    for (const peer of refreshPeers) {
      axiosMock
        .onGet(`http://${peer.ip}:${peer.port}/api/peers`)
        .reply(200, {
          data: refreshPeers
        })
    }

    await store.dispatch('peer/refresh')
    goodV2Peer.delay = goodV2Peer.latency
    delete goodV2Peer.latency
    expect(store.getters['peer/all']()).toEqual([{ ...goodV2Peer, p2pPort: goodV2Peer.port, port: null }])
  })

  it('should update v1 peer status on the fly', async () => {
    client.version = 1
    client.host = `http://${goodPeer1.ip}:${goodPeer1.port}`

    axiosMock
      .onGet(`${client.host}/api/loader/status/sync`)
      .reply(200, {
        height: 11000
      })

    axiosMock
      .onGet(`${client.host}/api/loader/autoconfigure`)
      .reply(200, {
        network: {
          nethash
        }
      })

    axiosMock
      .onGet(`${client.host}/api/blocks/getEpoch`)
      .reply(200, {
        epoch: new Date()
      })

    const updatedPeer = await store.dispatch('peer/updateCurrentPeerStatus', goodPeer1)

    expect(updatedPeer.height).toBe(11000)
    expect(updatedPeer.delay).not.toBe(123)
    expect(updatedPeer.lastUpdated).toBeTruthy()
  })

  it('should update v2 peer status on the fly', async () => {
    client.version = 2
    const goodV2Peer = { ...goodPeer1, version: '2.0.0' }
    client.host = `http://${goodV2Peer.ip}:${goodV2Peer.port}`

    axiosMock
      .onGet(`${client.host}/api/node/syncing`)
      .reply(200, {
        data: {
          height: 21000
        }
      })

    axiosMock
      .onGet(`${client.host}/api/node/configuration`)
      .reply(200, {
        data: {
          nethash
        }
      })

    const updatedPeer = await store.dispatch('peer/updateCurrentPeerStatus', goodV2Peer)

    expect(updatedPeer.height).toBe(21000)
    expect(updatedPeer.delay).not.toBe(123)
    expect(updatedPeer.lastUpdated).toBeTruthy()
  })

  it('should update current peer status', async () => {
    await store.dispatch('peer/setCurrentPeer', goodPeer1)

    client.version = 1
    client.host = `http://${goodPeer1.ip}:${goodPeer1.port}`

    axiosMock
      .onGet(`${client.host}/api/loader/status/sync`)
      .reply(200, {
        height: 10000
      })

    axiosMock
      .onGet(`${client.host}/api/loader/autoconfigure`)
      .reply(200, {
        network: {
          nethash
        }
      })

    axiosMock
      .onGet(`${client.host}/api/blocks/getEpoch`)
      .reply(200, {
        epoch: new Date()
      })

    await store.dispatch('peer/updateCurrentPeerStatus')
    const currentPeer = store.getters['peer/current']()

    expect(currentPeer.height).toBe(10000)
    expect(currentPeer.delay).not.toBe(123)
    expect(currentPeer.lastUpdated).toBeTruthy()
  })

  it('should validate a v1 peer successfully', async () => {
    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/loader/autoconfigure`)
      .reply(200, {
        network: {
          nethash
        }
      })

    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/loader/status/sync`)
      .reply(200, {
        height: 10001
      })

    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/blocks/getEpoch`)
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })

    expect(response).toBeObject()
    expect(response).toContainEntries([
      ['height', 10001],
      ['delay', 0],
      ['version', '1.0.0']
    ])
  })

  it('should validate a v1 https peer successfully', async () => {
    axiosMock
      .onGet(`https://${goodPeer1.ip}:${goodPeer1.port}/api/loader/autoconfigure`)
      .reply(200, {
        network: {
          nethash
        }
      })

    axiosMock
      .onGet(`https://${goodPeer1.ip}:${goodPeer1.port}/api/loader/status/sync`)
      .reply(200, {
        height: 10001
      })

    axiosMock
      .onGet(`https://${goodPeer1.ip}:${goodPeer1.port}/api/blocks/getEpoch`)
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    const response = await store.dispatch('peer/validatePeer', {
      ...goodPeer1,
      host: `https://${goodPeer1.ip}`,
      timeout: 100
    })

    expect(response).toBeObject()
    expect(response).toContainEntries([
      ['height', 10001],
      ['delay', 0],
      ['version', '1.0.0']
    ])
  })

  it('should validate a v2 peer successfully', async () => {
    // Mock v1 endpoints also since they are available on core v2
    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/loader/autoconfigure`)
      .reply(200, {
        network: {
          nethash
        }
      })

    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/loader/status/sync`)
      .reply(200, {
        data: {
          height: 10002
        }
      })

    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/blocks/getEpoch`)
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    // Mock v2 endpoints
    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/node/configuration`)
      .reply(200, {
        data: {
          nethash
        }
      })

    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/node/syncing`)
      .reply(200, {
        data: {
          height: 10002
        }
      })

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })

    expect(response).toBeObject()
    expect(response).toContainEntries([
      ['height', 10002],
      ['delay', 0],
      ['version', '2.0.0']
    ])
  })

  it('should validate a v2 https peer successfully', async () => {
    // Mock v1 endpoints also since they are available on core v2
    axiosMock
      .onGet(`https://${goodPeer1.ip}:${goodPeer1.port}/api/loader/autoconfigure`)
      .reply(200, {
        network: {
          nethash
        }
      })

    axiosMock
      .onGet(`https://${goodPeer1.ip}:${goodPeer1.port}/api/loader/status/sync`)
      .reply(200, {
        data: {
          height: 10002
        }
      })

    // Mock v2 endpoints
    axiosMock
      .onGet(`https://${goodPeer1.ip}:${goodPeer1.port}/api/node/configuration`)
      .reply(200, {
        data: {
          nethash
        }
      })

    axiosMock
      .onGet(`https://${goodPeer1.ip}:${goodPeer1.port}/api/node/syncing`)
      .reply(200, {
        data: {
          height: 10002
        }
      })

    const response = await store.dispatch('peer/validatePeer', {
      ...goodPeer1,
      host: `https://${goodPeer1.ip}`,
      timeout: 100
    })

    expect(response).toBeObject()
    expect(response).toContainEntries([
      ['height', 10002],
      ['delay', 0],
      ['version', '2.0.0']
    ])
  })

  it('should fail validating a v1 peer due to bad network url', async () => {
    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/loader/autoconfigure`)
      .reply(400)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Could not connect$/))
  })

  it('should fail validating a v2 peer due to bad network url', async () => {
    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/node/configuration`)
      .reply(400)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Could not connect$/))
  })

  it('should fail validating a v1 peer due to bad sync status url', async () => {
    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/loader/autoconfigure`)
      .reply(200, {
        network: {
          nethash
        }
      })

    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/blocks/getEpoch`)
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    axiosMock
      .onGet(`${client.host}/api/loader/syncing`)
      .reply(400)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Status check failed$/))
  })

  it('should fail validating a v2 peer due to bad sync status url', async () => {
    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/node/configuration`)
      .reply(200, {
        data: {
          nethash
        }
      })

    axiosMock
      .onGet(`${client.host}/api/node/syncing`)
      .reply(400)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Status check failed$/))
  })

  it('should fail validating a v1 peer because of wrong nethash', async () => {
    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/loader/autoconfigure`)
      .reply(200, {
        network: {
          nethash: 'wrong nethash'
        }
      })

    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/blocks/getEpoch`)
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Wrong network$/))
  })

  it('should fail validating a v2 peer because of wrong nethash', async () => {
    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/node/configuration`)
      .reply(200, {
        data: {
          nethash: 'wrong nethash'
        }
      })

    axiosMock
      .onGet(`http://${goodPeer1.ip}:${goodPeer1.port}/api/blocks/getEpoch`)
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Wrong network$/))
  })
})
