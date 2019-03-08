import { resolve } from 'path'
import { Pool } from 'threads'

// TODO use CPU cores - 1 threads
const pool = new Pool()

export default class {
  constructor () {
    this.basePath = process.env.NODE_ENV === 'production' ? 'workers/' : '../workers/'
  }

  run (name) {
    const path = resolve(__dirname, this.basePath, `${name}.js`)
    return pool.run(path)
  }
}
