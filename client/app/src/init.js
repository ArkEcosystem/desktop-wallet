;(function () {
  'use strict'

  angular.module('arkclient.filters', [])
  angular.module('arkclient.services', ['ngMaterial'])
  angular.module('arkclient.directives', [])
  angular.module('arkclient.accounts', ['ngMaterial', 'arkclient.services', 'arkclient.filters', 'arkclient.addons'])
  angular.module('arkclient.components', ['gettext', 'ngMaterial', 'arkclient.services', 'arkclient.accounts'])
  angular.module('arkclient.addons', [])
  angular.module('arkclient.constants', [])
})()
