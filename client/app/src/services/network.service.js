;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('networkService', ['$q', '$http', '$timeout', 'timeService', 'storageService', NetworkService])

  /**
   * NetworkService
   * @constructor
   */
  function NetworkService ($q, $http, $timeout, timeService, storageService) {
    const path = require('path')
    const packageJson = require(path.resolve(__dirname, '../../package.json'))
    const clientVersion = packageJson.version

    const ark = require(path.resolve(__dirname, '../node_modules/arkjs'))
    const mainNetArkJsNetworkKey = 'ark'
    const devNetArkJsNetworkKey = 'testnet'

    let network = switchNetwork(storageService.getContext())
    if (!network) {
      network = switchNetwork()
    }
    ark.crypto.setNetworkVersion(network.version || 23)

    let currentPeer = {
      ip: network.peerseed,
      network: storageService.getContext(),
      isConnected: false,
      height: 0,
      lastConnection: null,
      price: storageService.getGlobal('peerCurrencies') || { btc: '0.0' },
      version: network && network.ports && network.ports['@arkecosystem/core-api'] ? '2' : '1'
    }

    const defaultHeaders = () => ({
      'Content-Type': 'application/json',
      os: 'ark-desktop',
      version: clientVersion,
      port: 1,
      nethash: network.nethash
    })

    const isV1 = () => currentPeer.version.startsWith('1')

    const httpGet = (url, headers) => {
      if (!headers) {
        headers = defaultHeaders()
      }

      return $http({
        url,
        method: 'GET',
        timeout: 5000,
        headers
      })
    }

    /*
     * Connect to the initial peer to ensure if it's from V1 or V2
     */
    const ensurePeerVersion = () => {
      // Try V2 first and V1 as fallback
      httpGet(`${currentPeer.ip}/api/v2/node/configuration`).then(
        _ => (currentPeer.version = '2'),
        _error => {
          httpGet(`${currentPeer.ip}/api/loader/autoconfigure`).then(
            _ => (currentPeer.version = '1'),
            _error => { throw new Error('Cannot connect to peer') }
          )
        })
    }

    ensurePeerVersion()

    const connection = $q.defer()
    connection.notify(currentPeer)

    const getNetwork = () => network
    const getNetworkName = () => storageService.getContext()
    const getNetworks = () => storageService.getGlobal('networks')
    const getConnection = () => connection.promise
    const getPeer = () => currentPeer

    const removeNetwork = (name) => {
      const networks = storageService.getGlobal('networks')
      delete networks[name]
      storageService.setGlobal('networks', networks)
      storageService.deleteState()
    }

    const ensureValidPeerSeed = network => {
      if (!network || !network.peerseed) {
        return
      }

      network.peerseed = network.peerseed.replace(/\/$/, '')
    }

    const setNetwork = (name, newNetwork) => {
      ensureValidPeerSeed(newNetwork)

      const network = storageService.getGlobal('networks')
      network[name] = newNetwork
      storageService.setGlobal('networks', network)
    }

    const createNetwork = data => {
      ensureValidPeerSeed(data)
      const networks = storageService.getGlobal('networks')

      return new Promise((resolve, reject) => {
        if (networks[data.name]) {
          reject(new Error(`Network name "${data.name}" already taken, please choose another one`))
        } else {
          const success = response => {
            const newNetwork = (response.data.network || response.data.data)
            newNetwork.isUnsaved = true
            newNetwork.forcepeer = data.forcepeer
            newNetwork.peerseed = data.peerseed
            newNetwork.slip44 = 1 // default to testnet slip44
            newNetwork.cmcTicker = data.cmcTicker
            resolve({ name: data.name, network: newNetwork })
          }

          // Try V2 first and V1 as fallback
          httpGet(`${data.peerseed}/api/v2/node/configuration`).then(
            success,
            _error => {
              httpGet(`${data.peerseed}/api/loader/autoconfigure`).then(
                success,
                _ => reject(new Error('Cannot connect to peer to autoconfigure the network'))
              )
            })
        }
      })
    }

    function createNetworkFromArkJs (arkJsNetworkKey, version, slip44, background) {
      const arkJsNetwork = ark.networks[arkJsNetworkKey]

      return {
        arkJsKey: arkJsNetworkKey,
        nethash: arkJsNetwork.nethash,
        peerseed: 'http://' + arkJsNetwork.activePeer.ip + ':' + arkJsNetwork.activePeer.port,
        token: arkJsNetwork.token,
        symbol: arkJsNetwork.symbol,
        explorer: arkJsNetwork.explorer,
        version,
        slip44,
        forcepeer: false,
        background,
        theme: 'default',
        themeDark: false
      }
    }

    function switchNetwork (newNetwork, reload) {
      let network

      if (!newNetwork) { // perform round robin
        network = storageService.getGlobal('networks')

        const keys = Object.keys(network)
        let index = keys.indexOf(storageService.getContext()) + 1
        if (index === keys.length) {
          index = 0
        }
        storageService.switchContext(keys[index])

        return window.location.reload()
      }

      storageService.switchContext(newNetwork)
      network = storageService.getGlobal('networks')

      if (!network) {
        network = {
          mainnet: createNetworkFromArkJs(mainNetArkJsNetworkKey, 0x17, 111, 'url(assets/images/images/Ark.jpg)'),
          devnet: createNetworkFromArkJs(devNetArkJsNetworkKey, 30, 1, '#222299')
        }
        storageService.setGlobal('networks', network)
      }

      if (reload) {
        return window.location.reload()
      }

      return network[newNetwork]
    }

    const tryGetPeersFromArkJs = network => {
      if (!network.arkJsKey) {
        return
      }

      const arkjsNetwork = ark.networks[network.arkJsKey]
      if (!arkjsNetwork) {
        return
      }

      return arkjsNetwork.peers
    }

    const extractHeight = response => {
      if (isV1()) {
        return response.height || response.data.height
      } else {
        return response.data.now || response.data.data.now
      }
    }

    const listenNetworkHeight = () => {
      let endpoint
      if (isV1()) {
        endpoint = '/api/blocks/getHeight'
      } else {
        endpoint = '/api/v2/node/status'
      }

      httpGet(`${currentPeer.ip}${endpoint}`).then(resp => {
        timeService.getTimestamp().then(timestamp => {
          currentPeer.lastConnection = timestamp

          if (resp.data && (resp.data.success || resp.data.data)) {
            const height = extractHeight(resp)

            if (currentPeer.height === height) {
              currentPeer.isConnected = false
              currentPeer.error = 'Node is experiencing sychronisation issues'
              connection.notify(currentPeer)
              pickRandomPeer()
            } else {
              currentPeer.height = height
              currentPeer.isConnected = true
              connection.notify(currentPeer)
            }
          } else {
            currentPeer.isConnected = false
            currentPeer.error = resp.statusText || 'Peer Timeout after 5s'
            connection.notify(currentPeer)
          }
        })
      })

      $timeout(() => listenNetworkHeight(), 60000)
    }

    const getFromPeer = api => {
      currentPeer.lastConnection = new Date()

      return new Promise((resolve, reject) => {
        httpGet(currentPeer.ip + api).then(
          response => {
            resolve(response.data)
            currentPeer.isConnected = true
            currentPeer.delay = new Date().getTime() - currentPeer.lastConnection.getTime()
            connection.notify(currentPeer)
          },
          response => {
            reject(new Error('Peer disconnected'))
            currentPeer.isConnected = false
            currentPeer.error = response.statusText || 'Peer Timeout after 5s'
            connection.notify(currentPeer)
          }
        )
      })
    }

    const pickRandomPeer = () => {
      if (network.forcepeer) {
        return
      }
      getFromPeer('/api/peers')
        .then(response => {
          if (response.success) {
            const regex127 = RegExp(/^(?!127\.).*/) // does not start with '127.'
            const peers = response.peers.filter(peer => {
              return peer.status === 'OK' && regex127.test(peer.ip)
            })
            storageService.set('peers', peers)
            findGoodPeer(peers, 0)
          } else {
            findGoodPeer(storageService.get('peers'), 0)
          }
        }, () => findGoodPeer(storageService.get('peers'), 0))
    }

    // Default ports: core-api: 4003, core-p2p: 4002 (devnet), 4001 (mainnet)
    const fixV2Peer = ip => ip.replace(':4000', ':4003').replace(':4002', ':4003')

    const findGoodPeer = (peers, index, isStaticPeerList) => {
      const isPeerListValid = () => peers && index <= peers.length - 1

      if (!isStaticPeerList && !isPeerListValid()) {
        // we don't have any peers, that means the app is probably started for the first time
        // (and therefore we do not have a peer list in our storage)
        // and getting a peer list failed (the peerseed server may be down)
        // in this case we try to get a peer from the hardcoded list in the arkjs config
        peers = tryGetPeersFromArkJs(network)
        isStaticPeerList = true
      } else if (index === 0) {
        peers = peers.sort((a, b) => b.height - a.height || a.delay - b.delay).filter(p => p.ip !== '127.0.0.1')
      }

      // check again or we may have an exception in the case when we couldn't get the static peer list from arkjs
      if (!isPeerListValid()) {
        return
      }

      currentPeer.ip = `http://${peers[index].ip}:${peers[index].port}`

      let endpoint
      if (isV1()) {
        endpoint = '/api/blocks/getHeight'
      } else {
        endpoint = '/api/v2/node/status'

        currentPeer.ip = fixV2Peer(currentPeer.ip)
      }

      getFromPeer(endpoint)
        .then(response => {
          const height = extractHeight(response)

          if ((response.success || response.data) && height < currentPeer.height) {
            findGoodPeer(peers, index + 1, isStaticPeerList)
          } else {
            currentPeer.height = height
            // if we had a static peer list, we now try to get a dynamic peer list
            // because now we know the current peer does work and we don't want to keep the hardcoded peers
            if (isStaticPeerList) {
              pickRandomPeer()
            }
          }
        }, () => findGoodPeer(peers, index + 1, isStaticPeerList))
    }

    const broadcastTransaction = (transaction, max) => {
      const peers = storageService.get('peers')
      if (!peers) {
        return
      }
      if (!max) {
        max = 10
      }
      for (let i = 0; i < max; i++) {
        if (i < peers.length) {
          let url = `http://${peers[i].ip}:${peers[i].port}`
          if (!isV1()) {
            url = fixV2Peer(url)
          }
          postTransaction(transaction, url)
        }
      }
    }

    const postTransaction = (transaction, url) => {
      let peerUrl = url
      if (!peerUrl) {
        peerUrl = currentPeer.ip
      }

      const endpoint = isV1() ? 'peer/transactions' : 'api/v2/transactions'

      return new Promise((resolve, reject) => {
        $http({
          url: `${peerUrl}/${endpoint}`,
          data: { transactions: [transaction] },
          method: 'POST',
          headers: defaultHeaders()
        }).then(({ data }) => {
          if (data.success || data.data.accept.length) {
            // We make sure that the tx is well broadcasted, but only on V1
            if (isV1() && !url) {
              broadcastTransaction(transaction)
            }
            resolve(transaction)
          } else {
            reject(data)
          }
        }, reject)
      })
    }

    listenNetworkHeight()
    pickRandomPeer()

    return {
      broadcastTransaction,
      createNetwork,
      getConnection,
      getFromPeer,
      getNetwork,
      getNetworks,
      getNetworkName,
      getPeer,
      pickRandomPeer,
      postTransaction,
      removeNetwork,
      setNetwork,
      switchNetwork
    }
  }
})()
