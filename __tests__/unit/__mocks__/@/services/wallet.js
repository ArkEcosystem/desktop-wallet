export default {
  generate: jest.fn(() => {
    return {
      address: 'Address',
      passphrase: 'passphrase'
    }
  }),
  getAddressFromPublicKey: jest.fn(address => `public key of ${address}`),
  getPublicKeyFromPassphrase: jest.fn(passphrase => `public key of ${passphrase}`),
  getPublicKeyFromMultiSignatureAsset: jest.fn(multisignature => 'public key of multisignature'),
  validateAddress: jest.fn(() => true),
  validatePassphrase: jest.fn(() => true),
  verifyPassphrase: jest.fn(() => true),
  isBip39Passphrase: jest.fn(() => true)
}
