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
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config';
import { Crypto, Transactions } from '@arkecosystem/crypto';
import BigNumber from '@/plugins/bignumber';
var TransactionService = /** @class */ (function () {
    function TransactionService() {
    }
    /*
     * Get id for transaction.
     * @param {Object} transaction
     * @return {String}
     */
    TransactionService.getId = function (transaction) {
        return Transactions.Utils.getId(transaction);
    };
    /*
     * Get bytes for transaction.
     * @param {Object} transaction
     * @return {Buffer}
     */
    TransactionService.getBytes = function (transaction) {
        return Transactions.Serializer.getBytes(transaction, {
            excludeSignature: true,
            excludeSecondSignature: true
        });
    };
    /**
     * Get amount for transaction.
     * @param  {Object} vm
     * @param  {Object} transaction
     * @return {String}
     */
    TransactionService.getAmount = function (vm, transaction, wallet, includeFee) {
        if (includeFee === void 0) { includeFee = false; }
        var amount = vm.currency_toBuilder(0);
        var walletAddress = transaction.walletAddress || (wallet ? wallet.address : null);
        if (transaction.asset && transaction.asset.payments) {
            for (var _i = 0, _a = transaction.asset.payments; _i < _a.length; _i++) {
                var payment = _a[_i];
                if (walletAddress) {
                    if (walletAddress === transaction.sender && walletAddress === payment.recipientId) {
                        continue;
                    }
                    else if (walletAddress !== transaction.sender && walletAddress !== payment.recipientId) {
                        continue;
                    }
                }
                amount.add(payment.amount);
            }
        }
        else if (this.isTransfer(transaction)) {
            amount.add(transaction.amount);
        }
        if (includeFee && (!walletAddress || (walletAddress === transaction.sender))) {
            amount.add(transaction.fee);
        }
        return amount.value;
    };
    /**
     * Get hash for transaction.
     * @param  {Object}  transaction
     * @param  {Boolean} excludeMultiSignature
     * @return {Buffer}
     */
    TransactionService.getHash = function (transaction, excludeMultiSignature) {
        if (excludeMultiSignature === void 0) { excludeMultiSignature = true; }
        return Transactions.Utils.toHash(transaction, {
            excludeSignature: true,
            excludeSecondSignature: true,
            excludeMultiSignature: excludeMultiSignature
        });
    };
    /**
     * Get total amount for transaction.
     * @param  {Object} transaction
     * @return {String}
     */
    TransactionService.getTotalAmount = function (transaction) {
        return new BigNumber(transaction.amount).plus(transaction.fee).toString();
    };
    /*
     * Get bytes for transaction.
     * @param {Object} wallet
     * @param {Transaction} transactionObject
     * @param {Object} vm
     * @return {Object}
     */
    TransactionService.ledgerSign = function (wallet, transactionObject, vm) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transactionObject.senderPublicKey(wallet.publicKey);
                        transactionObject.sign('passphrase'); // Sign with a "fake" passphrase to get the transaction structure
                        transaction = transactionObject.getStruct();
                        transaction.senderPublicKey = wallet.publicKey; // Restore original sender public key
                        if (this.isVote(transactionObject.data)) {
                            transaction.recipientId = wallet.address;
                        }
                        _a = transaction;
                        return [4 /*yield*/, vm.$store.dispatch('ledger/signTransaction', {
                                transactionBytes: this.getBytes(transaction),
                                accountIndex: wallet.ledgerIndex
                            })];
                    case 1:
                        _a.signature = _b.sent();
                        if (!transaction.signature) {
                            throw new Error(vm.$t('TRANSACTION.LEDGER_USER_DECLINED'));
                        }
                        transaction.id = this.getId(transaction);
                        return [2 /*return*/, transaction];
                }
            });
        });
    };
    /**
     * Determine if transaction is a standard transaction.
     * @param  {Object} transaction
     * @return {Boolean}
     */
    TransactionService.isStandard = function (transaction) {
        return !transaction.typeGroup || transaction.typeGroup === TRANSACTION_GROUPS.STANDARD;
    };
    /**
     * Determine if transaction is a transfer.
     * @param  {Object} transaction
     * @return {Boolean}
     */
    TransactionService.isTransfer = function (transaction) {
        if (!this.isStandard(transaction)) {
            return false;
        }
        return transaction.type === TRANSACTION_TYPES.GROUP_1.TRANSFER;
    };
    /**
     * Determine if transaction is a vote.
     * @param  {Object} transaction
     * @return {Boolean}
     */
    TransactionService.isVote = function (transaction) {
        if (!this.isStandard(transaction)) {
            return false;
        }
        return transaction.type === TRANSACTION_TYPES.GROUP_1.VOTE;
    };
    /*
     * Sign message with Ledger.
     * @param {Object} wallet
     * @param {string} message
     * @return {Object}
     */
    TransactionService.ledgerSignMessage = function (wallet, message, vm) {
        return __awaiter(this, void 0, void 0, function () {
            var signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, vm.$store.dispatch('ledger/signMessage', {
                            messageBytes: Buffer.from(message, 'utf-8'),
                            accountIndex: wallet.ledgerIndex
                        })];
                    case 1:
                        signature = _a.sent();
                        if (!signature) {
                            throw new Error(vm.$t('TRANSACTION.LEDGER_USER_DECLINED'));
                        }
                        return [2 /*return*/, signature];
                }
            });
        });
    };
    TransactionService.isMultiSignature = function (transaction) {
        return !!transaction.multiSignature;
    };
    TransactionService.isMultiSignatureRegistration = function (transaction) {
        if (!this.isStandard(transaction)) {
            return false;
        }
        return transaction.type === TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE;
    };
    TransactionService.needsSignatures = function (transaction) {
        if (!this.isMultiSignature(transaction)) {
            return false;
        }
        if (this.isMultiSignatureRegistration(transaction)) {
            return this.needsAllSignatures(transaction);
        }
        return this.getValidMultiSignatures(transaction).length < transaction.multiSignature.min;
    };
    TransactionService.needsAllSignatures = function (transaction) {
        return this.getValidMultiSignatures(transaction).length < transaction.multiSignature.publicKeys.length;
    };
    TransactionService.needsWalletSignature = function (transaction, publicKey) {
        if (!this.needsSignatures(transaction) && !this.needsFinalSignature(transaction)) {
            return false;
        }
        if (this.isMultiSignatureRegistration(transaction) && this.isMultiSignatureReady(transaction, true)) {
            return transaction.senderPublicKey === publicKey && this.needsFinalSignature(transaction);
        }
        if (!this.isMultiSignature(transaction)) {
            return false;
        }
        var index = transaction.multiSignature.publicKeys.indexOf(publicKey);
        if (index === -1) {
            return false;
        }
        else if (!transaction.signatures) {
            return true;
        }
        var signature = transaction.signatures.find(function (signature) { return parseInt(signature.substring(0, 2), 16) === index; });
        if (!signature) {
            return true;
        }
        return !Crypto.Hash.verifySchnorr(this.getHash(transaction), signature.slice(2, 130), publicKey);
    };
    TransactionService.isMultiSignatureReady = function (transaction, excludeFinal) {
        if (excludeFinal === void 0) { excludeFinal = false; }
        if (this.needsSignatures(transaction)) {
            return false;
        }
        else if (!excludeFinal && this.isMultiSignatureRegistration(transaction) && this.needsFinalSignature(transaction)) {
            return false;
        }
        return true;
    };
    TransactionService.needsFinalSignature = function (transaction) {
        if (this.isMultiSignature(transaction) && !this.isMultiSignatureRegistration(transaction)) {
            return false;
        }
        return !transaction.signature || !Crypto.Hash.verifySchnorr(this.getHash(transaction, false), transaction.signature, transaction.senderPublicKey);
    };
    TransactionService.getValidMultiSignatures = function (transaction) {
        if (!this.isMultiSignature(transaction) || !transaction.signatures || !transaction.signatures.length) {
            return [];
        }
        var validSignatures = [];
        for (var _i = 0, _a = transaction.signatures; _i < _a.length; _i++) {
            var signature = _a[_i];
            var publicKeyIndex = parseInt(signature.slice(0, 2), 16);
            var partialSignature = signature.slice(2, 130);
            var publicKey = transaction.multiSignature.publicKeys[publicKeyIndex];
            if (Crypto.Hash.verifySchnorr(this.getHash(transaction), partialSignature, publicKey)) {
                validSignatures.push(signature);
            }
        }
        return validSignatures;
    };
    TransactionService.isBridgechainRegistration = function (transaction) {
        return !!(transaction.asset && transaction.asset.bridgechainRegistration);
    };
    TransactionService.isBridgechainUpdate = function (transaction) {
        return !!(transaction.asset && transaction.asset.bridgechainUpdate);
    };
    TransactionService.isBridgechainResignation = function (transaction) {
        return !!(transaction.asset && transaction.asset.bridgechainResignation);
    };
    return TransactionService;
}());
export default TransactionService;
//# sourceMappingURL=transaction.js.map