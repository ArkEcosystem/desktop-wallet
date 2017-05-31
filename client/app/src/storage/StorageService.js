(function(){
  'use strict';

  angular.module('arkclient')
         .service('storageService', [ StorageService]);

  /**
   * NetworkService
   * @constructor
   */
  function StorageService(){

    var storage = {};
    var context = window.localStorage.getItem("context");
    if(!context){
      context="mainnet";
      window.localStorage.setItem("context",context);
    }
    else{
      switchContext(context);
    }

    /* [begin] Window size */
    var win = remote.getCurrentWindow();
    var winBounds = getGlobal('winBounds');
    var to = null;
    
    if(typeof winBounds === 'object')
        win.setBounds(winBounds);

    window.addEventListener('resize', function(e) {
      e.preventDefault();
      clearTimeout(to);
      to = setTimeout(function() {
          setGlobal('winBounds', win.getBounds());
      }, 1000);
    });
    /* [end] Window size */

    function getContext(){
      return context;
    }

    function switchContext(contextname){
      var temp = window.localStorage.getItem("storage-"+contextname);
      saveState();
      context = contextname;
      window.localStorage.setItem("context",context);
      if(!temp){
        storage={};
      }
      else {
        storage = JSON.parse(temp);
      }
      saveState();
      return context;
    }

    function get(key){
      return storage[key];
    }

    function getGlobal(key){
      return JSON.parse(window.localStorage.getItem("global-"+key));
    }

    function set(key, value, forcesave){
      if(!value){
        delete storage[key];
      }
      else{
        storage[key]=value;
      }
      if(forcesave){
        saveState();
      }
      return value;
    }

    function setGlobal(key, value){
      if(!value){
        window.localStorage.removeItem("global-"+key);
      }
      else{
        window.localStorage.setItem("global-"+key,JSON.stringify(value));
      }
      return value;
    }

    function saveState(){
      window.localStorage.setItem("storage-"+context, JSON.stringify(storage));
      window.localStorage.setItem("lastsaved", JSON.stringify(new Date()));
    }

    setInterval(
      function(){
        saveState();
      },
      10000
    );

    return {
      switchContext: switchContext,
      getContext: getContext,
      get: get,
      set: set,
      getGlobal: getGlobal,
      setGlobal: setGlobal,
      saveState: saveState
    };
  }

})();
