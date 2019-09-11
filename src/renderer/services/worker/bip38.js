import Worker from '@/services/worker'

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
    return this.run(config)
      .then(result => {
        console.log('bip38 decrypt success', result)
        this.stop()

        return result
      })
      .catch(error => {
        console.log('bip38 decrypt error', error)
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
