;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('networkService', ['networkV1Service', 'networkV2Service', NetworkService])

  /**
   * NetworkService
   * @constructor
   */
  function NetworkService (networkV1, networkV2) {
    const {
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
    } = networkV1

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
