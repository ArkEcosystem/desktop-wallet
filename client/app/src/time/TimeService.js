(function() {
  'use strict';

  angular.module('arkclient')
    .service('timeService', [TimeService]);

  /**
   * TimeService
   * @constructor
   */
  function TimeService() {
    function __getJSON(url) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          var status = xhr.status;
          if (status == 200) {
            resolve(xhr.response);
          } else {
            reject(status);
          }
        };
        xhr.send();
      });
    };
    this.getTime = function() {
      __getJSON('http://date.jsontest.com/').then(function(data) 
      {
        return new Date(Date.parse(data["date"]+" "+data["time"]));
      });
    }
  }
})();
