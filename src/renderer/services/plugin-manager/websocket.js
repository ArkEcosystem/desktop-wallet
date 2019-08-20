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
          eventCallback({
            ...(event.data && event.data !== Object(event.data) && { data: event.data }),
            ...(event.origin && { origin: event.origin }),
            ...(event.timeStamp && { timestamp: event.timeStamp }),
            ...(event.wasClean && { clean: event.wasClean })
          })
        }
        websocket.addEventListener(action, eventTrigger)
        this.events[action] = eventTrigger
      },
      send (data) {
        websocket.send(data)
      },
      readyState: websocket.readyState
    }

    this.router.beforeEach((_, __, next) => {
      websocketEvents.clear()
      websocket.close()
      next()
    })

    return websocketEvents
  }
}
