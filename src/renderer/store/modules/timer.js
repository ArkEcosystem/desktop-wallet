import { forEach, isFunction } from 'lodash'
import { INTERVALS } from '@config'
import eventBus from '@/plugins/event-bus'
import crypto from 'crypto'

export default {
  namespaced: true,

  state: () => ({
    timers: [],
    observers: {},
    intervals: INTERVALS
  }),

  mutations: {
    ADD_TIMER (state, timer) {
      state.timers.push(timer)
    },

    ADD_OBSERVER (state, { id, callback, interval }) {
      state.observers[id] = { callback, interval }
    },

    REMOVE_OBSERVER (state, id) {
      delete state.observers[id]
    },

    RESET_TIMERS (state) {
      state.timers = []
    }
  },

  actions: {
    start ({ state, commit }) {
      forEach(state.intervals, (value, key) => {
        const timer = setInterval(() => {
          eventBus.emit(`timer:${key}`)
        }, value)
        commit('ADD_TIMER', timer)
      })
    },

    subscribe ({ commit }, { interval, callback, immediate, id }) {
      if (!isFunction(callback)) {
        throw new Error('[timer/subscribe] - callback is not a function')
      }

      const uniqueId = id || crypto.randomBytes(6).toString('base64')

      commit('ADD_OBSERVER', {
        id: uniqueId,
        callback,
        interval
      })

      if (immediate) callback()

      eventBus.on(`timer:${interval}`, callback)

      return uniqueId
    },

    unsubscribe ({ commit, state }, id) {
      const observer = state.observers[id]

      if (!observer) {
        throw new Error('[timer/unsubscribe] - id not found')
      }

      const { interval, callback } = observer
      eventBus.off(`timer:${interval}`, callback)

      commit('REMOVE_OBSERVER', id)
    },

    stopAll ({ state, commit }) {
      state.timers.forEach(timer => clearInterval(timer))
      commit('RESET_TIMERS')
    }
  }
}
