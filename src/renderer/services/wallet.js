import bip39 from 'bip39'
import { crypto } from '@arkecosystem/crypto'

export default class WalletService {
  /*
   * Generates a wallet.
   * It does not check if the wallet is new (no transactions on the blockchain)
   */
  static generate (pubKeyHash) {
    const passphrase = bip39.generateMnemonic()
    const publicKey = crypto.getKeys(passphrase).publicKey
    return {
      address: crypto.getAddress(publicKey, pubKeyHash),
      passphrase
    }
  }
}
