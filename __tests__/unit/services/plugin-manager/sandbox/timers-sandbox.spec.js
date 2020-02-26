import { create as createTimersSandbox } from '@/services/plugin-manager/sandbox/timers-sandbox'

const routerNext = jest.fn()

let walletApi
let app
let sandbox

beforeEach(() => {
  const routeCallbacks = []

  walletApi = {}
  app = {
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

  sandbox = createTimersSandbox(walletApi, app)
  sandbox()
})

describe('Timers Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.timers.clearInterval).toBeTruthy()
    expect(walletApi.timers.clearTimeout).toBeTruthy()
    expect(walletApi.timers.setInterval).toBeTruthy()
    expect(walletApi.timers.setTimeout).toBeTruthy()
  })

  it('should clear timer once setTimeout executed', (done) => {
    walletApi.timers.setTimeout(() => {
      setTimeout(() => {
        expect(walletApi.timers.timeouts.length).toEqual(0)

        done()
      }, 100)
    }, 1000)
    expect(walletApi.timers.timeouts.length).toEqual(1)
  })

  it('should clear timer if clearTimeout called', (done) => {
    expect(walletApi.timers.timeouts.length).toEqual(0)
    const id = walletApi.timers.setTimeout(() => {
      throw new Error('This setTimeout call should never execute')
    }, 1000)

    walletApi.timers.setTimeout(() => {
      done()
    }, 1000)

    expect(walletApi.timers.timeouts.length).toEqual(2)
    walletApi.timers.clearTimeout(id)
    expect(walletApi.timers.timeouts.length).toEqual(1)
  })

  it('should clear timer if clearInterval called', (done) => {
    expect(walletApi.timers.intervals.length).toEqual(0)
    let counter = 0
    const id = walletApi.timers.setInterval(() => {
      counter++

      if (counter === 5) {
        walletApi.timers.clearInterval(id)
        setTimeout(() => {
          expect(walletApi.timers.intervals.length).toEqual(0)
          expect(counter).toEqual(5)
          done()
        }, 500)
      }
    }, 100)
    expect(walletApi.timers.intervals.length).toEqual(1)
  })

  it('should clear timers on route change', () => {
    walletApi.timers.setTimeout(() => {
      throw new Error('This setTimeout call will never execute')
    }, 10000)

    walletApi.timers.setInterval(() => {
      throw new Error('This setInterval call will never execute')
    }, 10000)

    expect(walletApi.timers.timeouts.length).toEqual(1)
    expect(walletApi.timers.intervals.length).toEqual(1)
    expect(app.$router.beforeEach).toHaveBeenCalledTimes(1)
    app.$router.push()
    expect(routerNext).toHaveBeenCalledTimes(1)
    expect(walletApi.timers.timeouts.length).toEqual(0)
    expect(walletApi.timers.intervals.length).toEqual(0)
  })
})
