import WalletServiceOriginal from '../../../../../src/renderer/services/wallet'

export default {
  generate: jest.fn(() => {
    return {
      address: 'Address',
      passphrase: 'passphrase'
    }
  }),
  getAddressFromPublicKey: jest.fn(publicKey => `address of ${publicKey}`),
  getPublicKeyFromPassphrase: jest.fn(passphrase => `public key of ${passphrase}`),
  getPublicKeyFromMultiSignatureAsset: jest.fn(() => 'public key of multisignature'),
  generateSecondPassphrase: jest.fn(() => 'second-passphrase'),
  validateAddress: jest.fn(() => true),
  validatePassphrase: jest.fn(() => true),
  validateUsername: jest.fn(WalletServiceOriginal.validateUsername),
  verifyPassphrase: jest.fn(() => true),
  isBip39Passphrase: jest.fn(() => true),
  isNeoAddress: jest.fn(() => false)
}
