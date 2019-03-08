import Worker from './worker'

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

    // return axios(config)
    return this.run('http')
      .send(config)
      .promise()
  }
}
