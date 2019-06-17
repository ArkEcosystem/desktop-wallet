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

beforeAll(() => {
  network1.nethash = nethash
  store.commit('network/SET_ALL', [network1])
  store.commit('profile/CREATE', profile1)
  store.commit('session/SET_PROFILE_ID', profile1.id)
  store.dispatch('peer/set', peers)
})

beforeEach(() => {
  nock.cleanAll()
  client.version = 1
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
    // expect(bestPeer).not.toEqual(badPeer1)
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
    for (const peer of peers) {
      nock(`http://${peer.ip}:${peer.port}`)
        .get('/api/blocks/getFees')
        .reply(200, {
          fees: {
            send: 1,
            secondsignature: 1,
            delegate: 1,
            vote: 1
          }
        })

      nock(`http://${peer.ip}:${peer.port}`)
        .defaultReplyHeaders({
          'access-control-allow-origin': '*',
          'access-control-allow-headers': 'API-Version'
        })
        .options('/api/blocks/getFees')
        .reply(200)
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
    expect(store.getters['peer/all']()).toIncludeAllMembers([goodPeer1, goodPeer2])
  })

  it('should connect to best peer', async () => {
    for (const peer of peers) {
      nock(`http://${peer.ip}:${peer.port}`)
        .get('/api/loader/status/sync')
        .reply(200, {
          height: 20000
        })

      nock(`http://${peer.ip}:${peer.port}`)
        .get('/api/loader/autoconfigure')
        .reply(200, {
          network: {
            nethash
          }
        })

      nock(`http://${peer.ip}:${peer.port}`)
        .get('/api/blocks/getEpoch')
        .reply(200, {
          epoch: new Date()
        })

      nock(`http://${peer.ip}:${peer.port}`)
        .get('/api/blocks/getFees')
        .reply(200, {
          fees: {
            send: 1,
            secondsignature: 1,
            delegate: 1,
            vote: 1
          }
        })

      nock(`http://${peer.ip}:${peer.port}`)
        .defaultReplyHeaders({
          'access-control-allow-origin': '*',
          'access-control-allow-headers': 'API-Version'
        })
        .options('/api/loader/status/sync')
        .reply(200)
        .options('/api/loader/autoconfigure')
        .reply(200)
        .options('/api/blocks/getEpoch')
        .reply(200)
        .options('/api/blocks/getFees')
        .reply(200)
    }

    const bestPeer = await store.dispatch('peer/connectToBest', { refresh: false })
    expect(bestPeer).toEqual(store.getters['peer/current']())
    expect(bestPeer.ip).toBeOneOf(peers.map(peer => peer.ip))
    // expect(bestPeer.ip).not.toEqual(badPeer1.ip)
  })

  it('should refresh peer list for v1', async () => {
    jest.setTimeout(15000)
    const badPeer2 = { ...badPeer1, ip: '5.5.5.5', status: 'stale' }
    const refreshPeers = [goodPeer1, badPeer2]

    for (const peer of refreshPeers) {
      nock(`http://${peer.ip}:${peer.port}`)
        .get('/api/peers')
        .reply(200, {
          success: true,
          peers: refreshPeers
        })

      nock(`http://${peer.ip}:${peer.port}`)
        .defaultReplyHeaders({
          'access-control-allow-origin': '*',
          'access-control-allow-headers': 'API-Version'
        })
        .options('/api/peers')
        .reply(200)
    }

    store.dispatch('peer/set', refreshPeers)
    await store.dispatch('peer/refresh')
    expect(store.getters['peer/all']()).toEqual([goodPeer1, badPeer2])
  })

  it('should refresh peer list for v2', async () => {
    jest.setTimeout(15000)
    client.version = 2
    const goodV2Peer = { ...goodPeer1, version: '2.0.0' }
    const badV2Peer = { ...badPeer1, ip: '5.5.5.5', version: '1.0.0' }
    const refreshPeers = [goodV2Peer, badV2Peer]
    store.dispatch('peer/set', refreshPeers)

    for (const peer of refreshPeers) {
      peer.latency = peer.delay
      delete peer.delay
    }

    for (const peer of refreshPeers) {
      nock(`http://${peer.ip}:${peer.port}`)
        .get('/api/peers')
        .reply(200, {
          data: refreshPeers
        })

      nock(`http://${peer.ip}:${peer.port}`)
        .defaultReplyHeaders({
          'access-control-allow-origin': '*',
          'access-control-allow-headers': 'API-Version'
        })
        .options('/api/peers')
        .reply(200)
    }

    await store.dispatch('peer/refresh')
    goodV2Peer.delay = goodV2Peer.latency
    delete goodV2Peer.latency
    badV2Peer.delay = badV2Peer.latency
    delete badV2Peer.latency
    expect(store.getters['peer/all']()).toEqual([{ ...goodV2Peer, p2pPort: goodV2Peer.port, port: null }, badV2Peer])
  })

  it('should update v1 peer status on the fly', async () => {
    client.version = 1
    client.host = `http://${goodPeer1.ip}:${goodPeer1.port}`

    nock(client.host)
      .get('/api/loader/status/sync')
      .reply(200, {
        height: 11000
      })

    nock(client.host)
      .get('/api/loader/autoconfigure')
      .reply(200, {
        network: {
          nethash
        }
      })

    nock(client.host)
      .get('/api/blocks/getEpoch')
      .reply(200, {
        epoch: new Date()
      })

    nock(client.host)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/loader/status/sync')
      .reply(200)
      .options('/api/loader/autoconfigure')
      .reply(200)
      .options('/api/blocks/getEpoch')
      .reply(200)

    const updatedPeer = await store.dispatch('peer/updateCurrentPeerStatus', goodPeer1)

    expect(updatedPeer.height).toBe(11000)
    expect(updatedPeer.delay).not.toBe(123)
    expect(updatedPeer.lastUpdated).toBeTruthy()
  })

  it('should update v2 peer status on the fly', async () => {
    client.version = 2
    const goodV2Peer = { ...goodPeer1, version: '2.0.0' }
    client.host = `http://${goodV2Peer.ip}:${goodV2Peer.port}`

    nock(client.host)
      .get('/api/node/syncing')
      .reply(200, {
        data: {
          height: 21000
        }
      })

    nock(client.host)
      .get('/api/node/configuration')
      .reply(200, {
        data: {
          constants: {},
          nethash
        }
      })

    nock(client.host)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/node/syncing')
      .reply(200)
      .options('/api/node/configuration')
      .reply(200)

    const updatedPeer = await store.dispatch('peer/updateCurrentPeerStatus', goodV2Peer)

    expect(updatedPeer.height).toBe(21000)
    expect(updatedPeer.delay).not.toBe(123)
    expect(updatedPeer.lastUpdated).toBeTruthy()
  })

  it('should update current peer status', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/autoconfigure')
      .reply(200, {
        network: {
          nethash
        }
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/status/sync')
      .reply(200, {
        height: 10000
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/blocks/getEpoch')
      .reply(200, {
        epoch: new Date()
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .persist()
      .get('/api/blocks/getFees')
      .reply(200, {
        fees: {
          send: 1,
          secondsignature: 1,
          delegate: 1,
          vote: 1
        }
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .persist()
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/loader/autoconfigure')
      .reply(200)
      .options('/api/loader/status/sync')
      .reply(200)
      .options('/api/blocks/getEpoch')
      .reply(200)
      .options('/api/blocks/getFees')
      .reply(200)

    await store.dispatch('peer/setCurrentPeer', goodPeer1)

    client.version = 1
    client.host = `http://${goodPeer1.ip}:${goodPeer1.port}`

    await store.dispatch('peer/updateCurrentPeerStatus')
    const currentPeer = store.getters['peer/current']()

    expect(currentPeer.height).toBe(10000)
    expect(currentPeer.delay).not.toBe(123)
    expect(currentPeer.lastUpdated).toBeTruthy()
  })

  it('should validate a v1 peer successfully', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/autoconfigure')
      .reply(200, {
        network: {
          nethash
        }
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/status/sync')
      .reply(200, {
        height: 10001
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/blocks/getEpoch')
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/loader/autoconfigure')
      .reply(200)
      .options('/api/blocks/getEpoch')
      .reply(200)
      .options('/api/loader/status/sync')
      .reply(200)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })

    expect(response).toBeObject()
    expect(response).toContainEntries([
      ['height', 10001],
      ['delay', 0],
      ['version', '1.0.0']
    ])
  })

  it('should validate a v1 https peer successfully', async () => {
    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/autoconfigure')
      .reply(200, {
        network: {
          nethash
        }
      })

    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/status/sync')
      .reply(200, {
        height: 10001
      })

    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/blocks/getEpoch')
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/loader/autoconfigure')
      .reply(200)
      .options('/api/loader/status/sync')
      .reply(200)
      .options('/api/blocks/getEpoch')
      .reply(200)

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
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/autoconfigure')
      .reply(200, {
        network: {
          constants: {},
          nethash
        }
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/status/sync')
      .reply(200, {
        data: {
          height: 10002
        }
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/blocks/getEpoch')
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    // Mock v2 endpoints
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/configuration')
      .reply(200, {
        data: {
          constants: {},
          nethash
        }
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/syncing')
      .reply(200, {
        data: {
          height: 10002
        }
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/loader/autoconfigure')
      .reply(200)
      .options('/api/loader/status/sync')
      .reply(200)
      .options('/api/blocks/getEpoch')
      .reply(200)
      .options('/api/node/configuration')
      .reply(200)
      .options('/api/node/syncing')
      .reply(200)

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
    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/autoconfigure')
      .reply(200, {
        network: {
          nethash
        }
      })

    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/status/sync')
      .reply(200, {
        data: {
          height: 10002
        }
      })

    // Mock v2 endpoints
    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/configuration')
      .reply(200, {
        data: {
          constants: {},
          nethash
        }
      })

    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/syncing')
      .reply(200, {
        data: {
          height: 10002
        }
      })

    nock(`https://${goodPeer1.ip}:${goodPeer1.port}`)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/loader/autoconfigure')
      .reply(200)
      .options('/api/loader/status/sync')
      .reply(200)
      .options('/api/node/configuration')
      .reply(200)
      .options('/api/node/syncing')
      .reply(200)

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
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/autoconfigure')
      .reply(400)

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/loader/autoconfigure')
      .reply(200)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Could not connect$/))
  })

  it('should fail validating a v2 peer due to bad network url', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/configuration')
      .reply(400)

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/node/configuration')
      .reply(200)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Could not connect$/))
  })

  it('should fail validating a v1 peer due to bad sync status url', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/configuration')
      .reply(404)

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/autoconfigure')
      .reply(200, {
        network: {
          nethash
        }
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/blocks/getEpoch')
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/syncing')
      .reply(400)

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/node/configuration')
      .reply(200)
      .options('/api/loader/autoconfigure')
      .reply(200)
      .options('/api/blocks/getEpoch')
      .reply(200)
      .options('/api/node/syncing')
      .reply(200)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Status check failed$/))
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

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/node/syncing')
      .reply(400)

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/node/configuration')
      .reply(200)
      .options('/api/node/syncing')
      .reply(200)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Status check failed$/))
  })

  it('should fail validating a v1 peer because of wrong nethash', async () => {
    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/loader/autoconfigure')
      .reply(200, {
        network: {
          nethash: 'wrong nethash'
        }
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .get('/api/blocks/getEpoch')
      .reply(200, {
        epoch: 'dummyEpoch'
      })

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/loader/autoconfigure')
      .reply(200)
      .options('/api/blocks/getEpoch')
      .reply(200)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Wrong network$/))
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

    nock(`http://${goodPeer1.ip}:${goodPeer1.port}`)
      .persist()
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'API-Version'
      })
      .options('/api/node/configuration')
      .reply(200)

    const response = await store.dispatch('peer/validatePeer', { ...goodPeer1, timeout: 100 })
    expect(response).toEqual(expect.stringMatching(/^Wrong network$/))
  })
})
