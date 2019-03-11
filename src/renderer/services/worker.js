import logger from 'electron-log'
import { resolve } from 'path'
// import { cpus } from 'os'
import { Pool } from 'threads'

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
  }

  get pool () {
    return pools[this.name]
  }

  set pool (value) {
    pools[this.name] = value
  }

  run () {
    if (!this.pool) {
      // Use (number of logical CPUs - 1) threads
      // const threads = cpus().length - 1

      // Since the pool is used for BIP38 only, it is not necessary to spawn more jobs
      const threads = 1
      this.pool = new Pool(threads)

      this.pool.on('error', (job, error) => {
        logger.error(error)
      })
    }

    const basePath = process.env.NODE_ENV === 'production' ? 'workers/' : '../workers/'
    const path = resolve(__dirname, basePath, `${this.name}.js`)
    return this.pool.run(path)
  }

  stop () {
    this.pool.killAll()
    delete pools[this.name]
  }
}
