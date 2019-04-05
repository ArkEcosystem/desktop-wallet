import Worker from './worker'

export default class extends Worker {
  constructor () {
    super('bip38')
  }

  /**
   * @param {Object} config
   * @param {String} config.bip38key
   * @param {String} config.password
   * @param {String} config.wif
   */
  decrypt (config) {
    return this.run()
      .send(config)
      .promise()
      .then(result => {
        this.stop()
        return result
      })
      .catch(error => {
        this.stop()
        throw error
      })
  }

  /**
   * @param {Object} config
   * @param {String} config.passphrase
   * @param {String} config.password
   * @param {String} config.wif
   */
  encrypt (config) {
    // The receiver worker decides if decrypt or encrypt based on `config` properties
    return this.decrypt(config)
  }
}
