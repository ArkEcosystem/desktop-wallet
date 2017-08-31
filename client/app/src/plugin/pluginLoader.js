(function() {
  'use strict';

  angular.module('arkclient')
    .service('pluginLoader', ['accountService', PluginLoader]);

  /**
   * pluginLoader
   * @constructor
   */
  function PluginLoader(accountService) {

    var self = this;
    var fs = require('fs')
    var plugins = getDirectories("./plugins")
    
    self.plugincontent = {}
    
    //load all plugin configurations
    plugins.forEach(function(element) {
        var conf = JSON.parse(readFile("./plugins/"+element+"/plugin.conf"));
        self.plugincontent[element] = conf;
    }, this);
    
    //on event
    self.triggerEvent = function(eventname)
    {
        //parse arguments and prepare for sending
        var sendargs = "";
        for(var arg = 1; arg < arguments.length; ++ arg)
        {
            if(sendargs != "")
            {
                sendargs = sendargs +","+ JSON.stringify(arguments[arg]);
            }
            else
            {
                sendargs = JSON.stringify(arguments[arg]);
            }
        }
        //make callback function available for plugin
        function triggerEvent(eventname)
        {
            if(eventname == "getLocalAccount")
            {
                return accountService.getAccount(arguments[1]);
            }
        }
        //iterate over all plugins
        plugins.forEach(function(element) {
            //if plugin has event defined in configuration
            if(self.plugincontent[element]["events"][eventname])
            {
                //read its javascript file
                var js = readFile("./plugins/"+element+"/plugin.js");
                //run the js file and call the function with the prepared parameters
                eval(js+";"+self.plugincontent[element]["events"][eventname]+"("+sendargs+")");
            }
        }, this);
        
    }
    //helper functions for os operations
    function getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path+'/'+file).isDirectory();
        });}
    function readFile(filename) {
        var data = fs.readFileSync(filename, 'utf8');
        return data;}
}
})();