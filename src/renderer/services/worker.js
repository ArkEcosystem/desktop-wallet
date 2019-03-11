import logger from 'electron-log'
import { resolve } from 'path'
import { cpus } from 'os'
import { Pool } from 'threads'

let pool = null

export default class {
  static get pool () {
    return pool
  }

  constructor () {
    this.basePath = process.env.NODE_ENV === 'production' ? 'workers/' : '../workers/'
  }

  run (name) {
    if (!pool) {
      // Use (number of logical CPUs - 1) threads
      pool = new Pool(cpus().length - 1)

      pool.on('error', (job, error) => {
        logger.error(error)
      })
    }

    const path = resolve(__dirname, this.basePath, `${name}.js`)
    return pool.run(path)
  }
}
