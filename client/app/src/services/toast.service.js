;(function () {
  'use strict'

  var fs = require('fs')

  angular.module('arkclient.services')
    .service('toastService', ['configService', '$mdToast', 'gettextCatalog', ToastService])

  /**
   * ToastService
   * @constructor
   */
  function ToastService (configService, $mdToast, gettextCatalog) {
    var self = this

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

    self.logFile = configService.getByGroupAndKey('notice', 'logFile')
    self.loggingType = configService.getByGroupAndKey('notice', 'level')
    self.hideDelay = configService.getByGroupAndKey('notice', 'defaultHideDelay')
    self.fileStream = null

    function error (message, hideDelay, stopTranslate) {
      self.show(message, self.TypeEnum.ERROR, hideDelay, stopTranslate)
    }

    function success (message, hideDelay, stopTranslate) {
      self.show(message, self.TypeEnum.SUCCESS, hideDelay, stopTranslate)
    }

    function warn (message, hideDelay, stopTranslate) {
      self.show(message, self.TypeEnum.WARN, hideDelay, stopTranslate)
    }

    function log (message, hideDelay, stopTranslate) {
      self.show(message, self.TypeEnum.LOG, hideDelay, stopTranslate)
    }

    function debug (message, hideDelay, stopTranslate) {
      self.show(message, self.TypeEnum.DEBUG, hideDelay, stopTranslate)
    }

    self.show = function (message, type, hideDelay, stopTranslate) {
      var typeName = null
      if (typeof self.TypeName[type] !== 'undefined') {
        typeName = self.TypeName[type]
      }
      if (!stopTranslate) {
        message = gettextCatalog.getString(message)
      }
      if (type > self.loggingType) {
        self.logToFile(message, typeName)
        return
      }
      var toast = $mdToast.simple()
        .hideDelay(hideDelay || self.hideDelay)
        .textContent(message)
      if (typeName) {
        toast.theme(typeName)
      }
      $mdToast.show(toast)
      self.logToFile(message, typeName)
    }

    self.logToFile = function (message, typeName) {
      if (!self.logFile) {
        return
      }
      self.fileStream = self.fileStream || fs.createWriteStream('logs/ark.log', {flags: 'a+'})
      if (!self.fileStream) {
        return
      }

      typeName = (typeName || '').toUpperCase()
      var date = new Date().toISOString()
      self.fileStream.write(
        `[${date}] ${typeName}: ${message}\n`
      )
    }

    return {
      error: error,
      success: success,
      warn: warn,
      log: log,
      debug: debug
    }
  }
})()
