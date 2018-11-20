export default {
  generate: jest.fn(() => {
    return {
      address: 'Address',
      passphrase: 'passphrase'
    }
  }),
  getAddressFromPublicKey: jest.fn(address => `public key of ${address}`),
  validateAddress: jest.fn(() => true),
  validatePassphrase: jest.fn(() => true),
  verifyPassphrase: jest.fn(() => true)
}
