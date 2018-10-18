import Synchronizer from '@/services/synchronizer'

export default {
  install (Vue, _options) {
    let synchronizer

    Object.defineProperty(Vue.prototype, '$synchronizer', {
      get () {
        if (!synchronizer) {
          synchronizer = new Synchronizer({ scope: this })
        }
        return synchronizer
      }
    })
  }
}
