import WalletServiceOriginal from '../../../../../src/renderer/services/wallet';
export default {
    generate: jest.fn(function () {
        return {
            address: 'Address',
            passphrase: 'passphrase'
        };
    }),
    canResignBusiness: jest.fn(function () { return false; }),
    getAddressFromPublicKey: jest.fn(function (publicKey) { return "address of " + publicKey; }),
    getPublicKeyFromPassphrase: jest.fn(function (passphrase) { return "public key of " + passphrase; }),
    getPublicKeyFromMultiSignatureAsset: jest.fn(function () { return 'public key of multisignature'; }),
    generateSecondPassphrase: jest.fn(function () { return 'second-passphrase'; }),
    validateAddress: jest.fn(function () { return true; }),
    validatePassphrase: jest.fn(function () { return true; }),
    validateUsername: jest.fn(WalletServiceOriginal.validateUsername),
    verifyPassphrase: jest.fn(function () { return true; }),
    isBip39Passphrase: jest.fn(function () { return true; }),
    isNeoAddress: jest.fn(function () { return false; })
};
//# sourceMappingURL=wallet.js.map