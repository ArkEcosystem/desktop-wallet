(function () {
  'use strict';

  angular.module('arkclient.services')
    .service('pluginLoader', ['accountService', PluginLoader]);

  /**
   * pluginLoader
   * @constructor
   */
  function PluginLoader(accountService) {

    var self = this;
    var fs = require('fs');
    var path = require('path');

    const confFilename = "plugin.conf";
    const pluginFilename = "plugin.js";

    var pluginsDirectory = path.resolve(__dirname, "plugins");
    var plugins = getDirectories(pluginsDirectory);

    self.plugincontent = {};

    //load all plugin configurations
    plugins.forEach(function (element) {
      var conf = JSON.parse(readFile(path.join(pluginsDirectory, element, confFilename)));
      if (conf.enabled == "true") {
        self.plugincontent[element] = conf;
      }
    }, this);

    //on event
    self.triggerEvent = function (eventname) {
      //parse arguments and prepare for sending
      var sendargs = "";
      for (var arg = 1; arg < arguments.length; ++arg) {
        if (sendargs != "") {
          sendargs = sendargs + "," + JSON.stringify(arguments[arg]);
        } else {
          sendargs = JSON.stringify(arguments[arg]);
        }
      }
      //make callback function available for plugin
      function triggerEvent(eventname) {
        if (eventname == "getLocalAccount") {
          return accountService.getAccount(arguments[1]);
        }
      }
      //iterate over all plugins
      plugins.forEach(function (element) {
        var plugin = self.plugincontent[element];
        //if plugin has event defined in configuration
        if (plugin && plugin["events"][eventname]) {
          //read its javascript file
          var js = readFile(path.join(pluginsDirectory, element, pluginFilename));
          //run the js file and call the function with the prepared parameters
          eval(js + ";" + plugin["events"][eventname] + "(" + sendargs + ")");
        }
      }, this);

    }

    //helper functions for os operations
    function getDirectories(dir) {
      try {
        return fs.readdirSync(dir).filter(function (file) {
          var stat = fs.statSync(dir + '/' + file);
          return stat.isDirectory();
        });
      } catch (e) {
        return [];
      }
    }

    function readFile(filename) {
      var data = fs.readFileSync(filename, 'utf8');
      return data;
    }
  }
})();