import ApiClient from '@arkecosystem/client'

export default class ClientService {
  constructor () {
    this.__host = null
    this.__version = null
    this.client = new ApiClient('http://')
  }

  get host () {
    return this.__host
  }
  set host (host) {
    this.__host = host
    this.client.setConnection(host)
  }

  get version () {
    return this.__version
  }
  set version (apiVersion) {
    this.__version = apiVersion
    this.client.setVersion(apiVersion)
  }

  async fetchDelegates () {
    let delegates = []
    const { data } = await this.client.resource('delegates').all()

    if (this.__version === 2) {
      delegates = data.data
    } else if (data.success) {
      delegates = data.delegates.map(delegate => {
        return {
          production: {
            approval: delegate.approval,
            productivity: delegate.productivity
          },
          rank: delegate.rate,
          username: delegate.username
        }
      })
    }

    return delegates
  }

  /**
   * Request the data to the wallet endpoint and unify the returned value
   *
   * V1:
   * {"success":true,"account":{"address":"ANQYF8y8PBmg67hSGCA7e67d84sgm8zH3k","unconfirmedBalance":"243884095406","balance":"243884095406","publicKey":null,"unconfirmedSignature":0,"secondSignature":0,"secondPublicKey":null,"multisignatures":[],"u_multisignatures":[]}}
   *
   * V2:
   * {"address":"DPFPtDfexMrSiZEB1o3TiJTUYBnnHrzFrD","publicKey":null,"secondPublicKey":null,"balance":1,"isDelegate":false}
   *
   * @param {String} address
   * @return {Object}
   */
  async fetchWallet (address) {
    let walletData = null

    if (this.__version === 2) {
      const { data } = await this.client.resource('wallets').get(address)
      walletData = data.data
      delete walletData.isDelegate
    } else {
      const { data } = await this.client.resource('accounts').get(address)
      if (data.success) {
        const { account } = data
        walletData = account
        delete walletData.unconfirmedBalance
        delete walletData.unconfirmedSignature
        delete walletData.secondSignature
        delete walletData.multisignatures
        delete walletData.u_multisignatures
      }
    }

    return walletData
  }
}
