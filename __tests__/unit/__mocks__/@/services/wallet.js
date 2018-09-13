export default {
  generate: jest.fn(() => {
    return {
      address: 'Address',
      passphrase: 'passphrase'
    }
  }),
  validateAddress: jest.fn(() => true),
  validatePassphrase: jest.fn(() => true),
  verifyPassphrase: jest.fn(() => true)
}
