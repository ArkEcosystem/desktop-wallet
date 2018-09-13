import bip39 from 'bip39'
import { crypto } from '@arkecosystem/crypto'

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
   * Check that an address is valid.
   * @param {Number} pubKeyHash - also known as address or network version
   * @return {Boolean}
   */
  static validateAddress (address, pubKeyHash) {
    return crypto.validateAddress(address, pubKeyHash)
  }
}
