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
      pickRandomPeer
    }
  }
})()
