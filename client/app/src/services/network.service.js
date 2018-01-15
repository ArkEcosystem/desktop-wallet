;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('networkService', ['$q', '$http', '$timeout', 'storageService', 'timeService', 'toastService', NetworkService])

  /**
   * NetworkService
   * @constructor
   */
  function NetworkService ($q, $http, $timeout, storageService, timeService, toastService) {
    const _path = require('path')
    const ark = require(_path.resolve(__dirname, '../node_modules/arkjs'))
    const mainNetArkJsNetworkKey = 'ark'
    const devNetArkJsNetworkKey = 'testnet'

    let network = switchNetwork(storageService.getContext())

    if (!network) {
      network = switchNetwork()
    }
    ark.crypto.setNetworkVersion(network.version || 23)

    const momentTimezone = require('moment-timezone')
    const momentRange = require('moment-range')
    const moment = momentRange.extendMoment(momentTimezone)

    const clientVersion = require(_path.resolve(__dirname, '../../package.json')).version

    let peer = {
      ip: network.peerseed,
      network: storageService.getContext(),
      isConnected: false,
      height: 0,
      lastConnection: null,
      price: storageService.getGlobal('peerCurrencies') || { btc: '0.0' }
    }

    const connection = $q.defer()

    connection.notify(peer)

    function setNetwork (name, newnetwork) {
      const n = storageService.getGlobal('networks')
      n[name] = newnetwork
      storageService.setGlobal('networks', n)
    }

    function removeNetwork (name) {
      const n = storageService.getGlobal('networks')
      delete n[name]
      storageService.setGlobal('networks', n)
    }

    function createNetwork (data) {
      const networks = storageService.getGlobal('networks')
      const deferred = $q.defer()
      if (networks[data.name]) {
        deferred.reject("Network name '" + data.name + "' already taken, please choose another one")
      } else {
        $http({
          url: data.peerseed + '/api/loader/autoconfigure',
          method: 'GET',
          timeout: 5000
        }).then(
          (resp) => {
            const newNetwork = resp.data.network
            newNetwork.isUnsaved = true
            newNetwork.forcepeer = data.forcepeer
            newNetwork.peerseed = data.peerseed
            newNetwork.slip44 = 1 // default to testnet slip44
            newNetwork.cmcTicker = data.cmcTicker
            deferred.resolve({name: data.name, network: newNetwork})
          },
          (resp) => {
            deferred.reject('Cannot connect to peer to autoconfigure the network')
          }
        )
      }
      return deferred.promise
    }

    function switchNetwork (newnetwork, reload) {
      let n
      if (!newnetwork) { // perform round robin
        n = storageService.getGlobal('networks')
        const keys = Object.keys(n)
        let i = keys.indexOf(storageService.getContext()) + 1
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
          mainnet: createNetworkFromArkJs(mainNetArkJsNetworkKey, 0x17, 111, 'url(assets/images/images/Ark.jpg)'),
          devnet: createNetworkFromArkJs(devNetArkJsNetworkKey, 30, 1, '#222299')
        }
        storageService.setGlobal('networks', n)
      }
      if (reload) {
        return window.location.reload()
      }
      return n[newnetwork]
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
        version: version,
        slip44: slip44,
        forcepeer: false,
        background: background,
        theme: 'default',
        themeDark: false
      }
    }

    function tryGetPeersFromArkJs () {
      if (!network.arkJsKey) {
        return
      }

      const arkjsNetwork = ark.networks[network.arkJsKey]
      if (!arkjsNetwork) {
        return
      }

      return arkjsNetwork.peers
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
        return
      }

      $http.get('https://api.coinmarketcap.com/v1/ticker/' + (network.cmcTicker || 'ARK'), { timeout: 2000 })
        .then((res) => {
          if (res.data[0] && res.data[0].price_btc) {
            res.data[0].price_btc = convertToSatoshi(res.data[0].price_btc) // store BTC price in satoshi
          }
          peer.market = res.data[0]
          peer = updatePeerWithCurrencies(peer, res)
          storageService.set('lastPrice', { market: peer.market, date: new Date() })
        }, failedTicker)
        .catch(failedTicker)

      $timeout(() => {
        getPrice()
      }, 5 * 60000)
    }

    function listenNetworkHeight () {
      $http.get(peer.ip + '/api/blocks/getheight', { timeout: 5000 }).then((resp) => {
        timeService.getTimestamp().then(
          (timestamp) => {
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
      $timeout(() => {
        listenNetworkHeight()
      }, 60000)
    }

    function getFromPeer (api) {
      const deferred = $q.defer()
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
        (resp) => {
          deferred.resolve(resp.data)
          peer.isConnected = true
          peer.delay = new Date().getTime() - peer.lastConnection.getTime()
          connection.notify(peer)
        },
        (resp) => {
          deferred.reject('Peer disconnected')
          peer.isConnected = false
          peer.error = resp.statusText || 'Peer Timeout after 5s'
          connection.notify(peer)
        }
      )

      return deferred.promise
    }

    function broadcastTransaction (transaction, max) {
      const peers = storageService.get('peers')
      if (!peers) {
        return
      }
      if (!max) {
        max = 10
      }
      for (let i = 0; i < max; i++) {
        if (i < peers.length) {
          postTransaction(transaction, 'http://' + peers[i].ip + ':' + peers[i].port)
        }
      }
    }

    function postTransaction (transaction, ip) {
      const deferred = $q.defer()
      let peerip = ip
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
      }).then((resp) => {
        if (resp.data.success) {
          // we make sure that tx is well broadcasted
          if (!ip) {
            broadcastTransaction(transaction)
          }
          deferred.resolve(transaction)
        } else {
          deferred.reject(resp.data)
        }
      }, (error) => deferred.reject(error))
      return deferred.promise
    }

    function pickRandomPeer () {
      if (network.forcepeer) {
        return
      }
      getFromPeer('/api/peers')
        .then((response) => {
          if (response.success) {
            getFromPeer('/api/peers/version').then((versionResponse) => {
              if (versionResponse.success) {
                const peers = response.peers.filter((peer) => {
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

    function findGoodPeer (peers, index, isStaticPeerList) {
      const isPeerListValid = () => peers && index <= peers.length - 1

      if (!isStaticPeerList && !isPeerListValid()) {
        // we don't have any peers, that means the app is probably started for the first time
        // (and therefore we do not have a peer list in our storage)
        // and getting a peer list failed (the peerseed server may be down)
        // in this case we try to get a peer from the hardcoded list in the arkjs config
        peers = tryGetPeersFromArkJs()
        isStaticPeerList = true
      } else if (index === 0) {
        peers = peers.sort((a, b) => b.height - a.height || a.delay - b.delay)
      }

      // check again or we may have an exception in the case when we couldn't get the static peer list from arkjs
      if (!isPeerListValid()) {
        return
      }

      peer.ip = 'http://' + peers[index].ip + ':' + peers[index].port
      getFromPeer('/api/blocks/getheight')
        .then((response) => {
          if (response.success && response.height < peer.height) {
            findGoodPeer(peers, index + 1, isStaticPeerList)
          } else {
            peer.height = response.height
            // if we had a static peer list, we now try to get a dynamic peer list
            // because now we know the current peer does work and we don't want to keep the hardcoded peers
            if (isStaticPeerList) {
              pickRandomPeer()
            }
          }
        }, () => findGoodPeer(peers, index + 1, isStaticPeerList))
    }

    function getPeer () {
      return peer
    }

    function getConnection () {
      return connection.promise
    }

    function getLatestClientVersion () {
      const deferred = $q.defer()
      const url = 'https://api.github.com/repos/ArkEcosystem/ark-desktop/releases/latest'
      $http.get(url, { timeout: 5000 })
        .then((res) => {
          deferred.resolve(res.data.tag_name)
        }, (e) => {
          // deferred.reject(gettextCatalog.getString("Cannot get latest version"))
        })
      return deferred.promise
    }

    // Returns the BTC value in satoshi
    function convertToSatoshi (val) {
      return Number(val).toFixed(8)
    }

    // Updates peer with all currency values relative to the USD price.
    function updatePeerWithCurrencies (peer, res) {
      peer = updateCurrencyConversionRates(peer)
      const USD_PRICE = Number(res.data[0].price_usd)
      const currencies = ['AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'KRW', 'MXN', 'RUB']
      const prices = {}
      currencies.forEach((currency) => {
        prices[currency.toLowerCase()] = peer.market.conversionRates[currency] * USD_PRICE
      })
      prices['btc'] = res.data[0].price_btc
      prices['usd'] = res.data[0].price_usd
      storageService.setGlobal('peerCurrencies', prices)
      peer.market.price = prices
      return peer
    }

    // Updates the currency conversion rates IF necessary
    // Necessary if it isn't stored, or if the stored value is too old
    function updateCurrencyConversionRates (peer) {
      const priceObj = storageService.getGlobal('conversionRates')
      if (priceObj !== undefined && priceObj !== null) {
        peer.market.conversionRates = priceObj.rates
        let storedDateString = priceObj.date
        let storedDate = new Date(storedDateString)
        const updateCurrencies = checkToUpdateConversionRates(storedDate)
        if (updateCurrencies) {
          getConversionRatesApiCall(peer)
        }
      } else {
        getConversionRatesApiCall(peer)
      }
      return peer
    }

    // api call to get the conversion rates for currencies
    function getConversionRatesApiCall (peer) {
      const currencies = ['AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'KRW', 'MXN', 'RUB']
      const apiCall = createCurrencyConversionApiCall(currencies)
      $http.get(apiCall, {timeout: 2000}).then((result) => {
        storageService.setGlobal('conversionRates', { rates: result.data.rates, date: new Date() })
        peer.market.conversionRates = result.data.rates
      })
      return peer
    }

    // Checks if the stored time and the current time has crossed 4pm CET time
    function checkToUpdateConversionRates (storedDate) {
      storedDate = moment(storedDate.getTime()).utcOffset(60)
      const endDate = moment(new Date().getTime()).utcOffset(60)
      const API_UPDATE_HOUR = 9
      const fourPMCET = moment({year: storedDate.year(), month: storedDate.month(), day: storedDate.date(), hour: API_UPDATE_HOUR}).utcOffset(60)
      if (storedDate.hour() >= 16) {
        fourPMCET.add(1, 'day')
      }
      const range = moment.range(storedDate, endDate)
      return fourPMCET.within(range)
    }

    function createCurrencyConversionApiCall (currencies) {
      let getRequest = 'https://api.fixer.io/latest?base=USD&symbols='
      getRequest += currencies.toString()
      return getRequest
    }

    listenNetworkHeight()
    getPrice()
    pickRandomPeer()

    return {
      switchNetwork,
      setNetwork,
      createNetwork,
      removeNetwork,
      getNetwork,
      getNetworks,
      getPeer,
      getConnection,
      getFromPeer,
      postTransaction,
      broadcastTransaction,
      pickRandomPeer,
      getLatestClientVersion,
      getPrice
    }
  }
})()
