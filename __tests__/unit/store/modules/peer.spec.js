import nock from 'nock'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient, { client } from '@/plugins/api-client'
import store from '@/store'
import peers, { goodPeer1, goodPeer2, goodPeer4, goodPeer5, badPeer1 } from '../../__fixtures__/store/peer'
import { network1 } from '../../__fixtures__/store/network'
import { profile1 } from '../../__fixtures__/store/profile'

Vue.use(Vuex)
Vue.use(apiClient)

const nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'

const stripPorts = (peers) => {
  const single = !Array.isArray(peers)
  if (single) {
    peers = [peers]
  }

  const response = peers.map(peer => {
    const newPeer = {}
    for (const key of Object.keys(peer)) {
      if (key === 'ports') {
        continue
      }

      newPeer[key] = peer[key]
    }

    return newPeer
  })

  if (single) {
    return response[0]
  }

  return response
}

beforeAll(() => {
  network1.nethash = nethash
  store.commit('network/SET_ALL', [network1])
  store.commit('profile/CREATE', profile1)
  store.commit('session/SET_PROFILE_ID', profile1.id)
  store.dispatch('peer/set', peers)
})

beforeEach(() => {
  nock.cleanAll()
})

describe('peer store module', () => {
  it('should get peer list', () => {
    expect(store.getters['peer/all']()).toIncludeAllMembers(stripPorts(peers))
  })

  it('should get a single peer', () => {
    expect(store.getters['peer/get']('2.2.2.2')).toEqual(stripPorts(goodPeer2))
  })

  it('should get one of the best peers', () => {
    const bestPeer = store.getters['peer/best']()
    expect(bestPeer).toBeOneOf(stripPorts(peers))
    expect(bestPeer).not.toEqual(badPeer1)
  })

  it('should get peers in random order', () => {
    const randomPeers = store.getters['peer/randomPeers']()
    expect(randomPeers[0]).toBeOneOf(stripPorts(peers))
    const randomPeers2 = store.getters['peer/randomPeers']()
    expect(randomPeers).not.toEqual(randomPeers2)
  })

  it('should get random seed server peer', () => {
    const randomSeedPeers = store.getters['peer/randomSeedPeers'](5, 'ark.mainnet')
    const randomSeedPeers2 = store.getters['peer/randomSeedPeers'](5, 'ark.mainnet')
    expect(randomSeedPeers).not.toEqual(randomSeedPeers2)
  })

  it('should get & set current peer', async () => {
    for (const peer of peers) {
      nock(`http://${peer.ip}:${peer.port}`)
        .get('/api/transactions/fees')
        .reply(200, {
          data: {
            send: 1,
            secondsignature: 1,
            delegate: 1,
            vote: 1
          }
        })
    }
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
    store.commit('peer/SET_CURRENT_PEER', { peer: null, networkId: network1.id })
    expect(store.getters['peer/current']()).toEqual(false)
  })

  it('should get a last updated date', () => {
    expect(store.getters['peer/lastUpdated']).toBeTruthy()
  })

  it('should reset peer list', () => {
    store.dispatch('peer/set', [goodPeer1, goodPeer2])
    const result = stripPorts([goodPeer1, goodPeer2])

    expect(store.getters['peer/all']()).toIncludeAllMembers(result)
  })

  it('should connect to best peer', async () => {
    const peerResponse = peers.filter(peer => peer.ip !== goodPeer1.ip)
    for (const peer of peers) {
      nock(`http://${peer.ip}:${peer.port}`)
        .persist()
        .get('/api/node/syncing')
        .reply(200, {
          data: {
            height: 20000
          }
        })
        .get('/api/node/configuration')
        .reply(200, {
          data: {
            nethash
          }
        })
        .get('/api/blocks/getEpoch')
        .reply(200, {
          epoch: new Date()
        })
        .get('/api/transactions/fees')
        .reply(200, {
          data: {
            send: 1,
            secondsignature: 1,
            delegate: 1,
            vote: 1
          }
        })
        .get('/api/peers')
        .reply(200, {
          data: peerResponse
        })
    }

    await store.dispatch('peer/setCurrentPeer', goodPeer1)
    const bestPeer = await store.dispatch('peer/connectToBest', { refresh: false })
    expect(bestPeer).toEqual(store.getters['peer/current']())
    expect(bestPeer.ip).toBeOneOf(peerResponse.map(peer => peer.ip))
    expect(bestPeer.ip).not.toEqual(badPeer1.ip)
  })

  it('should refresh peer list for v2', async () => {
    const goodV2Peer = { ...goodPeer1, version: '2.0.0' }
    const badV2Peer = { ...badPeer1, ip: '5.5.5.5', version: '1.0.0' }
    const refreshPeers = [goodV2Peer, badV2Peer]

    nock(`http://${goodPeer1.ip}:${goodPeer1.ports['@arkecosystem/core-api']}`)
      .persist()
      .get('/api/transactions/fees')
      .reply(200, {
        data: {
          send: 1,
          secondsignature: 1,
          delegate: 1,
          vote: 1
        }
      })

    for (const peer of refreshPeers) {
      nock(`http://${peer.ip}:${peer.ports['@arkecosystem/core-api']}`)
        .persist()
        .get('/api/peers')
        .reply(200, {
          data: refreshPeers
        })
    }

    await store.dispatch('peer/setCurrentPeer', goodPeer1)
    await store.dispatch('peer/refresh')

    const allPeers = store.getters['peer/all']()
    expect(allPeers.length).toEqual(1)
    expect(allPeers[0]).toContainEntries([
      ['ip', goodV2Peer.ip],
      ['height', goodV2Peer.height],
      ['latency', goodV2Peer.latency],
      ['port', goodV2Peer.port]
    ])
  })

  it('should update v2 peer status on the fly', async () => {
    const goodV2Peer = { ...goodPeer1, version: '2.0.0' }
    const host = `http://${goodV2Peer.ip}:${goodV2Peer.port}`
    client.host = host

    nock(host)
      .get('/api/node/syncing')
      .reply(200, {
        data: {
          height: 21000
        }
      })
      .get('/api/node/configuration')
      .reply(200, {
        data: {
          constants: {},
          nethash
        }
      })

    const updatedPeer = await store.dispatch('peer/updateCurrentPeerStatus', goodV2Peer)

    expect(updatedPeer.height).toBe(21000)
    expect(updatedPeer.latency).not.toBe(123)
    expect(updatedPeer.lastUpdated).toBeTruthy()
  })

  it('should update current peer status', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .persist()
      .get('/api/node/configuration')
      .reply(200, {
        data: {
          constants: {
            vendorFieldLength: 255
          },
          nethash
        }
      })
      .get('/api/node/syncing')
      .reply(200, {
        data: {
          height: 10000
        }
      })
      .get('/api/transactions/fees')
      .reply(200, {
        data: {
          send: 1,
          secondsignature: 1,
          delegate: 1,
          vote: 1
        }
      })

    await store.dispatch('peer/setCurrentPeer', goodPeer1)

    client.host = `http://${goodPeer1.ip}:${goodPeer1.port}`

    await store.dispatch('peer/updateCurrentPeerStatus')
    const currentPeer = store.getters['peer/current']()

    expect(currentPeer.height).toBe(10000)
    expect(currentPeer.latency).not.toBe(123)
    expect(currentPeer.lastUpdated).toBeTruthy()
  })

  it('should validate a v2 peer successfully', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/configuration')
      .reply(200, {
        data: {
          constants: {},
          nethash
        }
      })
      .get('/api/node/syncing')
      .reply(200, {
        data: {
          height: 10002
        }
      })

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })

    expect(response).toBeObject()
    expect(response).toContainEntries([
      ['height', 10002],
      ['latency', 0]
    ])
  })

  it('should validate a v2 https peer successfully', async () => {
    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/configuration')
      .reply(200, {
        data: {
          constants: {},
          nethash
        }
      })
      .get('/api/node/syncing')
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
      ['latency', 0]
    ])
  })

  it('should fail validating a v2 peer due to bad network url', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/configuration')
      .reply(400)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Could not connect$/))
  })

  it('should fail validating a v2 peer due to bad sync status url', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/configuration')
      .reply(200, {
        data: {
          constants: {},
          nethash
        }
      })
      .get('/api/node/syncing')
      .reply(400)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Status check failed$/))
  })

  it('should fail validating a v2 peer because of wrong nethash', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .persist()
      .get('/api/node/configuration')
      .reply(200, {
        data: {
          constants: {},
          nethash: 'wrong nethash'
        }
      })

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Wrong network$/))
  })
})
