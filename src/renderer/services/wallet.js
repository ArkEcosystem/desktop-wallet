import bip39 from 'bip39'
import { crypto, Message, validator } from '@arkecosystem/crypto'

export default class WalletService {
  /*
   * Generate a wallet.
   * It does not check if the wallet is new (no transactions on the blockchain)
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Object}
   */
  static generate (pubKeyHash, language) {
    const passphrase = bip39.generateMnemonic(null, null, bip39.wordlists[language])
    const publicKey = crypto.getKeys(passphrase).publicKey
    return {
      address: crypto.getAddress(publicKey, pubKeyHash),
      passphrase
    }
  }

  /**
   * Generates a new passphrase to be used for a second passphrase
   */
  static generateSecondPassphrase (language) {
    return bip39.generateMnemonic(null, null, bip39.wordlists[language])
  }

  /**
   * Returns the address that correspond to a passphrase
   * @param {String} passphrase
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {String}
   */
  static getAddress (passphrase, pubKeyHash) {
    const publicKey = crypto.getKeys(passphrase).publicKey
    return crypto.getAddress(publicKey, pubKeyHash)
  }

  static getAddressFromPublicKey (publicKey, pubKeyHash) {
    return crypto.getAddress(publicKey, pubKeyHash)
  }

  /**
   * Signs a message by using the given passphrase.
   * @param {String} message
   * @param {String} passphrase
   * @return {String}
   */
  static signMessage (message, passphrase) {
    return Message.sign(message, passphrase)
  }

  /**
   * Signs a message by using the given wif.
   * @param {String} message
   * @param {Number} wif
   * @param {Object} [network]
   * @return {String}
   */
  static signMessageWithWif (message, wif, network) {
    return Message.signWithWif(message, wif, network)
  }

  /**
   * Verify a given message based on the given public key and signature.
   * @param {String} message
   * @param {String} publicKey
   * @param {String} signature
   * @return {String}
   */
  static verifyMessage (message, publicKey, signature) {
    return Message.verify({ message, publicKey, signature })
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
   * Check that a passphrase is valid bip39 passphrase.
   * @param {String} passhrase
   * @param {Number} language - bip39 wordlist language
   * @return {Boolean}
   */
  static isBip39Passphrase (passphrase, language) {
    return bip39.validateMnemonic(passphrase, bip39.wordlists[language])
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
