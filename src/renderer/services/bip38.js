import Worker from './worker'

export default class extends Worker {
  constructor () {
    super('bip38')
  }

  decrypt ({ bip38key, password, wif }) {
    const onMessage = this.onMessage()
    this.worker.send({ bip38key, password, wif })
    return onMessage
  }

  encrypt ({ passphrase, password, wif }) {
    const onMessage = this.onMessage()
    this.worker.send({ passphrase, password, wif })
    return onMessage
  }
}
