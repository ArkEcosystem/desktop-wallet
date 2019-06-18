import { fork } from 'child_process'
import { resolve } from 'path'

export default class {
  constructor () {
    const workersPath = process.env.NODE_ENV === 'production' ? 'workers/' : '../workers/'

    this.worker = fork(resolve(__dirname, workersPath, 'bip38-worker.js'))
  }

  decrypt ({ bip38key, password, wif }) {
    const onMessage = this.onMessage()
    this.worker.send({ bip38key, password, wif })
    return onMessage
  }

  encrypt ({ passphrase, password, wif }) {
    const onMessage = this.onMessage()
    this.worker.send({ passphrase, password, wif })
    return onMessage
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
