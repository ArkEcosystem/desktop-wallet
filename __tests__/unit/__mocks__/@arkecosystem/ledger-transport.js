export class ARKTransport {
  constructor () {
    this.getPublicKey = jest.fn(() => '0278a28d0eac9916ef46613d9dbac706acc218e64864d4b4c1fcb0c759b6205b2b')
    this.signMessage = jest.fn(() => 'SIGNATURE')
    this.signMessageWithSchnorr = jest.fn(() => 'SIGNATURE')
    this.signTransaction = jest.fn(() => 'SIGNATURE')
    this.signTransactionWithSchnorr = jest.fn(() => 'SIGNATURE')
    this.getVersion = jest.fn(() => '1.0.0')
  }
}
