import ClientService from '@/services/client'
import i18n from '@/i18n'

export class Peer {
  constructor ({ ip, host, port, height, status, latency, isHttps, lastUpdated }) {
    if (!host && ip) {
      host = ip
    }

    this.ip = ip
    this.host = host
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

  get clientService () {
    if (this._clientService) return this._clientService

    const client = new ClientService()
    client.host = this.baseUrl
    client.client.withOptions({ timeout: this.timetout })

    this._clientService = client

    return client
  }

  async checkNetwork ({ nethash, ignoreNetwork }) {
    console.log(this.baseUrl)
    let networkConfig
    try {
      networkConfig = await ClientService.fetchNetworkConfig(this.baseUrl)
    } catch (err) {
      console.error('Could not get network config:' + err)
    }

    if (!networkConfig) {
      throw i18n.t('PEER.NO_CONNECT')
    } else if (!ignoreNetwork && networkConfig.nethash !== nethash) {
      throw i18n.t('PEER.WRONG_NETWORK')
    }

    return true
  }

  async fetchStatus () {
    let peerStatus

    try {
      const latencyStart = performance.now()
      peerStatus = await this.clientService.fetchPeerStatus()
      if (!peerStatus) throw new Error('Fetch status failed')
      const latencyEnd = performance.now()
      this.latency = (latencyEnd - latencyStart).toFixed(0)
    } catch (err) {
      throw i18n.t('PEER.STATUS_CHECK_FAILED')
    }

    if (!peerStatus) {
      throw i18n.t('PEER.STATUS_CHECK_FAILED')
    }

    this.height = peerStatus.height

    return true
  }
}
