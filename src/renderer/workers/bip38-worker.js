'use strict'

const bip38 = require('bip38')
const wif = require('wif')
const { crypto } = require('@arkecosystem/crypto')

process.on('message', message => {
  if (message.passphrase) {
    try {
      const keys = crypto.getKeys(message.passphrase)
      const decoded = wif.decode(crypto.keysToWIF(keys, { wif: message.wif }))

      process.send({
        bip38key: bip38.encrypt(decoded.privateKey, decoded.compressed, message.password)
      })
    } catch (error) {
      process.send({
        bip38key: null,
        error: `Failed to encrypt passphrase: ${error.message}`
      })
    }
  } else if (message.bip38key) {
    try {
      const decryptedKey = bip38.decrypt(message.bip38key, message.password)
      process.send({
        decodedWif: wif.encode(message.wif, decryptedKey.privateKey, decryptedKey.compressed)
      })
    } catch (error) {
      process.send({
        decodedWif: null,
        error: `Failed to decrypt passphrase: ${error.message}`
      })
    }
  } else if (message === 'quit') {
    process.exit()
  }
})
