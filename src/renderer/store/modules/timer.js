import { forEach, isFunction } from 'lodash'
import { INTERVALS } from '@config'
import eventBus from '@/plugins/event-bus'

export default {
  namespaced: true,

  state: () => ({
    timers: [],
    intervals: INTERVALS
  }),

  mutations: {
    ADD_TIMER (state, timer) {
      state.timers.push(timer)
    },

    RESET_TIMERS (state) {
      state.timers = []
    }
  },

  actions: {
    start ({ state, commit }) {
      forEach(state.intervals, (value, key) => {
        const timer = setInterval(() => {
          eventBus.$emit(`timer:${key}`)
        }, value)
        commit('ADD_TIMER', timer)
      })
    },

    listen (_, { interval, callback, immediate }) {
      if (!isFunction(callback)) {
        throw new Error('[timer/listen] - callback is not a function')
      }

      if (immediate) callback()

      eventBus.$on(`timer:${interval}`, callback)
    },

    stopAll ({ state, commit }) {
      state.timers.forEach(timer => clearInterval(timer))
      commit('RESET_TIMERS')
    }
  }
}
