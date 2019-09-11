import Worker from '@/services/worker'

export default class extends Worker {
  constructor (baseUrl, options = {}) {
    super('client')

    this.baseUrl = baseUrl
    this.options = options
  }

  withOptions (options = {}) {
    this.options = options

    return this
  }

  vanilla (method, url, options) {
    return this
      .run({
        baseUrl: this.baseUrl,
        method,
        url,
        options
      })
      .then(result => {
        this.stop()

        return result
      })
      .catch(error => {
        this.stop()

        throw error
      })
  }

  get (url, options) {
    return this.vanilla('get', url, options)
  }

  post (url, options) {
    return this.vanilla('post', url, options)
  }

  request (type, endpoint, data, query) {
    console.log(`client request ${this.baseUrl}/${type}/${endpoint} with data: ${data}, query:`, query)
    return this
      .run({
        baseUrl: this.baseUrl,
        options: this.options,
        type,
        endpoint,
        data,
        query
      })
      .then(result => {
        console.log('client worker result', result, result.body.meta && result.body.meta.first ? result.body.meta.first : '')
        return result
      })
      .catch(error => {
        console.log('client worker error', error)
        throw error
      })
  }

  once (type, endpoint, data, query) {
    return this.request(type, endpoint, data, query)
      .finally(() => {
        this.stop()
      })
  }
}
