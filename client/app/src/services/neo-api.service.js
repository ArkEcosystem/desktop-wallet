;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('neoApiService', ['$q', '$http', NeoApiService])

  function NeoApiService ($q, $http) {
    const ark = require(require('path').resolve(__dirname, '../node_modules/arkjs'))
    const baseUrl = 'https://neoscan.io/api/main_net/v1'

    /*
      returns {"unclaimed": <value>, "address":"<address>"}
    */
    function getUnClaimed (address) {
      const deferred = $q.defer()
      $http.get(baseUrl + '/get_unclaimed/' + address)
        .then(r => r.status === 200 && r.data ? deferred.resolve(r.data) : deferred.reject('Error'))
        .catch(err => deferred.reject(err))
      return deferred.promise
    }

    function doesAddressExist (address) {
      // we use the getunclaimed call, because it's fast, if the address exists (i.e. has any transactions), the address is returned
      // we check if it's a real address (and not "not found") and return the result
      return getUnClaimed(address)
        .then(r => isValidAddress(r.address))
        .catch(() => false)
    }

    function isValidAddress (address) {
      // since NEO addresses are the same as ARK addresses, we can use the ark validateAddress method ;)
      // however we have to "hardcode the version", since it's not "network dependant" (e.g. devNet has another version)
      return ark.crypto.validateAddress(address, 0x17)
    }

    return {
      doesAddressExist: doesAddressExist
    }
  }
})()
