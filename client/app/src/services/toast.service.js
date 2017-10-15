(function() {
  'use strict';

  angular.module('arkclient.services')
    .service('toastService', ['$mdToast', 'gettextCatalog', ToastService]);

  /**
   * ToastService
   * @constructor
   */
  function ToastService($mdToast, gettextCatalog) {
    self.TypeEnum = {
      ERROR: 0,
      SUCCESS: 1,
      WARN: 2,
      LOG: 3,
      DEBUG: 4
    }

    self.TypeName = [
      'error',
      'success',
      'warn',
      'log',
      'debug'
    ]

    self.loggingType = TypeEnum.SUCCESS;
    self.hideDelay = 5000;

    function error(message, hideDelay, stopTranslate) {
      show(message, self.TypeEnum.ERROR, hideDelay, stopTranslate);
    }

    function success(message, hideDelay, stopTranslate) {
      show(message, self.TypeEnum.SUCCESS, hideDelay, stopTranslate);
    }

    function warn(message, hideDelay, stopTranslate) {
      show(message, self.TypeEnum.WARN, hideDelay, stopTranslate);
    }

    function log(message, hideDelay, stopTranslate) {
      show(message, self.TypeEnum.LOG, hideDelay, stopTranslate);
    }

    function debug(message, hideDelay, stopTranslate) {
      show(message, self.TypeEnum.DEBUG, hideDelay, stopTranslate);
    }

    self.show = function(message, type, hideDelay, stopTranslate) {
      if (type > self.loggingType) {
        return;
      }
      var typeName = null;
      if (typeof self.TypeName[type] !== 'undefined') {
        typeName = self.TypeName[type];
      }
      if (!stopTranslate) {
        message = gettextCatalog.getString(message);
      }
      var toast = $mdToast.simple()
        .hideDelay(hideDelay || self.hideDelay)
        .textContent(message);
      if (typeName) {
        toast.theme(self.TypeName[type]);
      }
      $mdToast.show(toast);
      self.log(message, typeName)
    }

    self.log = function(message, typeName) {
      console.log((typeName ? typeName.toUpperCase() + ': ' : '') + message);
    }

    return {
      error: error,
      success: success,
      warn: warn,
      log: log,
      debug: debug
    };
  }
})();
