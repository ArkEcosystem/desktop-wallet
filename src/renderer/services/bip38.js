import Worker from './worker'

export default class extends Worker {
  /**
   * @param {Object} config
   * @param {String} config.bip38key
   * @param {String} config.password
   * @param {String} config.wif
   */
  decrypt (config) {
    return this.run('bip38')
      .send(config)
      .promise()
  }

  /**
   * @param {Object} config
   * @param {String} config.passphrase
   * @param {String} config.password
   * @param {String} config.wif
   */
  encrypt (config) {
    return this.run('bip38')
      .send(config)
      .promise()
  }
}
