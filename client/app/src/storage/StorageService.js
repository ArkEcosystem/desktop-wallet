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


    function switchContext(contextname){
      var temp = window.localStorage.getItem("storage-"+contextname);
      saveState();
      context = contextname;
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

    function set(key, value, forcesave){
      storage[key]=value;
      if(forcesave){
        saveState();
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
      get: get,
      set: set,
      saveState: saveState
    }
  }

})();
