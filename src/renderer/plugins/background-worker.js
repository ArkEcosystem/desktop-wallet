import { fork } from 'child_process'
import * as path from 'path'

export default {
  install (Vue) {
    Vue.prototype.$bgWorker = {
      bip38: () => {
        return fork(path.resolve(__dirname, '../workers/bip38-worker.js'))
      }
    }
  }
}
