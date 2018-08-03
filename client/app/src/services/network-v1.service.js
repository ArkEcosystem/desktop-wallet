;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('networkV1Service', ['$q', '$http', '$timeout', 'storageService', 'timeService', 'toastService', NetworkV1Service])

  /**
   * NetworkV1Service
   * @constructor
   */
  function NetworkV1Service ($q, $http, $timeout, storageService, timeService, toastService) {
    const path = require('path')
    const packageJson = require(path.resolve(__dirname, '../../package.json'))
    const clientVersion = packageJson.version

    const ark = require(path.resolve(__dirname, '../node_modules/arkjs'))

    function tryGetPeersFromArkJs (network) {
      if (!network.arkJsKey) {
        return
      }

      const arkjsNetwork = ark.networks[network.arkJsKey]
      if (!arkjsNetwork) {
        return
      }

      return arkjsNetwork.peers
    }

    function listenNetworkHeight (connection, network, currentPeer) {
      $http.get(`${currentPeer.ip}/api/blocks/getHeight`, { timeout: 5000 }).then(resp => {
        timeService.getTimestamp().then(
          timestamp => {
            currentPeer.lastConnection = timestamp
            if (resp.data && resp.data.success) {
              if (currentPeer.height === resp.data.height) {
                currentPeer.isConnected = false
                currentPeer.error = 'Node is experiencing sychronisation issues'
                connection.notify(currentPeer)
                pickRandomPeer(connection, network, currentPeer)
              } else {
                currentPeer.height = resp.data.height
                currentPeer.isConnected = true
                connection.notify(currentPeer)
              }
            } else {
              currentPeer.isConnected = false
              currentPeer.error = resp.statusText || 'Peer Timeout after 5s'
              connection.notify(currentPeer)
            }
          }
        )
      })
      $timeout(() => listenNetworkHeight(connection, network, currentPeer), 60000)
    }

    function getFromPeer (connection, network, currentPeer, api) {
      currentPeer.lastConnection = new Date()

      return new Promise((resolve, reject) => {
        $http({
          url: currentPeer.ip + api,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            os: 'ark-desktop',
            version: clientVersion,
            port: 1,
            nethash: network.nethash
          },
          timeout: 5000
        }).then(
          resp => {
            resolve(resp.data)
            currentPeer.isConnected = true
            currentPeer.delay = new Date().getTime() - currentPeer.lastConnection.getTime()
            connection.notify(currentPeer)
          },
          _ => {
            reject('Peer disconnected')
            currentPeer.isConnected = false
            currentPeer.error = resp.statusText || 'Peer Timeout after 5s'
            connection.notify(currentPeer)
          }
        )
      })
    }

    function pickRandomPeer (connection, network, currentPeer) {
      if (network.forcepeer) {
        return
      }
      getFromPeer(connection, network, currentPeer, '/api/peers')
        .then((response) => {
          if (response.success) {
            const regex127 = RegExp(/^(?!127\.).*/) // does not start with '127.'
            const peers = response.peers.filter(peer => {
              return peer.status === 'OK' && regex127.test(peer.ip)
            })
            storageService.set('peers', peers)
            findGoodPeer(connection, network, currentPeer, peers, 0)
          } else {
            findGoodPeer(connection, network, currentPeer, storageService.get('peers'), 0)
          }
        }, () => findGoodPeer(connection, network, currentPeer, storageService.get('peers'), 0))
    }

    function findGoodPeer (connection, network, currentPeer, peers, index, isStaticPeerList) {
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

      currentPeer.ip = 'http://' + peers[index].ip + ':' + peers[index].port
      getFromPeer(connection, network, currentPeer, '/api/blocks/getHeight')
        .then((response) => {
          if (response.success && response.height < currentPeer.height) {
            findGoodPeer(connection, network, currentPeer, peers, index + 1, isStaticPeerList)
          } else {
            currentPeer.height = response.height
            // if we had a static peer list, we now try to get a dynamic peer list
            // because now we know the current peer does work and we don't want to keep the hardcoded peers
            if (isStaticPeerList) {
              pickRandomPeer(connection, network, currentPeer)
            }
          }
        }, () => findGoodPeer(connection, network, currentPeer, peers, index + 1, isStaticPeerList))
    }

    return {
      getFromPeer,
      listenNetworkHeight,
      pickRandomPeer
    }
  }
})()
