import { cloneDeep } from 'lodash'

export function create (walletApi, app) {
  return () => {
    const messages = {
      events: {},

      clear () {
        for (const eventId in this.events) {
          window.removeEventListener('message', this.events[eventId])
        }

        this.events = {}
      },

      on (action, eventCallback) {
        const eventTrigger = event => {
          if (event.data !== Object(event.data) || event.data.action !== action) {
            return
          }

          eventCallback(cloneDeep(event.data))
        }

        window.addEventListener('message', eventTrigger)
        this.events[action] = eventTrigger
      }
    }

    app.$router.beforeEach((_, __, next) => {
      messages.clear()
      next()
    })

    walletApi.messages = messages
  }
}
