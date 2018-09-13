export default {
  generate: jest.fn(() => {
    return {
      address: 'Address',
      passphrase: 'passphrase'
    }
  }),
  validateAddress: jest.fn(() => true)
}
