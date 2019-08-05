import bip39 from 'bip39'
import { Crypto, Identities } from '@arkecosystem/crypto'
import { version as mainnetVersion } from '@config/networks/mainnet'
import got from 'got'

export default class WalletService {
  /*
   * Normalizes the passphrase by decomposing any characters (if applicable)
   * This is mainly used for the korean language where characters are combined while the passphrase was based on the decomposed consonants
  */
  static normalizePassphrase (passphrase) {
    return passphrase.normalize('NFD')
  }

  /*
   * Generate a wallet.
   * It does not check if the wallet is new (no transactions on the blockchain)
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Object}
   */
  static generate (pubKeyHash, language) {
    const passphrase = bip39.generateMnemonic(null, null, bip39.wordlists[language])
    const publicKey = Identities.Keys.fromPassphrase(this.normalizePassphrase(passphrase)).publicKey
    return {
      address: Identities.Address.fromPublicKey(publicKey, pubKeyHash),
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
    return Identities.Address.fromPassphrase(this.normalizePassphrase(passphrase), pubKeyHash)
  }

  static getAddressFromPublicKey (publicKey, pubKeyHash) {
    return Identities.Address.fromPublicKey(publicKey, pubKeyHash)
  }

  /**
   * Generates the public key belonging to the given passphrase
   * @param {String} passphrase
   * @return {String}
   */
  static getPublicKeyFromPassphrase (passphrase) {
    return Identities.Keys.fromPassphrase(this.normalizePassphrase(passphrase)).publicKey
  }

  /**
   * Check if a specific address contain data in the NEO Blockchain
   * @param {String} address
   * @returns {Boolean}
   */
  static async isNeoAddress (address) {
    if (!WalletService.validateAddress(address, mainnetVersion)) {
      return false
    }

    const neoUrl = 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/'
    const response = await got(neoUrl + address)
    return response.status === 200 && response.body && response.body.length > 0
  }

  /**
   * Signs a message by using the given passphrase.
   * @param {String} message
   * @param {String} passphrase
   * @return {String}
   */
  static signMessage (message, passphrase) {
    return Crypto.Message.sign(message, this.normalizePassphrase(passphrase))
  }

  /**
   * Signs a message by using the given wif.
   * @param {String} message
   * @param {Number} wif
   * @param {Object} [network]
   * @return {String}
   */
  static signMessageWithWif (message, wif, network) {
    return Crypto.Message.signWithWif(message, wif, network)
  }

  /**
   * Verify a given message based on the given public key and signature.
   * @param {String} message
   * @param {String} publicKey
   * @param {String} signature
   * @return {String}
   */
  static verifyMessage (message, publicKey, signature) {
    return Crypto.Message.verify({ message, publicKey, signature })
  }

  /**
   * Check that an address is valid.
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Boolean}
   */
  static validateAddress (address, pubKeyHash) {
    return Identities.Address.validate(address, pubKeyHash)
  }

  /**
   * Check that a passphrase is valid.
   * @param {String} passhrase
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Boolean}
   */
  static validatePassphrase (passphrase, pubKeyHash) {
    const publicKey = Identities.Keys.fromPassphrase(this.normalizePassphrase(passphrase)).publicKey
    return Identities.PublicKey.validate(publicKey, pubKeyHash)
  }

  /**
   * Check that a passphrase is valid bip39 passphrase.
   * @param {String} passhrase
   * @param {Number} language - bip39 wordlist language
   * @return {Boolean}
   */
  static isBip39Passphrase (passphrase, language) {
    return bip39.validateMnemonic(this.normalizePassphrase(passphrase), bip39.wordlists[language])
  }

  /**
   * Check that a username is valid
   *
   * @param {String} username
   * @return {Object} { errors: Array, passes: Boolean }
   */
  static validateUsername (username) {
    const errors = []

    if (username.length < 1) {
      errors.push({ type: 'empty' })
    } else if (username.length > 20) {
      errors.push({ type: 'maxLength' })
    // Regex from `@arkecosystem/crypto`
    } else if (!username.match(/^[a-z0-9!@$&_.]+$/)) {
      errors.push({ type: 'invalidFormat' })
    }

    return {
      errors,
      passes: errors.length === 0
    }
  }

  /**
   * Check that a password match an address
   * @param {String} address
   * @param {String} passhrase
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Boolean}
   */
  static verifyPassphrase (address, passphrase, pubKeyHash) {
    return address === WalletService.getAddress(this.normalizePassphrase(passphrase), pubKeyHash)
  }
}
