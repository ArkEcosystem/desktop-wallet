import axios from 'axios'

/**
 * This class mimics the JavaScript API client, but it can be used to send
 * request on the background
 */
export default class BackgroundHttpClient {
  /**
   * @constructor
   * @param  {String} host
   * @param  {Number = 1} [apiVersion]
   */
  constructor (host, apiVersion = 1) {
    this.host = host.endsWith('/') ? host.slice(0, -1) : host

    if (host.length === 0) {
      throw new Error('An empty host is not permitted')
    }

    this.version = apiVersion
    this.timeout = 60000
    this.headers = { 'Content-Type': 'application/json' }
  }

  /**
   * The HTTP client that performs all the requests.
   * By default axios is used, but it can be overwritten by setting the property `__httpClient`.
   */
  get httpClient () {
    return this.__httpClient || axios
  }

  /**
   * Used to specify the API Version.
   * @param {Number} version
   */
  setVersion (version) {
    this.version = version
  }

  /**
   * Establish the headers of the requests.
   * @param {Object} headers
   */
  setHeaders (headers = {}) {
    this.headers = headers
  }

  /**
   * Establish the timeout of the requests.
   * @param {Number} timeout
   */
  setTimeout (timeout) {
    this.timeout = timeout
  }

  /**
   * Perform a HTTP GET request.
   * @param  {String} path
   * @param  {Object} params
   * @return {Promise}
   */
  get (path, params = {}) {
    return this.sendApiRequest('get', path, { params })
  }

  /**
   * Perform a HTTP POST request.
   * @param  {String} path
   * @param  {Object} data
   * @return {Promise}
   */
  post (path, data = {}) {
    return this.sendApiRequest('post', path, data)
  }

  /**
   * Performs a request to the API using the headers that are expected by the network.
   * @param  {String} method
   * @param  {String} path
   * @param  {Object} payload
   * @return {Promise}
   * @throws Will throw an error if the HTTP request fails.
   */
  sendApiRequest (method, path, payload) {
    return this.sendRequest(method, `/api/${path}`, payload)
  }

  /**
   * Performs a request using the headers that are expected by the network.
   * @param  {String} method
   * @param  {String} path
   * @param  {Object} payload
   * @return {Promise}
   * @throws Will throw an error if the HTTP request fails.
   */
  sendRequest (method, url, payload) {
    this.headers['API-Version'] = this.version

    const config = {
      baseURL: this.host,
      headers: this.headers,
      method,
      timeout: this.timeout,
      url
    }

    if (payload.params) {
      config.params = payload.params
      delete payload.params
    }

    config.data = payload

    return this.httpClient(config)
  }
}
