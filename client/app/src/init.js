(function() {
  'use strict';

  angular.module('arkclient.filters', []);
  angular.module('arkclient.services', []);
  angular.module('arkclient.components', []);
  angular.module('arkclient.directives', []);
  angular.module('arkclient.addons', []);
  angular.module('arkclient.accounts', ['ngMaterial', 'arkclient.filters', 'arkclient.addons']);
  
})();