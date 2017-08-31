(function() {
  'use strict';

  angular.module('arkclient')
    .service('timeService', ['$http', TimeService]);

  /**
   * TimeService
   * @constructor
   */
  function TimeService($http) {
    this.getTime = function() {
      $http.get('http://date.jsontest.com/', { timeout: 2000 })
        .then(function(resp) {
          var date = new Date(Date.parse(resp.data["date"]+" "+resp.data["time"]));
          //GMT-4 New York Time
          date.setHours(date.getHours() - 4);
          return date
        }, function() {
          return new Date();
        });
    }
  }
})();
