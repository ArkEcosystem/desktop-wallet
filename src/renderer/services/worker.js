import { fork } from 'child_process'
import { resolve } from 'path'

export default class {
  constructor (name) {
    const workersPath = process.env.NODE_ENV === 'production' ? 'workers/' : '../workers/'

    this.worker = fork(resolve(__dirname, workersPath, `${name}.js`))
  }

  onMessage () {
    return new Promise((resolve, reject) => {
      this.worker.on('message', message => {
        message.error ? reject(message.error) : resolve(message)
      })
    })
  }

  quit () {
    this.worker.send('quit')
  }
}
