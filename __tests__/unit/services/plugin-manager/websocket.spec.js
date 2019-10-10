import { Server } from 'mock-socket'
import PluginWebsocket from '@/services/plugin-manager/websocket'

const whitelist = [
  /* eslint-disable: no-useless-escape */
  '^ws:\\/\\/.*\\.test\\.com:8080$'
]
const host = 'ws://my.test.com:8080'

let pongMock
let mockServer
let router
let routerNext
let pluginWebsocket
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
  mockServer.on('message', socket => {
    mockServer.emit('data', 'test')
  })

  const routeCallbacks = []
  routerNext = jest.fn()
  router = {
    beforeEach: jest.fn(callback => {
      routeCallbacks.push(callback)
    }),

    push () {
      for (const callback of routeCallbacks) {
        callback(null, null, routerNext)
      }
    }
  }

  pluginWebsocket = new PluginWebsocket(whitelist, router)
})

describe('PluginWebsocket', () => {
  it('should connect to websocket', (done) => {
    const socket = pluginWebsocket.connect(host)
    expect(socket.isConnecting()).toBeTrue()

    setTimeout(() => {
      expect(socket.isOpen()).toBeTrue()

      done()
    }, 100)
  })

  it('should connect to websocket and receive data', (done) => {
    const socket = pluginWebsocket.connect(host)

    socket.on('data', (event) => {
      expect(event.data).toEqual('test')
      expect(event.origin).toEqual('ws://my.test.com:8080/')
      expect(event.timestamp).toBeTruthy()
      done()
    })
  })

  it('should connect to websocket and send data', (done) => {
    const socket = pluginWebsocket.connect(host)

    socket.on('pong', (event) => {
      expect(pongMock).toHaveBeenCalledWith('ping')
      expect(event.data).toEqual('true')
      expect(event.origin).toEqual('ws://my.test.com:8080/')
      expect(event.timestamp).toBeTruthy()

      done()
    })
    socket.send('ping')
  })

  it('should close the websocket', (done) => {
    const socket = pluginWebsocket.connect(host)

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
    const socket = pluginWebsocket.connect(host)

    socket.on('pong', jest.fn())

    expect(socket.events.pong).toBeTruthy()
    expect(router.beforeEach).toHaveBeenCalledTimes(1)
    router.push()
    expect(routerNext).toHaveBeenCalledTimes(1)
    expect(socket.events.length).toEqual(0)
  })

  it('should not connect to websocket', (done) => {
    const socket = pluginWebsocket.connect('ws://failure.test.com:8080')

    setTimeout(() => {
      expect(socket.isClosed()).toBeTrue()

      done()
    }, 500)
  })

  it('should not connect to websocket due to whitelist', () => {
    expect(() => {
      pluginWebsocket.connect('ws://my.test.com:8081')
    }).toThrow('URL "ws://my.test.com:8081" not allowed')
  })

  it('should ignore an invalid whitelist', () => {
    expect(() => {
      pluginWebsocket = new PluginWebsocket('not a whitelist', router)
      pluginWebsocket.connect('ws://my.test.com:8081')
    }).toThrow('URL "ws://my.test.com:8081" not allowed')
  })
})
