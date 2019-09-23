import PluginManager from '@/services/plugin-manager'

const routerNext = jest.fn()
let router
let sandboxWithTimers
let sandboxWithoutTimers

beforeEach(() => {
  const routeCallbacks = []
  PluginManager.app = {
    $router: {
      beforeEach: jest.fn(callback => {
        routeCallbacks.push(callback)
      }),

      push () {
        for (const callback of routeCallbacks) {
          callback(null, null, routerNext)
        }
      }
    }
  }
  router = PluginManager.app.$router

  sandboxWithTimers = PluginManager.loadSandbox({ permissions: ['TIMERS'] })
  sandboxWithoutTimers = PluginManager.loadSandbox({ permissions: [] })
})

describe('Timers', () => {
  it('should not expose functions without TIMERS permission', () => {
    expect(sandboxWithoutTimers.walletApi.timers).toEqual(undefined)
  })

  it('should expose functions with TIMERS permission', () => {
    expect(sandboxWithTimers.walletApi.timers.clearInterval).toBeTruthy()
    expect(sandboxWithTimers.walletApi.timers.clearTimeout).toBeTruthy()
    expect(sandboxWithTimers.walletApi.timers.setInterval).toBeTruthy()
    expect(sandboxWithTimers.walletApi.timers.setTimeout).toBeTruthy()
  })

  it('should clear timer once setTimeout executed', (done) => {
    sandboxWithTimers.walletApi.timers.setTimeout(() => {
      console.log('This is an execution of setTimeout')
      setTimeout(() => {
        expect(sandboxWithTimers.walletApi.timers.timeouts.length).toEqual(0)

        done()
      }, 100)
    }, 1000)
    expect(sandboxWithTimers.walletApi.timers.timeouts.length).toEqual(1)
  })

  it('should clear timer if clearTimeout called', (done) => {
    expect(sandboxWithTimers.walletApi.timers.timeouts.length).toEqual(0)
    const id = sandboxWithTimers.walletApi.timers.setTimeout(() => {
      console.log('This setTimeout call will never execute')
    }, 1000)
    sandboxWithTimers.walletApi.timers.setTimeout(() => {
      console.log('This is an execution of setTimeout')

      done()
    }, 1000)
    expect(sandboxWithTimers.walletApi.timers.timeouts.length).toEqual(2)
    sandboxWithTimers.walletApi.timers.clearTimeout(id)
    expect(sandboxWithTimers.walletApi.timers.timeouts.length).toEqual(1)
  })

  it('should clear timer if clearInterval called', (done) => {
    expect(sandboxWithTimers.walletApi.timers.intervals.length).toEqual(0)
    let counter = 0
    const id = sandboxWithTimers.walletApi.timers.setInterval(() => {
      counter++
      console.log(`This is execution #${counter} of setInterval`)
      if (counter === 5) {
        sandboxWithTimers.walletApi.timers.clearInterval(id)
        setTimeout(() => {
          expect(sandboxWithTimers.walletApi.timers.intervals.length).toEqual(0)
          expect(counter).toEqual(5)
          done()
        }, 500)
      }
    }, 100)
    expect(sandboxWithTimers.walletApi.timers.intervals.length).toEqual(1)
  })

  it('should clear timers on route change', () => {
    sandboxWithTimers.walletApi.timers.setTimeout(() => {
      console.log('This setTimeout call will never execute')
    }, 10000)

    sandboxWithTimers.walletApi.timers.setInterval(() => {
      console.log('This setInterval call will never execute')
    }, 10000)

    expect(sandboxWithTimers.walletApi.timers.timeouts.length).toEqual(1)
    expect(sandboxWithTimers.walletApi.timers.intervals.length).toEqual(1)
    expect(router.beforeEach).toHaveBeenCalledTimes(1)
    router.push()
    expect(routerNext).toHaveBeenCalledTimes(1)
    expect(sandboxWithTimers.walletApi.timers.timeouts.length).toEqual(0)
    expect(sandboxWithTimers.walletApi.timers.intervals.length).toEqual(0)
  })
})
