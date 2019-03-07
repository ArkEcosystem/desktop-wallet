import Worker from './worker'

export default class extends Worker {
  constructor () {
    super('http')
  }

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
    const onMessage = this.onMessage()
    this.worker.send(config)
    return onMessage.catch(({ message }) => new Error(message))
  }
}
