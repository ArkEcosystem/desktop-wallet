import logger from 'electron-log'
import { resolve } from 'path'
import { cpus } from 'os'
import { Pool } from 'threads'

// Use (number of logical CPUs - 1) threads
const pool = new Pool(cpus().length - 1)

pool.on('error', (job, error) => {
  logger.error(error)
})

export default class {
  constructor () {
    this.basePath = process.env.NODE_ENV === 'production' ? 'workers/' : '../workers/'
  }

  run (name) {
    const path = resolve(__dirname, this.basePath, `${name}.js`)
    return pool.run(path)
  }
}
