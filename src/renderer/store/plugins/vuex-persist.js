// Based on https://github.com/championswimmer/vuex-persist

import { merge as lodashMerge } from 'lodash'

const merge = (into, from) => lodashMerge({}, into, from)

class SimplePromiseQueue {
  constructor () {
    this._queue = []
    this._flushing = false
  }

  enqueue (promise) {
    this._queue.push(promise)

    if (!this._flushing) {
      return this.flushQueue()
    }

    return Promise.resolve()
  }

  flushQueue () {
    this._flushing = true

    const chain = () => {
      const nextTask = this._queue.shift()

      if (nextTask) {
        return nextTask.then(chain)
      }

      this._flushing = false
    }

    return Promise.resolve(chain())
  }
}

export class VuexPersistence {
  constructor (options) {
    this._mutex = new SimplePromiseQueue()

    this.subscribed = false

    if (typeof options === 'undefined') {
      options = {}
    }

    this.key = options.key
    this.storage = options.storage
    this.reducer = options.reducer

    this.RESTORE_MUTATION = function RESTORE_MUTATION (state, savedState) {
      const mergedState = merge(state, savedState || {})

      for (const propertyName of Object.keys(mergedState)) {
        this._vm.$set(state, propertyName, mergedState[propertyName])
      }
    }

    this.restoreState = (key, storage) =>
      storage
        .getItem(key)
        .then(value =>
          typeof value === 'string' ? JSON.parse(value || '{}') : value || {}
        )

    this.saveState = (key, state, storage) =>
      storage.setItem(key, merge({}, state || {}))

    this.plugin = store => {
      store.restored = this.restoreState(this.key, this.storage).then(
        savedState => {
          store.commit('RESTORE_MUTATION', savedState)

          store.subscribe((mutation, state) =>
            this._mutex.enqueue(
              this.saveState(this.key, this.reducer(state), this.storage)
            )
          )

          this.subscribed = true
        }
      )
    }
  }
}
