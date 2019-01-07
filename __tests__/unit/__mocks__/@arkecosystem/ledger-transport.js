export default class {
  constructor () {
    this.getAddress = jest.fn(() => ({
      address: 'DLWeBuwSBFYtUFj8kFB8CFswfvN2ht3yKn',
      publicKey: '0278a28d0eac9916ef46613d9dbac706acc218e64864d4b4c1fcb0c759b6205b2b'
    }))
    this.signTransaction = jest.fn(() => ({ signature: 'SIGNATURE' }))
    this.getAppConfiguration = jest.fn()
  }
}
