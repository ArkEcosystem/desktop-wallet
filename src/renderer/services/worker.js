import { fork } from 'child_process'
import crypto from 'crypto'
import { resolve } from 'path'

const basePath = process.env.NODE_ENV === 'production' ? 'workers/' : '../workers/'
const pools = {}

/**
 * This class can be used to run background jobs using a pool of workers
 */
export default class {
  static get pools () {
    return pools
  }

  constructor (name) {
    this.name = name
    this.id = crypto.randomBytes(12).toString('base64')
    this.pool = fork(this.path)
  }

  get path () {
    return resolve(__dirname, basePath, `${this.name}.js`)
  }

  get pool () {
    return pools[this.id]
  }

  set pool (value) {
    pools[this.id] = value
  }

  run (data) {
    const onMessage = this.onMessage()
    this.pool.send(data)

    return onMessage
  }

  onMessage () {
    return new Promise((resolve, reject) => {
      this.pool.once('message', message => {
        message.error ? reject(message.error) : resolve(message)
      })
    })
  }

  async stop () {
    // try {
    //   this.pool.send('quit')
    // } catch (error) {
    //   //
    // }

    try {
      this.pool.disconnect()
    } catch (error) {
      //
    }

    delete pools[this.id]
  }
}
