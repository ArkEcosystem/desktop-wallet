import { fork } from 'child_process'
import * as path from 'path'

export default {
  install (Vue) {
    let workersPath = path.resolve(__dirname, '../workers/')
    if (process.env.NODE_ENV === 'production') {
      workersPath = path.resolve(__dirname, 'workers/')
    }

    Vue.prototype.$bgWorker = {
      bip38: () => {
        return fork(path.resolve(workersPath, 'bip38-worker.js'))
      }
    }
  }
}
