;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('networkService', ['networkV1Service', 'networkV2Service', '$http', 'storageService', NetworkService])

  /**
   * NetworkService
   * @constructor
   */
  function NetworkService (networkV1, networkV2, $http, storageService) {
    const {
      switchNetwork,
      setNetwork,
      createNetwork,
      getNetwork,
      getPeer,
      getConnection,
      getFromPeer,
      postTransaction,
      broadcastTransaction,
      pickRandomPeer,
    } = networkV1


    const getNetworkName = () => storageService.getContext()
    const getNetworks = () => storageService.getGlobal('networks')

    const removeNetwork = (name) => {
      const networks = storageService.getGlobal('networks')
      delete networks[name]
      storageService.setGlobal('networks', networks)
      storageService.deleteState()
    }

    const getLatestClientVersion = () => {
      return new Promise((resolve, reject) => {
        const url = 'https://api.github.com/repos/ArkEcosystem/ark-desktop/releases/latest'
        $http.get(url, { timeout: 5000 })
          .then(
            res => resolve(res.data.tag_name),
            _error => {}// reject(gettextCatalog.getString("Cannot get latest version"))
          )
      })
    }

    return {
      switchNetwork,
      setNetwork,
      createNetwork,
      removeNetwork,
      getNetwork,
      getNetworkName,
      getNetworks,
      getPeer,
      getConnection,
      getFromPeer,
      postTransaction,
      broadcastTransaction,
      pickRandomPeer,
      getLatestClientVersion
    }
  }
})()
