;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('networkService', ['networkV1Service', 'networkV2Service', '$q', '$http', 'storageService', NetworkService])

  /**
   * NetworkService
   * @constructor
   */
  function NetworkService (networkV1, networkV2, $q, $http, storageService) {
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
      version: '1' // TODO
    }

    const connection = $q.defer()
    connection.notify(currentPeer)

    /* Methods */

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
          reject(`Network name "${data.name}" already taken, please choose another one`)
        } else {

          const success = response => {
            const newNetwork = response.data.network
            newNetwork.isUnsaved = true
            newNetwork.forcepeer = data.forcepeer
            newNetwork.peerseed = data.peerseed
            newNetwork.slip44 = 1 // default to testnet slip44
            newNetwork.cmcTicker = data.cmcTicker
            resolve({ name: data.name, network: newNetwork })
          }

          const request = endpoint => {
            return $http({
              url: `${data.peerseed}${endpoint}`,
              method: 'GET',
              timeout: 5000
            })
          }

          // Try V2 first and V1 as fallback
          request('/api/node/configuration').then(
            success,
            _error => {
              request('/api/loader/autoconfigure').then(
                success,
                _ => reject('Cannot connect to peer to autoconfigure the network')
              )
            })
        }
      })
    }

    const createNetworkFromArkJs = (arkJsNetworkKey, version, slip44, background) => {
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

    const isV1 = () => currentPeer.version.startsWith('1')

    const listenNetworkHeight = () => {
      if (isV1()) {
        networkV1.listenNetworkHeight(connection, network, currentPeer)
      } else {
        networkV2.listenNetworkHeight(connection, network, currentPeer)
      }
    }

    const pickRandomPeer = () => {
      if (isV1()) {
        networkV1.pickRandomPeer(connection, network, currentPeer)
      } else {
        networkV2.pickRandomPeer(connection, network, currentPeer)
      }
    }

    const getFromPeer = api => {
      if (isV1()) {
        return networkV1.getFromPeer(connection, network, currentPeer, api)
      } else {
        return networkV2.getFromPeer(connection, network, currentPeer, api)
      }
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
          postTransaction(transaction, `http://${peers[i].ip}:${peers[i].port}`)
        }
      }
    }

    const postTransaction = (transaction, url) => {
      const deferred = $q.defer()
      let peerUrl = url
      if (!peerUrl) {
        peerUrl = currentPeer.ip
      }

      const endpoint = 'peer/transactions'

      return new Promise((resolve, reject) => {
        $http({
          url: `${peerUrl}/${endpoint}`,
          data: { transactions: [transaction] },
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            os: 'ark-desktop',
            version: clientVersion,
            port: 1,
            nethash: network.nethash
          }
        }).then(response => {
          if (response.data.success) {
            // we make sure that tx is well broadcasted
            if (!url) {
              broadcastTransaction(transaction)
            }
            resolve(transaction)
          } else {
            reject(resp.data)
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
