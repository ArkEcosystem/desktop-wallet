'use strict'

const bip38 = require('bip38')
const wif = require('wif')
const { crypto } = require('@arkecosystem/crypto')

module.exports = message => {
  return new Promise((resolve, reject) => {
    if (message.passphrase) {
      try {
        const keys = crypto.getKeys(message.passphrase)
        const { privateKey, compressed } = wif.decode(crypto.keysToWIF(keys, { wif: message.wif }))
        const bip38key = bip38.encrypt(privateKey, compressed, message.password)

        resolve({ bip38key })
      } catch (error) {
        reject(new Error(`Failed to encrypt passphrase: ${error.message}`))
      }
    } else if (message.bip38key) {
      try {
        const { privateKey, compressed } = bip38.decrypt(message.bip38key, message.password)
        const encodedWif = wif.encode(message.wif, privateKey, compressed)

        resolve({ encodedWif })
      } catch (error) {
        reject(new Error(`Failed to decrypt passphrase: ${error.message}`))
      }
    } else {
      reject(new Error(`Bip38 worker does not understand message \`${message}\``))
    }
  })
}
