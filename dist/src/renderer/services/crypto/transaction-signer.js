var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Identities, Transactions } from '@arkecosystem/crypto';
import { dayjs } from '@/services/datetime';
import store from '@/store';
import TransactionService from '@/services/transaction';
import WalletService from '@/services/wallet';
import { CryptoUtils } from './utils';
var TransactionSigner = /** @class */ (function () {
    function TransactionSigner() {
    }
    TransactionSigner.sign = function (_a, returnObject) {
        var transaction = _a.transaction, passphrase = _a.passphrase, secondPassphrase = _a.secondPassphrase, wif = _a.wif, networkWif = _a.networkWif, networkId = _a.networkId, multiSignature = _a.multiSignature, nonce = _a.nonce;
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            var network, epochTime, now, senderPublicKey, publicKeyIndex, transactionJson, response;
            return __generator(this, function (_b) {
                if (networkId) {
                    network = store.getters['network/byId'](networkId);
                }
                if (!network) {
                    network = store.getters['session/network'];
                }
                transaction = transaction.network(network.version);
                epochTime = dayjs(network.constants.epoch)
                    .utc()
                    .valueOf();
                now = dayjs().valueOf();
                transaction.data.timestamp = Math.floor((now - epochTime) / 1000);
                if (passphrase) {
                    passphrase = CryptoUtils.normalizePassphrase(passphrase);
                }
                if (network.constants.aip11) {
                    transaction.version(2).nonce(nonce);
                }
                else {
                    transaction.version(1);
                }
                if (multiSignature) {
                    senderPublicKey = null;
                    if (passphrase) {
                        senderPublicKey = WalletService.getPublicKeyFromPassphrase(passphrase);
                    }
                    else if (wif) {
                        senderPublicKey = WalletService.getPublicKeyFromWIF(wif);
                    }
                    publicKeyIndex = multiSignature.publicKeys.indexOf(senderPublicKey);
                    transaction.senderPublicKey(senderPublicKey);
                    if (publicKeyIndex > -1) {
                        if (passphrase) {
                            transaction.multiSign(passphrase, publicKeyIndex);
                        }
                        else if (wif) {
                            transaction.multiSignWithWif(publicKeyIndex, wif, networkWif);
                        }
                    }
                    else if (TransactionService.isMultiSignatureRegistration(transaction.data) &&
                        !transaction.data.signatures) {
                        transaction.data.signatures = [];
                    }
                }
                else {
                    if (passphrase) {
                        transaction.sign(passphrase);
                    }
                    else if (wif) {
                        transaction.signWithWif(wif, networkWif);
                    }
                    if (secondPassphrase) {
                        transaction.secondSign(CryptoUtils.normalizePassphrase(secondPassphrase));
                    }
                }
                if (returnObject) {
                    return [2 /*return*/, transaction];
                }
                if (multiSignature) {
                    if (!transaction.data.senderPublicKey) {
                        transaction.senderPublicKey(WalletService.getPublicKeyFromMultiSignatureAsset(multiSignature));
                    }
                    transactionJson = transaction.build().toJson();
                    transactionJson.multiSignature = multiSignature;
                    if (!transactionJson.signatures) {
                        transactionJson.signatures = [];
                    }
                    return [2 /*return*/, transactionJson];
                }
                response = transaction.build().toJson();
                response.totalAmount = TransactionService.getTotalAmount(response);
                return [2 /*return*/, response];
            });
        });
    };
    // todo: why is this async? it doesn't make any use of promises or await
    TransactionSigner.multiSign = function (transaction, _a) {
        var multiSignature = _a.multiSignature, networkWif = _a.networkWif, passphrase = _a.passphrase, secondPassphrase = _a.secondPassphrase, wif = _a.wif;
        return __awaiter(this, void 0, void 0, function () {
            var network, keys, isReady, index, secondaryKeys;
            return __generator(this, function (_b) {
                if (!passphrase && !wif) {
                    throw new Error('No passphrase or wif provided');
                }
                transaction = CryptoUtils.transactionFromData(transaction);
                network = store.getters['session/network'];
                if (!network.constants.aip11) {
                    throw new Error('Multi-Signature Transactions are not supported yet');
                }
                if (passphrase) {
                    keys = Identities.Keys.fromPassphrase(passphrase);
                }
                else {
                    keys = Identities.Keys.fromWIF(wif, { wif: networkWif });
                }
                isReady = TransactionService.isMultiSignatureReady(__assign(__assign({}, transaction), { multiSignature: multiSignature, signatures: __spreadArrays(transaction.signatures) }), true);
                if (!isReady) {
                    index = multiSignature.publicKeys.indexOf(keys.publicKey);
                    if (index >= 0) {
                        Transactions.Signer.multiSign(transaction, keys, index);
                        transaction.signatures = transaction.signatures.filter(function (value, index, self) {
                            return self.indexOf(value) === index;
                        });
                    }
                    else {
                        throw new Error('passphrase/wif is not used to sign this transaction');
                    }
                }
                else if (TransactionService.needsWalletSignature(transaction, keys.publicKey)) {
                    Transactions.Signer.sign(transaction, keys);
                    if (secondPassphrase) {
                        secondaryKeys = Identities.Keys.fromPassphrase(secondPassphrase);
                        Transactions.Signer.secondSign(transaction, secondaryKeys);
                    }
                    transaction.id = TransactionService.getId(transaction);
                }
                return [2 /*return*/, __assign(__assign({}, transaction), { multiSignature: multiSignature })];
            });
        });
    };
    return TransactionSigner;
}());
export { TransactionSigner };
//# sourceMappingURL=transaction-signer.js.map