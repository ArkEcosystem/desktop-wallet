;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('configService', [ConfigService])

  /**
   * ConfigService
   * @constructor
   */
  function ConfigService () {
    this.config = require(require('path').resolve(__dirname, './config/config.js'))

    const getByGroup = group => {
      if (this.config[group]) {
        return this.config[group]
      }

      return null
    }

    const getByGroupAndKey = (group, key) => {
      if (this.config[group] && this.config[group][key]) {
        return this.config[group][key]
      }

      return null
    }

    return {
      getByGroup,
      getByGroupAndKey
    }
  }
})()
