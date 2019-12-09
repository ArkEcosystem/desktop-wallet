export function create (walletApi, app) {
  return () => {
    const timerArrays = {
      intervals: [],
      timeouts: [],
      timeoutWatchdog: {}
    }

    const timers = {
      clearInterval (id) {
        clearInterval(id)
        timerArrays.intervals = timerArrays.intervals.filter(interval => interval !== id)
      },

      clearTimeout (id) {
        clearTimeout(id)
        clearTimeout(timerArrays.timeoutWatchdog[id])
        delete timerArrays.timeoutWatchdog[id]
        timerArrays.timeouts = timerArrays.timeouts.filter(timeout => timeout !== id)
      },

      get intervals () {
        return timerArrays.intervals
      },

      get timeouts () {
        return timerArrays.timeouts
      },

      setInterval (method, interval, ...args) {
        const id = setInterval(function () {
          method(...args)
        }, interval)
        timerArrays.intervals.push(id)
        return id
      },

      setTimeout (method, interval, ...args) {
        const id = setTimeout(function () {
          method(...args)
        }, interval)
        timerArrays.timeouts.push(id)
        timerArrays.timeoutWatchdog[id] = setTimeout(() => timers.clearTimeout(id), interval)
        return id
      }
    }

    app.$router.beforeEach((_, __, next) => {
      for (const id of timerArrays.intervals) {
        clearInterval(id)
      }

      for (const id of timerArrays.timeouts) {
        clearTimeout(id)
        clearTimeout(timerArrays.timeoutWatchdog[id])
      }

      timerArrays.intervals = []
      timerArrays.timeouts = []
      timerArrays.timeoutWatchdog = {}
      next()
    })

    walletApi.timers = timers
  }
}
