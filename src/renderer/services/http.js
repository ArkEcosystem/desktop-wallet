import axios from 'axios'
import Worker from './worker'

// This flag is used to launch request on a worker or not
const USE_BACKGROUND = process.env.NODE_ENV !== 'test'

export default class extends Worker {
  get (url, config) {
    return this.request({
      url,
      method: 'get',
      ...config
    })
  }

  post ({ url, config }) {
    return this.request({
      url,
      method: 'post',
      ...config
    })
  }

  request (config) {
    if (!config.url) {
      throw new Error('No URL was provided')
    }

    if (USE_BACKGROUND) {
      return this.run('http')
        .send(config)
        .promise()
    }

    return axios(config)
  }
}
