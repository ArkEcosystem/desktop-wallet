;(function () {
  'use strict'

  angular.module('arkclient.constants')
    // 1 ARK has 100000000 "arktoshi"
    .constant('ARKTOSHI_UNIT', Math.pow(10, 8))

  angular.module('arkclient.constants')
     // all ark timestamps start at 2017/3/21 13:00
    .constant('ARK_LAUNCH_DATE', new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0)))
})()
