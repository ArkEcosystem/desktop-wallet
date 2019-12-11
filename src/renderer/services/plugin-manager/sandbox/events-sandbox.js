class PluginEvents {
  constructor (eventBus) {
    this.events = {}
    this.eventBus = eventBus
  }

  on (criteria, action) {
    if (!this.events[criteria]) {
      this.events[criteria] = []
    }

    if (typeof criteria.test === 'function') {
      action = this.__parseAction(criteria, action)
      this.eventBus.onAny(action)
    } else {
      this.eventBus.on(criteria, action)
    }
    this.events[criteria].push(action)
  }

  off (criteria, action, forceRegex = false) {
    if (typeof criteria.test === 'function') {
      action = this.__parseAction(criteria, action)
    }

    let index = -1
    for (const actionIndex in this.events[criteria]) {
      if (this.events[criteria][actionIndex].toString() === action.toString()) {
        index = actionIndex

        break
      }
    }

    if (index > -1) {
      action = this.events[criteria][index]
      if (forceRegex || typeof criteria.test === 'function') {
        this.eventBus.offAny(action)
      } else {
        this.eventBus.off(criteria, action)
      }

      this.events[criteria] = [
        ...this.events[criteria].slice(0, index),
        ...this.events[criteria].slice(index + 1)
      ]
    }
  }

  destroy () {
    for (const criteria of Object.keys(this.events)) {
      let isRegex = false
      if (/^\/.+\/\w?$/.test(criteria)) {
        isRegex = true
      }

      for (const action of Object.values(this.events[criteria])) {
        this.off(criteria, action, isRegex)
      }
    }
  }

  __parseAction (criteria, action) {
    return (eventName, data) => {
      if (criteria && criteria.test(eventName)) {
        action(data)
      }
    }
  }
}

export function create (walletApi, app) {
  return () => {
    walletApi.eventBus = new PluginEvents(app.$eventBus)
  }
}

export function destroy (walletApi) {
  walletApi.eventBus.destroy()
}
