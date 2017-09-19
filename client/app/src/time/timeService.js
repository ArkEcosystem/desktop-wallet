(function() {
  'use strict';

  angular.module('arkclient.time')
    .service('timeService', ['$q', '$http', '$interval', TimeService]);

  /**
   * TimeService
   * @constructor
   */
  function TimeService($q, $http) {


    const timeServerUrl = "http://tycho.usno.navy.mil/cgi-bin/time.pl";
    let serverLatency = 0;
    const config = {
      timeout: 2000
    };
    let localToServerTimeDiff = 0;

    /**
     * Function gets a server timestamp as to not rely on the users local clock.
     * Fallback to users local clock on failure.
     * Always returns success.
     */
    function getTimestamp() {

      const deferred = $q.defer();

      const startTime = new Date().getTime();

      $http.get(timeServerUrl, config).then(
       function(success){

         const timestamp = success.headers().date;
         const processedTimestamp = new Date(timestamp).getTime();
         const endTime = new Date().getTime();

         serverLatency = endTime - startTime;

         const computedTimestamp = processedTimestamp + serverLatency;

         const currentLocalTime = new Date().getTime();
         localToServerTimeDiff = computedTimestamp - currentLocalTime;

        deferred.resolve(computedTimestamp);
       },
       function(error){
        // use the system time instead on error
         const timestamp = new Date().getTime();

         const computedTimestamp = timestamp + localToServerTimeDiff;

         deferred.resolve(computedTimestamp);
       }
      );

      return deferred.promise;
    }


    return {
      getTimestamp: getTimestamp,
    };
  }

})();
