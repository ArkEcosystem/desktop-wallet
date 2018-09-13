import LedgerTransport from '@ledgerhq/hw-transport-node-hid'
import ArkLedger from '@arkecosystem/ledger-transport'
import Vue from 'vue'

class LedgerService {
  /**
   * Create LedgerService instance, without ark-library.
   * @param  {Number} slip44
   * @return {void}
   */
  constructor (slip44) {
    this.setSlip44(slip44)
    this.events = new Vue()
    this.transport = null
    this.ledger = null
    this.connected = false
    this.connectionTimer = null
  }

  /**
   * Initialise ledger service with ark-ledger library.
   * @param  {Number} slip44
   * @return {LedgerService}
   */
  static async init (slip44) {
    const ledgerService = new LedgerService(slip44)
    await ledgerService.startConnect()

    return ledgerService
  }

  /**
   * Set slip44 value.
   * @param  {Number} slip44
   * @return {void}
   */
  setSlip44 (slip44) {
    if (!Number.isFinite(slip44)) {
      throw new Error('slip44 must be a Number')
    }

    this.slip44 = slip44
  }

  /**
   * Try connecting to ledger device.
   * @return {Boolean} true if connected, false if failed
   */
  async connect () {
    try {
      if (!this.connected) {
        this.transport = await LedgerTransport.create()
        this.ledger = new ArkLedger(this.transport)
      }
      // Make a request to the ledger device to determine if it's accessible
      await this.ledger.getAppConfiguration()
      clearTimeout(this.connectionTimer)
      this.connectionTimer = null
      this.connected = true
      this.events.$emit('connected')

      return true
    } catch (error) {
      //
    }

    return false
  }

  /**
   * Flag ledger as disconnected.
   * @return {void}
   */
  async disconnect () {
    // Disconnect ledger in case this is called manually
    try {
      await this.transport.close()
    } catch (error) {
      //
    }
    this.ledger = null
    this.transport = null
    this.connected = false
    this.events.$emit('disconnected')
    this.startConnect()
  }

  /**
   * Start connect process if can't connect initially.
   * @param  {Boolean} isStep Determines if the startConnect method is called from within the timer.
   * @return {void}
   */
  async startConnect (isStep) {
    if (this.connected) {
      return
    }
    if (!isStep && this.connectionTimer) {
      return
    }

    if (!await this.connect()) {
      this.connectionTimer = setTimeout(async () => {
        await this.startConnect(true)
      }, 3000)
    }
  }

  /**
   * Get address from ledger wallet.
   * @param  {Number} [accountIndex] Index of wallet to get address for.
   * @return {String}
   */
  async getAddress (accountIndex) {
    return this.__action('getAddress', accountIndex)
  }

  /**
   * Get public key from ledger wallet.
   * @param  {Number} [accountIndex] Index of wallet to get public key for.
   * @return {String}
   */
  async getPublicKey (accountIndex) {
    return this.__action('getPublicKey', accountIndex)
  }

  /**
   * Sign transaction for ledger wallet.
   * @param  {String} transactionHex Hex of transaction.
   * @param  {Number} [accountIndex] Index of wallet to get address for.
   * @return {Object}
   */
  async signTransaction (transactionHex, accountIndex) {
    return this.__action('signTransaction', accountIndex, transactionHex)
  }

  /**
   * Action method to act as a wrapper for ledger methods
   * @param  {String} action       Action to perform
   * @param  {Number} accountIndex Index of wallet to access.
   * @param  {*}      data         Data used for any actions that need it.
   * @return {String}
   */
  async __action (action, accountIndex, data) {
    if (accountIndex !== undefined && !Number.isFinite(accountIndex)) {
      throw new Error('accountIndex must be a Number')
    }

    if (!this.connected) {
      await this.startConnect()
      if (!this.connected) {
        throw new Error('Ledger not connected')
      }
    }

    const path = this.__getPath(accountIndex)
    const actions = {
      getAddress: async () => {
        const response = await this.ledger.getAddress(path)

        return response.address
      },
      getPublicKey: async () => {
        const response = await this.ledger.getAddress(path)

        return response.publicKey
      },
      signTransaction: async () => {
        const response = await this.ledger.signTransaction(path, data)

        return response.signature
      }
    }

    if (!actions.hasOwnProperty(action)) {
      throw new Error('Action does not exist')
    }

    try {
      const response = await actions[action]()

      return response
    } catch (error) {
      await this.disconnect()
      throw new Error('Ledger disconnected')
    }
  }

  /**
   * Get path to be used with ledger interactions.
   * @param  {Number} [accountIndex] Index of wallet to get address for.
   * @return {String}
   */
  __getPath (accountIndex) {
    return `44'/${this.slip44}'/${accountIndex || 0}'/0/0`
  }
}

export default LedgerService
