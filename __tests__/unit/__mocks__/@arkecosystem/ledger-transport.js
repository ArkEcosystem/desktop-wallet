export default class {
  constructor () {
    this.getAddress = jest.fn(() => ({ address: 'ADDRESS', publicKey: 'PUBLIC_KEY' }))
    this.signTransaction = jest.fn(() => ({ signature: 'SIGNATURE' }))
    this.getAppConfiguration = jest.fn()
  }
}
