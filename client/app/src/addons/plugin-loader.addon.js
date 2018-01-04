;(function () {
  'use strict'

  angular.module('arkclient.addons')
    .service('pluginLoader', ['accountService', PluginLoader])

  /**
   * pluginLoader
   * @constructor
   */
  function PluginLoader (accountService) {
    const self = this
    const fs = require('fs')
    const path = require('path')

    const confFilename = 'plugin.conf'
    const pluginFilename = 'plugin.js'

    const pluginsDirectory = path.resolve(__dirname, 'plugins')
    const plugins = getDirectories(pluginsDirectory)

    self.plugincontent = {}

    // load all plugin configurations
    plugins.forEach(function (element) {
      const conf = JSON.parse(readFile(path.join(pluginsDirectory, element, confFilename)))
      if (conf.enabled === 'true') {
        self.plugincontent[element] = conf
      }
    }, this)

    // on event
    self.triggerEvent = function (eventname) {
      // parse arguments and prepare for sending
      let sendargs = ''
      for (let arg = 1; arg < arguments.length; ++arg) {
        if (sendargs !== '') {
          sendargs = sendargs + ',' + JSON.stringify(arguments[arg])
        } else {
          sendargs = JSON.stringify(arguments[arg])
        }
      }
      // make callback function available for plugin
      function triggerEvent (eventname) { // eslint-disable-line no-unused-vars
        if (eventname === 'getLocalAccount') {
          return accountService.getAccount(arguments[1])
        }
      }
      // iterate over all plugins
      plugins.forEach(function (element) {
        const plugin = self.plugincontent[element]
        // if plugin has event defined in configuration
        if (plugin && plugin['events'][eventname]) {
          // read its javascript file
          const js = readFile(path.join(pluginsDirectory, element, pluginFilename))
          // run the js file and call the function with the prepared parameters
          // NOTE this is DANGEROUS!
          eval(js + ';' + plugin['events'][eventname] + '(' + sendargs + ')') // eslint-disable-line no-eval
        }
      }, this)
    }

    // helper functions for os operations
    function getDirectories (dir) {
      try {
        return fs.readdirSync(dir).filter(function (file) {
          const stat = fs.statSync(dir + '/' + file)
          return stat.isDirectory()
        })
      } catch (e) {
        return []
      }
    }

    function readFile (filename) {
      const data = fs.readFileSync(filename, 'utf8')
      return data
    }
  }
})()
