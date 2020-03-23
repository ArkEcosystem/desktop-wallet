export class Peer {
  constructor ({ ip, host, port, height, status, latency, isHttps, lastUpdated }) {
    this.ip = ip || host
    this.host = host || ip
    this.port = port
    this.height = height
    this.status = status
    this.latency = latency
    this.isHttps = isHttps
    this.lastUpdated = lastUpdated
    this._clientService = undefined
  }

  get baseUrl () {
    return `${this.isHttps ? 'https://' : 'http://'}${this.ip || this.host}:${this.port}`
  }
}
