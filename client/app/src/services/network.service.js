;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('networkService', ['$q', '$http', '$timeout', 'storageService', 'timeService', 'toastService', NetworkService])

  /**
   * NetworkService
   * @constructor
   */
  function NetworkService ($q, $http, $timeout, storageService, timeService, toastService) {
    var network = switchNetwork(storageService.getContext())

    if (!network) {
      network = switchNetwork()
    }
    var ark = require('../node_modules/arkjs')
    ark.crypto.setNetworkVersion(network.version || 23)

    var clientVersion = require('../../package.json').version

    var peer = {
      ip: network.peerseed,
      network: storageService.getContext(),
      isConnected: false,
      height: 0,
      lastConnection: null,
      price: storageService.getGlobal('peerCurrencies') || { btc: '0.0' }
    }

    var connection = $q.defer()

    connection.notify(peer)

    function setNetwork (name, newnetwork) {
      var n = storageService.getGlobal('networks')
      n[name] = newnetwork
      storageService.setGlobal('networks', n)
    }

    function removeNetwork (name) {
      var n = storageService.getGlobal('networks')
      delete n[name]
      storageService.setGlobal('networks', n)
    }

    function createNetwork (data) {
      var n = storageService.getGlobal('networks')
      var newnetwork = data
      var deferred = $q.defer()
      if (n[data.name]) {
        deferred.reject("Network name '" + data.name + "' already taken, please choose another one")
      } else {
        $http({
          url: data.peerseed + '/api/loader/autoconfigure',
          method: 'GET',
          timeout: 5000
        }).then(
          function (resp) {
            newnetwork = resp.data.network
            newnetwork.forcepeer = data.forcepeer
            newnetwork.peerseed = data.peerseed
            newnetwork.slip44 = 1 // default to testnet slip44
            newnetwork.cmcTicker = data.cmcTicker
            n[data.name] = newnetwork
            storageService.setGlobal('networks', n)
            deferred.resolve(n[data.name])
          },
          function (resp) {
            deferred.reject('Cannot connect to peer to autoconfigure the network')
          }
        )
      }
      return deferred.promise
    }

    function switchNetwork (newnetwork, reload) {
      var n
      if (!newnetwork) { // perform round robin
        n = storageService.getGlobal('networks')
        var keys = Object.keys(n)
        var i = keys.indexOf(storageService.getContext()) + 1
        if (i === keys.length) {
          i = 0
        }
        storageService.switchContext(keys[i])
        return window.location.reload()
      }
      storageService.switchContext(newnetwork)
      n = storageService.getGlobal('networks')
      if (!n) {
        n = {
          mainnet: { // so far same as testnet
            nethash: '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988',
            peerseed: 'http://5.39.9.240:4001',
            forcepeer: false,
            token: 'ARK',
            symbol: 'Ѧ',
            version: 0x17,
            slip44: 111,
            explorer: 'https://explorer.ark.io',
            exchanges: {
              changer: 'ark_ARK'
            },
            background: 'url(assets/images/images/Ark.jpg)',
            theme: 'default',
            themeDark: false
          },
          devnet: {
            nethash: '578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23',
            peerseed: 'http://167.114.29.55:4002',
            token: 'DARK',
            symbol: 'DѦ',
            version: 30,
            slip44: 1, // all coin testnet
            explorer: 'http://dexplorer.ark.io',
            background: '#222299',
            theme: 'default',
            themeDark: false
          }
        }
        storageService.setGlobal('networks', n)
      }
      if (reload) {
        return window.location.reload()
      }
      return n[newnetwork]
    }

    function getNetwork () {
      return network
    }

    function getNetworks () {
      return storageService.getGlobal('networks')
    }

    function getPrice () {
      let failedTicker = () => {
        let lastPrice = storageService.get('lastPrice')

        if (typeof lastPrice === 'undefined') {
          peer.market = { price: { btc: '0.0' } }
          return
        }

        peer.market = lastPrice.market
        peer.market.lastUpdate = lastPrice.date
        peer.market.isOffline = true
      }

      if (!network.cmcTicker && network.token !== 'ARK') {
        failedTicker()
        return;
      }
      $http.get('https://api.coinmarketcap.com/v1/ticker/' + (network.cmcTicker || 'ARK') + '/?convert=EUR', { timeout: 2000 })
      .then(function (res) {
        if (res.data[0] && res.data[0].price_btc) {
          res.data[0].price_btc = convertToSatoshi(res.data[0].price_btc) // store BTC price in satoshi
        }
        peer.market = res.data[0]
        peer = updatePeerWithCurrencies(peer, res)
        storageService.set('lastPrice', { market: peer.market, date: new Date() })
      }, failedTicker)
      .catch(failedTicker)
      $timeout(function () {
        getPrice()
      }, 5 * 60000)
    }

    function listenNetworkHeight () {
      $http.get(peer.ip + '/api/blocks/getheight', { timeout: 5000 }).then(function (resp) {
        timeService.getTimestamp().then(
          function (timestamp) {
            peer.lastConnection = timestamp
            if (resp.data && resp.data.success) {
              if (peer.height === resp.data.height) {
                peer.isConnected = false
                peer.error = 'Node is experiencing sychronisation issues'
                connection.notify(peer)
                pickRandomPeer()
              } else {
                peer.height = resp.data.height
                peer.isConnected = true
                connection.notify(peer)
              }
            } else {
              peer.isConnected = false
              peer.error = resp.statusText || 'Peer Timeout after 5s'
              connection.notify(peer)
            }
          }
        )
      })
      $timeout(function () {
        listenNetworkHeight()
      }, 60000)
    }

    function getFromPeer (api) {
      var deferred = $q.defer()
      peer.lastConnection = new Date()
      $http({
        url: peer.ip + api,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'os': 'ark-desktop',
          'version': clientVersion,
          'port': 1,
          'nethash': network.nethash
        },
        timeout: 5000
      }).then(
        function (resp) {
          deferred.resolve(resp.data)
          peer.isConnected = true
          peer.delay = new Date().getTime() - peer.lastConnection.getTime()
          connection.notify(peer)
        },
        function (resp) {
          deferred.reject('Peer disconnected')
          peer.isConnected = false
          peer.error = resp.statusText || 'Peer Timeout after 5s'
          connection.notify(peer)
        }
      )

      return deferred.promise
    }

    function broadcastTransaction (transaction, max) {
      var peers = storageService.get('peers')
      if (!peers) {
        return
      }
      if (!max) {
        max = 10
      }
      for (var i = 0; i < max; i++) {
        if (i < peers.length) {
          postTransaction(transaction, 'http://' + peers[i].ip + ':' + peers[i].port)
        }
      }
    }

    function postTransaction (transaction, ip) {
      var deferred = $q.defer()
      var peerip = ip
      if (!peerip) {
        peerip = peer.ip
      }
      $http({
        url: peerip + '/peer/transactions',
        data: { transactions: [transaction] },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'os': 'ark-desktop',
          'version': clientVersion,
          'port': 1,
          'nethash': network.nethash
        }
      }).then(function (resp) {
        if (resp.data.success) {
          // we make sure that tx is well broadcasted
          if (!ip) {
            broadcastTransaction(transaction)
          }
          deferred.resolve(transaction)
        } else {
          deferred.reject(resp.data)
        }
      })
      return deferred.promise
    }

    function pickRandomPeer () {
      if (!network.forcepeer) {
        getFromPeer('/api/peers')
          .then((response) => {
            if (response.success) {
              getFromPeer('/api/peers/version').then(function (versionResponse) {
                if (versionResponse.success) {
                  let peers = response.peers.filter(function (peer) {
                    return peer.status === 'OK' && peer.version === versionResponse.version
                  })
                  storageService.set('peers', peers)
                  findGoodPeer(peers, 0)
                } else {
                  findGoodPeer(storageService.get('peers'), 0)
                }
              })
            } else {
              findGoodPeer(storageService.get('peers'), 0)
            }
          }, () => findGoodPeer(storageService.get('peers'), 0))
      }
    }

    function findGoodPeer (peers, index) {
      if (index > peers.length - 1) {
        // peer.ip=network.peerseed
        return
      }
      if (index === 0) {
        peers = peers.sort(function (a, b) {
          return b.height - a.height || a.delay - b.delay
        })
      }
      peer.ip = 'http://' + peers[index].ip + ':' + peers[index].port
      getFromPeer('/api/blocks/getheight')
        .then((response) => {
          if (response.success && response.height < peer.height) {
            findGoodPeer(peers, index + 1)
          } else {
            peer.height = response.height
          }
        }, () => findGoodPeer(peers, index + 1))
    }

    function getPeer () {
      return peer
    }

    function getConnection () {
      return connection.promise
    }

    function getLatestClientVersion () {
      var deferred = $q.defer()
      var url = 'https://api.github.com/repos/ArkEcosystem/ark-desktop/releases/latest'
      $http.get(url, { timeout: 5000 })
        .then(function (res) {
          deferred.resolve(res.data.tag_name)
        }, function (e) {
          // deferred.reject(gettextCatalog.getString("Cannot get latest version"))
        })
      return deferred.promise
    }

    // Returns the BTC value in satoshi
    function convertToSatoshi(val) {
      return Number(val).toFixed(8);
    }


    // Updates peer with all currency values relative to the EUR price.
    function updatePeerWithCurrencies(peer, res) {
      var currencies = ["aud", "brl", "cad", "chf", "cny", "eur", "gbp", "hkd", "idr", "inr", "jpy", "krw", "mxn", "rub", "usd"]
      var currency_request_url = createCurrencyApiCall(currencies)
      $http.get(currency_request_url, { timeout: 2000}).then( function (result) {
        const EUR_PRICE = Number(res.data[0].price_eur)
        var prices = {}
        currencies.forEach(function(currency) {
          prices[currency] = result.data.rates[currency.toUpperCase()] * EUR_PRICE
        })
        prices["btc"] = Number(res.data[0].price_btc)
        prices["eur"] = Number(EUR_PRICE)
        peer.market.price = prices
        storageService.setGlobal('peerCurrencies', prices)
      })

      return peer
    }

    function createCurrencyApiCall(currencies) {
        var get_request = 'https://api.fixer.io/latest?symbols='
        currencies.forEach(function(currency) {
            get_request += '' + currency.toUpperCase() + ','
        })
        get_request = get_request.substring(0, get_request.length-1)
        return get_request
    }

    listenNetworkHeight()
    getPrice()
    pickRandomPeer()

    return {
      switchNetwork: switchNetwork,
      setNetwork: setNetwork,
      createNetwork: createNetwork,
      removeNetwork: removeNetwork,
      getNetwork: getNetwork,
      getNetworks: getNetworks,
      getPeer: getPeer,
      getConnection: getConnection,
      getFromPeer: getFromPeer,
      postTransaction: postTransaction,
      broadcastTransaction: broadcastTransaction,
      pickRandomPeer: pickRandomPeer,
      getLatestClientVersion: getLatestClientVersion,
      getPrice: getPrice
    }
  }
})()
