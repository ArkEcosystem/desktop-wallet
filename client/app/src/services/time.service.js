;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('timeService', ['$http', '$interval', TimeService])

  /**
   * TimeService
   * @constructor
   */
  function TimeService ($q, $http) {
    const { getNetworkTime } = require('@destinationstransfers/ntp')

    const config = {
      servers: [
        'pool.ntp.org',
        'time.google.com'
      ],
      timeout: 2000
    }

    // This value could be used to estimate the timestamp when the NPT servers fail
    let localToServerTimeDiff = 0

    /**
     * Function gets a server timestamp as to not rely on the users local clock.
     * Fallback to users local clock on failure.
     * Always returns success.
     */
    function getTimestamp () {
      return new Promise((resolve, reject) => {
        const startTime = new Date().getTime()

        const request = config.servers.map(server => {
          return getNetworkTime({ timeout: config.timeout, server })
        })

        Promise.race(request).then(
          date => {
            const processedTimestamp = date.getTime()
            const endTime = new Date().getTime()
            const serverLatency = endTime - startTime

            const computedTimestamp = processedTimestamp + serverLatency

            const currentLocalTime = new Date().getTime()
            localToServerTimeDiff = computedTimestamp - currentLocalTime

            resolve(computedTimestamp)
          },
          _error => {
            // Use the system time instead on error
            const timestamp = new Date().getTime()

            const computedTimestamp = timestamp + localToServerTimeDiff

            resolve(computedTimestamp)
          }
        )
      })
    }

    return {
      getTimestamp
    }
  }
})()
