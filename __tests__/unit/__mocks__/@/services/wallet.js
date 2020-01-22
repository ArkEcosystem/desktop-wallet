import WalletServiceOriginal from '../../../../../src/renderer/services/wallet'

export default {
  generate: jest.fn(() => {
    return {
      address: 'Address',
      passphrase: 'passphrase'
    }
  }),
  canResignBusiness: jest.fn(() => false),
  getAddressFromPublicKey: jest.fn(address => `public key of ${address}`),
  getPublicKeyFromPassphrase: jest.fn(passphrase => `public key of ${passphrase}`),
  getPublicKeyFromMultiSignatureAsset: jest.fn(multisignature => 'public key of multisignature'),
  validateAddress: jest.fn(() => true),
  validatePassphrase: jest.fn(() => true),
  validateUsername: jest.fn(WalletServiceOriginal.validateUsername),
  verifyPassphrase: jest.fn(() => true),
  isBip39Passphrase: jest.fn(() => true)
}
