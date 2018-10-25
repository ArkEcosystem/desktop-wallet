import eventBus from './event-bus'
import { transform, assignIn } from 'lodash'

const triggerAlert = (alert) => eventBus.emit('alert', alert)

const types = [
  'error',
  'success',
  'info',
  'warn'
]

const inject = transform(types, (result, type) => {
  result[`$${type}`] = (message, duration) => {
    triggerAlert({ message, type, duration })
  }
}, {})

export default {
  install (Vue) {
    assignIn(Vue.prototype, inject)
  },
  ...inject
}
