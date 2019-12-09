class PluginWebsocket {
  constructor (whitelist, router) {
    this.whitelist = []
    this.router = router

    if (Array.isArray(whitelist)) {
      this.whitelist = whitelist.map(regex => {
        return new RegExp(regex)
      })
    }
  }

  validateUrl (url) {
    let valid = false
    for (const regex of this.whitelist) {
      if (regex.test(url)) {
        valid = true
        break
      }
    }

    if (!valid) {
      throw new Error(`URL "${url}" not allowed`)
    }
  }

  connect (url) {
    this.validateUrl(url)

    let websocket = new WebSocket(url)

    const websocketEvents = {
      events: [],

      clear () {
        for (const eventId in this.events) {
          websocket.removeEventListener(eventId, this.events[eventId])
        }
        this.events = []
      },

      on (action, eventCallback) {
        const eventTrigger = event => {
          const result = {}
          if (event.data) {
            result.data = event.data
          }

          if (event.origin) {
            result.origin = event.origin
          }

          if (event.wasClean !== undefined) {
            result.clean = event.wasClean
          }

          result.timestamp = event.timeStamp

          eventCallback(result)
        }

        websocket.addEventListener(action, eventTrigger)
        this.events[action] = eventTrigger
      },

      get binaryType () {
        return websocket && websocket.binaryType
      },

      set binaryType (type) {
        websocket.binaryType = type
      },

      close () {
        websocket.close()
      },

      destroy () {
        if (websocket) {
          if (!websocketEvents.isClosing() && !websocketEvents.isClosed()) {
            websocket.close()
          }
          websocketEvents.clear()
        }
        websocket = null
      },

      send (data) {
        websocket.send(data)
      },

      isConnecting () {
        return websocket && websocket.readyState === WebSocket.CONNECTING
      },

      isDestroyed () {
        return websocket === null
      },

      isOpen () {
        return websocket && websocket.readyState === WebSocket.OPEN
      },

      isClosing () {
        return websocket && websocket.readyState === WebSocket.CLOSING
      },

      isClosed () {
        return websocket && websocket.readyState === WebSocket.CLOSED
      }
    }

    this.router.beforeEach((_, __, next) => {
      websocketEvents.destroy()
      next()
    })

    return websocketEvents
  }
}

export function create (walletApi, app, plugin) {
  return () => {
    walletApi.websocket = new PluginWebsocket(plugin.config.urls, app.$router)
  }
}
