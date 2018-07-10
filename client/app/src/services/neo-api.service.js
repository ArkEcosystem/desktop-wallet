;(function () {
  'use strict'

  /**
   * Example of NEO address with transactions: AYJXuFBfUyELoTe3wXEzPkq5RcsHsF58uW
   */
  angular.module('arkclient.services')
    .service('neoApiService', ['$q', '$http', NeoApiService])

  function NeoApiService ($q, $http) {
    const baseUrl = 'https://neoscan.io/api/main_net/v1'

    function getTxs (address) {
      return new Promise((resolve, reject) => {
        $http.get(`${baseUrl}/get_last_transactions_by_address/${address}`)
          .then(({ data }) => {
            Array.isArray(data) && data.length ? resolve() : reject(new Error('Empty NEO address'))
          })
          .catch(reject)
      })
    }

    function doesAddressExist (address) {
      return getTxs(address)
        .then(_ => true)
        .catch(() => false)
    }

    return {
      doesAddressExist
    }
  }
})()
