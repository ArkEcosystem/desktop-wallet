;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('configService', [ConfigService])

  /**
   * ConfigService
   * @constructor
   */
  function ConfigService () {
    var self = this

    self.config = require('./config/config.js')

    function getByGroup (group) {
      if (self.config[group]) {
        return self.config[group]
      }

      return null
    }

    function getByGroupAndKey (group, key) {
      if (self.config[group] && self.config[group][key]) {
        return self.config[group][key]
      }

      return null
    }

    return {
      getByGroup: getByGroup,
      getByGroupAndKey: getByGroupAndKey
    }
  }
})()
