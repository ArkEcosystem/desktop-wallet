export default class PluginWebsocket {
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

    const websocket = new WebSocket(url)

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
          if (event.data && event.data !== Object(event.data)) {
            result.data = event.data
          }

          if (event.origin) {
            result.origin = event.origin
          }

          if (event.timeStamp) {
            result.timestamp = event.timeStamp
          }

          if (event.wasClean) {
            result.clean = event.wasClean
          }

          eventCallback(result)
        }

        websocket.addEventListener(action, eventTrigger)
        this.events[action] = eventTrigger
      },

      send (data) {
        websocket.send(data)
      },

      getReadyState () {
        return websocket.readyState
      }
    }

    this.router.beforeEach((_, __, next) => {
      websocketEvents.clear()
      websocket.close()
      next()
    })

    return websocketEvents
  }
}
