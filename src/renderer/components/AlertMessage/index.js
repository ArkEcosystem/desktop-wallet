import Vue from 'vue'
import AlertMessage from './AlertMessage'

const AlertEvents = new Vue()
const AlertPlugin = {
  install (Vue, options) {
    const show = (alert) => {
      AlertEvents.$emit('alert', alert)
    }
    const types = [
      'error',
      'success',
      'info',
      'warn'
    ]

    for (const type of types) {
      Vue[type] = (message, duration) => {
        show({ message, type, duration })
      }
      Vue.prototype[`$${type}`] = (message, duration) => {
        show({ message, type, duration })
      }
    }
  }
}

export default AlertMessage
export {
  AlertMessage,
  AlertEvents,
  AlertPlugin
}
