;(function () {
  'use strict'

  angular.module('arkclient.constants')
    // 1 ARK has 100000000 "arktoshi"
    .constant('ARKTOSHI_UNIT', Math.pow(10, 8))
    .constant('TRANSACTION_TYPES', {
      'SEND_ARK': 0,
      'CREATE_SECOND_PASSPHRASE': 1,
      'CREATE_DELEGATE': 2,
      'VOTE': 3
    })
})()
