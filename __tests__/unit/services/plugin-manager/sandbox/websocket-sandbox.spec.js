import { Server } from 'mock-socket'
import { create as createWebsocketSandbox } from '@/services/plugin-manager/sandbox/websocket-sandbox'

const whitelist = [
  /* eslint-disable: no-useless-escape */
  '^ws:\\/\\/.*\\.test\\.com:8080$'
]
const host = 'ws://my.test.com:8080'

const plugin = {
  config: {
    urls: whitelist
  }
}

let app
let sandbox
let walletApi

let pongMock
let mockServer
let routerNext

beforeEach(() => {
  if (mockServer) {
    mockServer.stop()
  }

  pongMock = jest.fn(data => {
    if (data === 'ping') {
      mockServer.emit('pong', true)
    }
  })

  mockServer = new Server(host)
  mockServer.on('connection', socket => {
    mockServer.emit('data', 'test')
    socket.on('message', pongMock)
  })
  mockServer.on('message', () => {
    mockServer.emit('data', 'test')
  })

  const routeCallbacks = []
  routerNext = jest.fn()

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

  sandbox = createWebsocketSandbox(walletApi, app, plugin)
  sandbox()
})

describe('PluginWebsocket', () => {
  it('should expose functions', () => {
    expect(walletApi.websocket).toBeTruthy()
  })

  it('should connect to websocket', (done) => {
    const socket = walletApi.websocket.connect(host)
    expect(socket.isConnecting()).toBeTrue()

    setTimeout(() => {
      expect(socket.isOpen()).toBeTrue()

      done()
    }, 100)
  })

  it('should connect to websocket and receive data', (done) => {
    const socket = walletApi.websocket.connect(host)

    socket.on('data', (event) => {
      expect(event.data).toEqual('test')
      expect(event.origin).toEqual('ws://my.test.com:8080/')
      expect(event.timestamp).toBeTruthy()
      done()
    })
  })

  it('should connect to websocket and send data', (done) => {
    const socket = walletApi.websocket.connect(host)

    socket.on('pong', (event) => {
      expect(pongMock).toHaveBeenCalledWith('ping')
      expect(event.data).toEqual('true')
      expect(event.origin).toEqual('ws://my.test.com:8080/')
      expect(event.timestamp).toBeTruthy()

      done()
    })
    socket.send('ping')
  })

  it('should change the binary type to arraybuffer', () => {
    const socket = walletApi.websocket.connect(host)

    socket.binaryType = 'arraybuffer'
    expect(socket.binaryType).toBe('arraybuffer')
  })

  it('should close the websocket', (done) => {
    const socket = walletApi.websocket.connect(host)

    setTimeout(() => {
      expect(socket.isOpen()).toBeTrue()
      socket.close()
      expect(socket.isClosing()).toBeTrue()
      setTimeout(() => {
        expect(socket.isClosed()).toBeTrue()
      }, 500)
    }, 500)

    socket.on('close', (event) => {
      expect(event.clean).toBeFalse()
      expect(event.timestamp).toBeTruthy()
      done()
    })
  })

  it('should reset websockets on route change', () => {
    const socket = walletApi.websocket.connect(host)

    socket.on('pong', jest.fn())

    expect(socket.events.pong).toBeTruthy()
    expect(app.$router.beforeEach).toHaveBeenCalledTimes(1)
    app.$router.push()
    expect(routerNext).toHaveBeenCalledTimes(1)
    expect(socket.events.length).toEqual(0)
  })

  it('should not connect to websocket', (done) => {
    const socket = walletApi.websocket.connect('ws://failure.test.com:8080')

    setTimeout(() => {
      expect(socket.isClosed()).toBeTrue()

      done()
    }, 500)
  })

  it('should not connect to websocket due to whitelist', () => {
    expect(() => {
      walletApi.websocket.connect('ws://my.test.com:8081')
    }).toThrow('URL "ws://my.test.com:8081" not allowed')
  })

  it('should destroy the socket', () => {
    const socket = walletApi.websocket.connect(host)
    socket.destroy()
    expect(socket.isDestroyed()).toBeTrue()
  })

  it('should ignore an invalid whitelist', () => {
    expect(() => {
      const api = {}
      createWebsocketSandbox(api, app, {
        config: {
          url: 'not a whitelist'
        }
      })()
      api.websocket.connect('ws://my.test.com:8081')
    }).toThrow('URL "ws://my.test.com:8081" not allowed')
  })
})
