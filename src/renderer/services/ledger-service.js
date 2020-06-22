import LedgerTransport from '@ledgerhq/hw-transport-node-hid-singleton'
import { ARKTransport } from '@arkecosystem/ledger-transport'
import queue from 'async/queue'
import logger from 'electron-log'

class LedgerService {
  /**
   * Create LedgerService instance.
   * @return {void}
   */
  constructor () {
    this.transport = null
    this.ledger = null
    this.listeningForLedger = false
    this.actions = []
    this.actionsQueue = queue(async ({ action, resolve }, callback) => {
      try {
        resolve(await action())
      } catch (error) {
        if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
          resolve(false)
        }
        resolve(null)
      }
      callback()
    })

    this.listenForLedger()
  }

  async listenForLedger () {
    if (this.listeningForLedger) {
      return
    }

    this.listeningForLedger = true
    this.transport = await LedgerTransport.create()
    this.ledger = new ARKTransport(this.transport)
    this.listeningForLedger = false
  }

  /**
   * Try connecting to ledger device.
   * @return {Boolean} true if connected, false if failed
   */
  async connect () {
    try {
      if (!this.transport || this.transport.disconnected) {
        this.listenForLedger()
      }

      return this.isConnected()
    } catch (error) {
      logger.debug(error)
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
      if (this.transport) {
        await this.transport.close()
      }
    } catch (error) {
      logger.error(error)
    }
  }

  /**
   * Check if connected to the ledger.
   * @return {Boolean}
   */
  async isConnected () {
    try {
      if (!this.transport || this.transport.disconnected) {
        return false
      }

      // Make a request to the ledger device to determine if it's accessible
      const isConnected = await this.__performAction(async () => {
        return this.ledger.getPublicKey('44\'/1\'/0\'/0/0')
      })

      return !!isConnected
    } catch (error) {
      logger.error(error)
    }

    return false
  }

  /**
   * Get public key from ledger wallet.
   * @param  {string} path Path for wallet location.
   * @return {Promise<string>}
   */
  async getPublicKey (path) {
    return this.__performAction(async () => {
      return this.ledger.getPublicKey(path)
    })
  }

  /**
   * Sign transaction for ledger wallet using ecdsa signatures.
   * @param  {string} path Path for wallet location.
   * @param  {Buffer} transactionBytes bytes of transaction.
   * @return {Promise<string>}
   */
  async signTransaction (path, transactionBytes) {
    return this.__performAction(async () => {
      return this.ledger.signTransaction(path, transactionBytes)
    })
  }

  /**
   * Sign transaction for ledger wallet using schnorr signatures.
   * @param  {string} path Path for wallet location.
   * @param  {Buffer} transactionBytes bytes of transaction.
   * @return {Promise<string>}
   */
  async signTransactionWithSchnorr (path, transactionBytes) {
    return this.__performAction(async () => {
      try {
        return await this.ledger.signTransactionWithSchnorr(path, transactionBytes)
      } catch {
        console.warn('Schnorr Signatures Unsupported; Trying Ecdsa..')
        return this.ledger.signTransaction(path, transactionBytes)
      }
    })
  }

  /**
   * Sign message for ledger wallet using ecdsa signatures.
   * @param  {string} path Path for wallet location.
   * @param  {Buffer} messageBytes bytes to sign.
   * @return {Promise<string>}
   */
  async signMessage (path, messageBytes) {
    return this.__performAction(async () => {
      return this.ledger.signMessage(path, messageBytes)
    })
  }

  /**
   * Sign message for ledger wallet using schnorr signatures.
   * @param  {string} path Path for wallet location.
   * @param  {Buffer} messageBytes bytes to sign.
   * @return {Promise<string>}
   */
  async signMessageWithSchnorr (path, messageBytes) {
    return this.__performAction(async () => {
      return this.ledger.signMessageWithSchnorr(path, messageBytes)
    })
  }

  /**
   * Get version of ledger wallet.
   * @return {Promise<string>}
   */
  async getVersion () {
    return this.__performAction(async () => {
      return this.ledger.getVersion()
    })
  }

  /**
   * Sign transaction for ledger wallet.
   * @param  {Function} [action] Method to run in an synchronous queue.
   * @return {Promise}
   */
  __performAction (action) {
    return new Promise((resolve) => {
      this.actionsQueue.push({
        action,
        resolve
      })
    })
  }
}

export default new LedgerService()
