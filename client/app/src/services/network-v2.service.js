;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('networkV2Service', ['$q', '$http', '$timeout', 'storageService', 'timeService', 'toastService', NetworkV2Service])

  /**
   * NetworkV2Service
   * @constructor
   */
  function NetworkV2Service ($q, $http, $timeout, storageService, timeService, toastService) {
    return {
    }
  }
})()
