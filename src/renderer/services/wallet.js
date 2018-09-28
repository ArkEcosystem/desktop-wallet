import bip39 from 'bip39'
import { crypto, validator } from '@arkecosystem/crypto'

export default class WalletService {
  /*
   * Generate a wallet.
   * It does not check if the wallet is new (no transactions on the blockchain)
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Object}
   */
  static generate (pubKeyHash) {
    const passphrase = bip39.generateMnemonic()
    const publicKey = crypto.getKeys(passphrase).publicKey
    return {
      address: crypto.getAddress(publicKey, pubKeyHash),
      passphrase
    }
  }
  /**
   * Returns the address that correspond to a passphrase
   * @param {String} passhrase
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {String}
   */
  static getAddress (passphrase, pubKeyHash) {
    const publicKey = crypto.getKeys(passphrase).publicKey
    return crypto.getAddress(publicKey, pubKeyHash)
  }
  /**
   * Check that an address is valid.
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Boolean}
   */
  static validateAddress (address, pubKeyHash) {
    return crypto.validateAddress(address, pubKeyHash)
  }

  /**
   * Check that a passphrase is valid.
   * @param {String} passhrase
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Boolean}
   */
  static validatePassphrase (passphrase, pubKeyHash) {
    const publicKey = crypto.getKeys(passphrase).publicKey
    return crypto.validatePublicKey(publicKey, pubKeyHash)
  }

  /**
   * Check that a username is valid
   *
   * @param {String} username
   * @return {Object} { data: String, errors: Array, passes: Boolean, fails: Error }
   */
  static validateUsername (username) {
    if (!username) return

    return validator.rules.username(username)
  }

  /**
   * Check that a password match an address
   * @param {String} address
   * @param {String} passhrase
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Boolean}
   */
  static verifyPassphrase (address, passphrase, pubKeyHash) {
    return address === WalletService.getAddress(passphrase, pubKeyHash)
  }
}
