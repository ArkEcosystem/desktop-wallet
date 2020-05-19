var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as bip39 from 'bip39';
import { Crypto, Identities } from '@arkecosystem/crypto';
import { version as mainnetVersion } from '@config/networks/mainnet';
import store from '@/store';
import { CryptoUtils } from './crypto/utils';
import { reqwest } from '@/utils/http';
var WalletService = /** @class */ (function () {
    function WalletService() {
    }
    /*
     * Generate a wallet.
     * It does not check if the wallet is new (no transactions on the blockchain)
     * @param {Number} pubKeyHash - also known as address or network version
     * @return {Object}
     */
    WalletService.generate = function (pubKeyHash, language) {
        var passphrase = bip39.generateMnemonic(null, null, bip39.wordlists[language]);
        var publicKey = Identities.Keys.fromPassphrase(CryptoUtils.normalizePassphrase(passphrase)).publicKey;
        return {
            address: Identities.Address.fromPublicKey(publicKey, pubKeyHash),
            passphrase: passphrase
        };
    };
    /**
     * Generates a new passphrase to be used for a second passphrase
     */
    WalletService.generateSecondPassphrase = function (language) {
        return bip39.generateMnemonic(null, null, bip39.wordlists[language]);
    };
    /**
     * Returns the address that correspond to a passphrase
     * @param {String} passphrase
     * @param {Number} pubKeyHash - also known as address or network version
     * @return {String}
     */
    WalletService.getAddress = function (passphrase, pubKeyHash) {
        return Identities.Address.fromPassphrase(CryptoUtils.normalizePassphrase(passphrase), pubKeyHash);
    };
    WalletService.getAddressFromPublicKey = function (publicKey, pubKeyHash) {
        return Identities.Address.fromPublicKey(publicKey, pubKeyHash);
    };
    /**
     * Returns the address generated from a multi-signature registration.
     * @param {Object} multiSignatureAsset
     * @return {String}
     */
    WalletService.getAddressFromMultiSignatureAsset = function (multiSignatureAsset) {
        return Identities.Address.fromMultiSignatureAsset(multiSignatureAsset);
    };
    /**
     * Generates the public key belonging to a wallet
     * @param {Object} wallet
     * @return {String|null}
     */
    WalletService.getPublicKeyFromWallet = function (wallet) {
        if (!wallet) {
            return null;
        }
        if (wallet.multiSignature) {
            return this.getPublicKeyFromMultiSignatureAsset(wallet.multiSignature);
        }
        return wallet.publicKey || null;
    };
    /**
     * Generates the public key belonging to the given passphrase
     * @param {String} passphrase
     * @return {String}
     */
    WalletService.getPublicKeyFromPassphrase = function (passphrase) {
        return Identities.PublicKey.fromPassphrase(CryptoUtils.normalizePassphrase(passphrase));
    };
    /**
     * Generates the public key belonging to the given wif
     * @param {String} wif
     * @return {String}
     */
    WalletService.getPublicKeyFromWIF = function (wif) {
        return Identities.PublicKey.fromWIF(wif);
    };
    /**
     * Returns the public key generated from a multi-signature registration.
     * @param {Object} multiSignatureAsset
     * @return {String}
     */
    WalletService.getPublicKeyFromMultiSignatureAsset = function (multiSignatureAsset) {
        return Identities.PublicKey.fromMultiSignatureAsset(multiSignatureAsset);
    };
    /**
     * Check if a specific address contain data in the NEO Blockchain
     * @param {String} address
     * @returns {Boolean}
     */
    WalletService.isNeoAddress = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var neoUrl, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!WalletService.validateAddress(address, mainnetVersion)) {
                            return [2 /*return*/, false];
                        }
                        neoUrl = 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/';
                        return [4 /*yield*/, reqwest(neoUrl + address, {
                                json: true
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.statusCode === 200 && response.body && response.body.length > 0];
                }
            });
        });
    };
    /**
     * Check if a wallet can resign as a delegate
     * @param {Object} wallet
     * @returns {Boolean}
     */
    WalletService.canResignDelegate = function (wallet) {
        if (!wallet.isDelegate) {
            return false;
        }
        return !wallet.isResigned;
    };
    /**
     * Check if a wallet is a business wallet
     * @param {Object} wallet
     * @param {Boolean} ignoreResigned
     * @returns {Boolean}
     */
    WalletService.isBusiness = function (wallet, ignoreResigned) {
        if (ignoreResigned === void 0) { ignoreResigned = true; }
        if (!wallet.business) {
            return false;
        }
        if (ignoreResigned) {
            return !!wallet.business.name;
        }
        return !wallet.business.resigned;
    };
    /**
     * Check if a wallet can resign as a business
     * @param {Object} wallet
     * @returns {Boolean}
     */
    WalletService.canResignBusiness = function (wallet) {
        if (!wallet.business) {
            return false;
        }
        return !wallet.business.resigned;
    };
    /**
     * Check if a wallet business has bridgechains
     * @param {Object} wallet
     * @returns {Boolean}
     */
    WalletService.hasBridgechains = function (wallet, vm) {
        return __awaiter(this, void 0, void 0, function () {
            var bridegchains, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, vm.$client.fetchBusinessBridgechains(wallet.address)];
                    case 1:
                        bridegchains = _a.sent();
                        return [2 /*return*/, bridegchains.data.filter(function (bridgechain) { return !bridgechain.isResigned; }).length > 0];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Signs a message by using the given passphrase.
     * @param {String} message
     * @param {String} passphrase
     * @return {String}
     */
    WalletService.signMessage = function (message, passphrase) {
        return Crypto.Message.sign(message, CryptoUtils.normalizePassphrase(passphrase));
    };
    /**
     * Signs a message by using the given wif.
     * @param {String} message
     * @param {Number} wif
     * @param {Object} [network]
     * @return {String}
     */
    WalletService.signMessageWithWif = function (message, wif, network) {
        return Crypto.Message.signWithWif(message, wif, network);
    };
    /**
     * Verify a given message based on the given public key and signature.
     * @param {String} message
     * @param {String} publicKey
     * @param {String} signature
     * @return {String}
     */
    WalletService.verifyMessage = function (message, publicKey, signature) {
        return Crypto.Message.verify({ message: message, publicKey: publicKey, signature: signature });
    };
    /**
     * Check that an address is valid.
     * @param {Number} pubKeyHash - also known as address or network version
     * @return {Boolean}
     */
    WalletService.validateAddress = function (address, pubKeyHash) {
        return Identities.Address.validate(address, pubKeyHash);
    };
    /**
     * TODO: Is this necessary? A passphrase is always valid as long as it's a string.
     *
     * Check that a passphrase is valid.
     * @param {String} passhrase
     * @param {Number} pubKeyHash - also known as address or network version
     * @return {Boolean}
     */
    WalletService.validatePassphrase = function (passphrase, pubKeyHash) {
        var publicKey = Identities.Keys.fromPassphrase(CryptoUtils.normalizePassphrase(passphrase)).publicKey;
        return Identities.PublicKey.validate(publicKey, pubKeyHash);
    };
    /**
     * Check that a passphrase is valid bip39 passphrase.
     * @param {String} passhrase
     * @param {Number} language - bip39 wordlist language
     * @return {Boolean}
     */
    WalletService.isBip39Passphrase = function (passphrase, language) {
        return bip39.validateMnemonic(CryptoUtils.normalizePassphrase(passphrase), bip39.wordlists[language]);
    };
    /**
     * Check that a username is valid
     *
     * @param {String} username
     * @return {Object} { errors: Array, passes: Boolean }
     */
    WalletService.validateUsername = function (username) {
        var errors = [];
        if (username.length < 1) {
            errors.push({ type: 'empty' });
        }
        else if (username.length > 20) {
            errors.push({ type: 'maxLength' });
        }
        else if (store.getters['delegate/byUsername'](username)) {
            errors.push({ type: 'exists' });
            // Regex from `@arkecosystem/crypto`
        }
        else if (!username.match(/^[a-z0-9!@$&_.]+$/)) {
            errors.push({ type: 'invalidFormat' });
        }
        return {
            errors: errors,
            passes: errors.length === 0
        };
    };
    /**
     * Check that a password match an address
     * @param {String} address
     * @param {String} passhrase
     * @param {Number} pubKeyHash - also known as address or network version
     * @return {Boolean}
     */
    WalletService.verifyPassphrase = function (address, passphrase, pubKeyHash) {
        return address === WalletService.getAddress(CryptoUtils.normalizePassphrase(passphrase), pubKeyHash);
    };
    return WalletService;
}());
export default WalletService;
//# sourceMappingURL=wallet.js.map