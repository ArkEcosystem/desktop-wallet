import LedgerTransport from '@ledgerhq/hw-transport-node-hid'
import ArkLedger from '@arkecosystem/ledger-transport'
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
    this.actions = []
    this.actionsQueue = queue(async ({ action, resolve }, callback) => {
      try {
        resolve(await action())
      } catch (error) {
        resolve(false)
      }
      callback()
    })
  }

  /**
   * Try connecting to ledger device.
   * @return {Boolean} true if connected, false if failed
   */
  async connect () {
    try {
      if (this.transport) {
        await this.disconnect()
      }
      this.transport = await LedgerTransport.create()
      this.ledger = new ArkLedger(this.transport)

      return this.isConnected()
    } catch (error) {
      logger.debug(error.message)
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
      // Make a request to the ledger device to determine if it's accessible
      const isConnected = await this.__performAction(async () => {
        return this.ledger.getAddress(`44'/1'/0'/0/0`)
      }, 'getAddress')

      return !!isConnected
    } catch (error) {
      logger.error(error)
    }

    return false
  }

  /**
   * Get address and public key from ledger wallet.
   * @param  {Number} [path] Path for wallet location.
   * @return {(String|Boolean)}
   */
  async getWallet (path) {
    return this.__performAction(async () => {
      return this.ledger.getAddress(path)
    })
  }

  /**
   * Get public key from ledger wallet.
   * @param  {Number} [path] Path for wallet location.
   * @return {(String|Boolean)}
   */
  async getPublicKey (path) {
    return this.__performAction(async () => {
      return this.ledger.getAddress(path)
    })
  }

  /**
   * Sign transaction for ledger wallet.
   * @param  {Number} [path] Path for wallet location.
   * @param  {String} transactionHex Hex of transaction.
   * @return {(String|Boolean)}
   */
  async signTransaction (path, transactionHex) {
    return this.__performAction(async () => {
      return this.ledger.signTransaction(path, transactionHex)
    })
  }

  /**
   * Sign transaction for ledger wallet.
   * @param  {Function} [action] Method to run in an synchronous queue.
   * @return {Promise}
   */
  __performAction (action) {
    return new Promise((resolve, reject) => {
      this.actionsQueue.push({
        action,
        resolve
      })
    })
  }
}

export default new LedgerService()
