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
import { Crypto, Identities, Managers, Transactions } from '@arkecosystem/crypto';
import * as MagistrateCrypto from '@arkecosystem/core-magistrate-crypto';
import TransactionService from '@/services/transaction';
import transactionFixture from '../__fixtures__/models/transaction';
import currencyMixin from '@/mixins/currency';
Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BusinessRegistrationTransaction);
Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BridgechainRegistrationTransaction);
var recipientAddress = Identities.Address.fromPassphrase('recipient passphrase');
var senderPassphrase = 'sender passphrase';
var senderPublicKey = Identities.PublicKey.fromPassphrase(senderPassphrase);
var mockVm = {
    currency_toBuilder: function (value) {
        return currencyMixin.methods.currency_toBuilder(value, {
            fractionDigits: 8
        });
    }
};
describe('Services > Transaction', function () {
    describe('getId', function () {
        it('should return the transaction id', function () {
            expect(TransactionService.getId(transactionFixture)).toBe(transactionFixture.id);
        });
    });
    describe('getBytes', function () {
        it('should return the transaction bytes', function () {
            var transactionBytes = TransactionService.getBytes(transactionFixture);
            expect(transactionBytes).toBeInstanceOf(Buffer);
            expect(transactionBytes).toEqual(Buffer.from('00f0eb920302275d8577a0ec2b75fc8683282d53c5db76ebc54514a80c2854e419b793ea259a17ee9f689978490631699e01ca0fc2edbecb5ee0390000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000008096980000000000', 'hex'));
        });
    });
    describe('getHash', function () {
        var passphrase = 'test passphrase';
        var transaction;
        beforeEach(function () {
            Managers.configManager.getMilestone().aip11 = true;
            transaction = Transactions.BuilderFactory
                .multiSignature()
                .multiSignatureAsset({
                min: 1,
                publicKeys: [
                    Identities.PublicKey.fromPassphrase(passphrase)
                ]
            })
                .sign('passphrase')
                .fee(1);
        });
        it('should return hash excluding multisig signatures', function () {
            var hash = TransactionService.getHash(transaction.getStruct()).toString('hex');
            transaction.multiSign(passphrase, 0);
            expect(TransactionService.getHash(transaction.getStruct()).toString('hex')).toBe(hash);
        });
        it('should return hash including multisig signatures', function () {
            var hash = TransactionService.getHash(transaction.getStruct()).toString('hex');
            transaction.multiSign(passphrase, 0);
            expect(TransactionService.getHash(transaction.getStruct(), false).toString('hex')).not.toBe(hash);
        });
    });
    describe('getAmount', function () {
        describe('standard transaction', function () {
            var transaction;
            beforeEach(function () {
                transaction = Transactions.BuilderFactory
                    .transfer()
                    .amount('100000000')
                    .fee('10000000')
                    .recipientId(recipientAddress)
                    .sign('passphrase')
                    .build()
                    .toJson();
            });
            it('should get correct amount with fee', function () {
                expect(TransactionService.getAmount(mockVm, transaction, null, true).toFixed()).toEqual('110000000');
            });
            it('should get correct amount without fee', function () {
                expect(TransactionService.getAmount(mockVm, transaction).toFixed()).toEqual('100000000');
            });
        });
        describe('multi-payment transaction', function () {
            var transaction;
            beforeEach(function () {
                transaction = Transactions.BuilderFactory
                    .multiPayment()
                    .addPayment(Identities.Address.fromPassphrase('recipient 1'), '100000000')
                    .addPayment(Identities.Address.fromPassphrase('recipient 2'), '100000000')
                    .addPayment(Identities.Address.fromPassphrase('recipient 3'), '100000000')
                    .fee('10000000')
                    .recipientId(recipientAddress)
                    .sign('passphrase')
                    .build()
                    .toJson();
                transaction.sender = Identities.Address.fromPassphrase('passphrase');
            });
            it('should get correct amount with fee', function () {
                expect(TransactionService.getAmount(mockVm, transaction, null, true).toFixed()).toEqual('310000000');
            });
            it('should get correct amount without fee', function () {
                expect(TransactionService.getAmount(mockVm, transaction).toFixed()).toEqual('300000000');
            });
            it('should get correct amount if sender including fee', function () {
                var wallet = {
                    address: Identities.Address.fromPassphrase('passphrase')
                };
                expect(TransactionService.getAmount(mockVm, transaction, wallet, true).toFixed()).toEqual('310000000');
            });
            it('should get correct amount if recipient including fee', function () {
                var wallet = {
                    address: Identities.Address.fromPassphrase('recipient 3')
                };
                expect(TransactionService.getAmount(mockVm, transaction, wallet, true).toFixed()).toEqual('100000000');
            });
        });
    });
    describe('isMultiSignature', function () {
        it('should return true if has multiSignature property', function () {
            var transaction = __assign(__assign({}, transactionFixture), { multiSignature: { min: 1, publicKeys: [] } });
            expect(TransactionService.isMultiSignature(transaction)).toBe(true);
        });
        it('should return false if no multiSignature property', function () {
            var transaction = __assign({}, transactionFixture);
            expect(TransactionService.isMultiSignature(transaction)).toBe(false);
        });
    });
    describe('isMultiSignatureRegistration', function () {
        it('should return true if multiSignature transaction', function () {
            Managers.configManager.getMilestone().aip11 = true;
            var transaction = Transactions.BuilderFactory
                .multiSignature()
                .multiSignatureAsset({
                min: 1,
                publicKeys: []
            })
                .sign('passphrase')
                .fee(1)
                .getStruct();
            expect(TransactionService.isMultiSignatureRegistration(transaction)).toBe(true);
        });
        it('should return false if no multiSignature property', function () {
            var transaction = __assign({}, transactionFixture);
            expect(TransactionService.isMultiSignature(transaction)).toBe(false);
        });
    });
    describe('getValidMultiSignatures', function () {
        var multiSignatureAsset, passphrases, transaction;
        beforeEach(function () {
            Managers.configManager.getMilestone().aip11 = true;
            passphrases = [
                'passphrase 1',
                'passphrase 2',
                'passphrase 3'
            ];
            multiSignatureAsset = {
                min: 1,
                publicKeys: passphrases.map(function (passphrase) { return Identities.PublicKey.fromPassphrase(passphrase); })
            };
            transaction = Transactions.BuilderFactory
                .multiSignature()
                .multiSignatureAsset(multiSignatureAsset)
                .fee(1);
            transaction.data.senderPublicKey = senderPublicKey;
        });
        it('should return only valid signatures', function () {
            transaction.multiSign(passphrases[2], 2)
                .multiSign(passphrases[0], 0)
                .multiSign('wrong passphrase', 1);
            var transactionJson = transaction.getStruct();
            transactionJson.multiSignature = multiSignatureAsset;
            var validSignatures = TransactionService.getValidMultiSignatures(transactionJson);
            expect(validSignatures.map(function (signature) { return parseInt(signature.substring(0, 2)); })).toIncludeSameMembers([0, 2]);
        });
        it('should return empty array if not multiSignature object', function () {
            expect(TransactionService.getValidMultiSignatures(transaction)).toEqual([]);
        });
    });
    describe('needsSignatures', function () {
        it('should check if all signatures are needed for multisig registration', function () {
            var multiSignatureAsset = {
                min: 1,
                publicKeys: []
            };
            var transaction = Transactions.BuilderFactory
                .multiSignature()
                .multiSignatureAsset(multiSignatureAsset)
                .sign('passphrase')
                .fee(1)
                .getStruct();
            var spy = jest.spyOn(TransactionService, 'needsAllSignatures')
                .mockImplementation();
            transaction.multiSignature = multiSignatureAsset;
            TransactionService.needsSignatures(transaction);
            expect(spy).toHaveBeenCalledWith(transaction);
            spy.mockRestore();
        });
        it('should return false if no multiSignature property', function () {
            var transaction = Transactions.BuilderFactory
                .transfer()
                .amount(1)
                .fee(1)
                .recipientId(recipientAddress)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.needsSignatures(transaction)).toBe(false);
        });
        it('should return true when below min required signatures', function () {
            var multiSignatureAsset = {
                min: 5,
                publicKeys: []
            };
            for (var i = 1; i <= 10; i++) {
                multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
            }
            var transactionObject = Transactions.BuilderFactory
                .transfer()
                .amount(1)
                .fee(1)
                .recipientId(recipientAddress);
            transactionObject.data.senderPublicKey = senderPublicKey;
            transactionObject.data.signatures = [];
            var transaction = transactionObject.getStruct();
            transaction.multiSignature = multiSignatureAsset;
            expect(TransactionService.needsSignatures(transaction)).toBe(true);
        });
        it('should return false when above min required signatures', function () {
            var multiSignatureAsset = {
                min: 5,
                publicKeys: []
            };
            for (var i = 1; i <= 10; i++) {
                multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
            }
            var transactionObject = Transactions.BuilderFactory
                .transfer()
                .amount(1)
                .fee(1)
                .recipientId(recipientAddress);
            transactionObject.data.senderPublicKey = senderPublicKey;
            transactionObject.data.signatures = [];
            for (var i = 1; i <= multiSignatureAsset.min + 1; i++) {
                transactionObject.multiSign("passphrase " + i);
            }
            var transaction = transactionObject.getStruct();
            transaction.multiSignature = multiSignatureAsset;
            expect(TransactionService.needsSignatures(transaction)).toBe(false);
        });
    });
    describe('needsAllSignatures', function () {
        var multiSignatureAsset, transactionObject;
        beforeEach(function () {
            multiSignatureAsset = {
                min: 5,
                publicKeys: []
            };
            for (var i = 1; i <= 10; i++) {
                multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
            }
            transactionObject = Transactions.BuilderFactory
                .multiSignature()
                .multiSignatureAsset(multiSignatureAsset)
                .fee(1);
            transactionObject.data.senderPublicKey = senderPublicKey;
            transactionObject.data.signatures = [];
        });
        it('should call getValidMultiSignatures', function () {
            for (var i = 1; i <= multiSignatureAsset.min - 1; i++) {
                transactionObject.multiSign("passphrase " + i);
            }
            var transaction = transactionObject.getStruct();
            transaction.multiSignature = multiSignatureAsset;
            var spy = jest.spyOn(TransactionService, 'getValidMultiSignatures');
            TransactionService.needsAllSignatures(transaction);
            expect(spy).toHaveBeenCalledWith(transaction);
            spy.mockRestore();
        });
        it('should return true when signatures are missing', function () {
            for (var i = 1; i <= multiSignatureAsset.min - 1; i++) {
                transactionObject.multiSign("passphrase " + i);
            }
            var transaction = transactionObject.getStruct();
            transaction.multiSignature = multiSignatureAsset;
            expect(TransactionService.needsAllSignatures(transaction)).toBe(true);
        });
        it('should return true when incorrect signatures are provided', function () {
            for (var i = 1; i <= multiSignatureAsset.min - 1; i++) {
                transactionObject.multiSign("passphrase " + i);
            }
            transactionObject.multiSign('wrong passphrase');
            var transaction = transactionObject.getStruct();
            transaction.multiSignature = multiSignatureAsset;
            expect(TransactionService.needsAllSignatures(transaction)).toBe(true);
        });
        it('should return false when no signatures are missing', function () {
            for (var i = 1; i <= multiSignatureAsset.min; i++) {
                transactionObject.multiSign("passphrase " + i);
            }
            var transaction = transactionObject.getStruct();
            transaction.multiSignature = multiSignatureAsset;
            expect(TransactionService.needsAllSignatures(transaction)).toBe(true);
        });
    });
    describe('needsWalletSignature', function () {
        describe('multi-signature registration', function () {
            var multiSignatureAsset, transaction, transactionObject;
            beforeEach(function () {
                multiSignatureAsset = {
                    min: 5,
                    publicKeys: []
                };
                for (var i = 1; i <= 10; i++) {
                    multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
                }
                transactionObject = Transactions.BuilderFactory
                    .multiSignature()
                    .multiSignatureAsset(multiSignatureAsset)
                    .fee(1);
                transactionObject.data.senderPublicKey = senderPublicKey;
                transactionObject.data.signatures = [];
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
            });
            it('should check if transaction is ready', function () {
                var spy = jest.spyOn(TransactionService, 'isMultiSignatureReady')
                    .mockImplementation(function () { return false; });
                TransactionService.needsWalletSignature(transaction, transactionObject.data.senderPublicKey);
                expect(spy).toHaveBeenCalledWith(transaction, true);
                spy.mockRestore();
            });
            it('should check for final signature', function () {
                var spyReady = jest.spyOn(TransactionService, 'isMultiSignatureReady')
                    .mockImplementation(function () { return true; });
                var spyFinalSignature = jest.spyOn(TransactionService, 'needsFinalSignature')
                    .mockImplementation(function () { return false; });
                TransactionService.needsWalletSignature(transaction, transactionObject.data.senderPublicKey);
                expect(spyFinalSignature).toHaveBeenCalledWith(transaction);
                spyReady.mockRestore();
                spyFinalSignature.mockRestore();
            });
            it('should match public key', function () {
                var spyReady = jest.spyOn(TransactionService, 'isMultiSignatureReady')
                    .mockImplementation(function () { return true; });
                var spyFinalSignature = jest.spyOn(TransactionService, 'needsFinalSignature')
                    .mockImplementation(function () { return false; });
                expect(TransactionService.needsWalletSignature(transaction, 'fake public key')).toBe(false);
                expect(spyFinalSignature).not.toHaveBeenCalledWith(transaction);
                spyReady.mockRestore();
                spyFinalSignature.mockRestore();
            });
            it('should return true if no final signature', function () {
                for (var i = 1; i <= 10; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                expect(TransactionService.needsWalletSignature(transaction, senderPublicKey)).toBe(true);
            });
            it('should return false if all signatures (including final)', function () {
                for (var i = 1; i <= 10; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transactionObject.sign(senderPassphrase);
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                expect(TransactionService.needsWalletSignature(transaction, senderPublicKey)).toBe(false);
            });
        });
        describe('non-registration', function () {
            var multiSignatureAsset, transaction, transactionObject;
            beforeEach(function () {
                multiSignatureAsset = {
                    min: 5,
                    publicKeys: []
                };
                for (var i = 1; i <= 10; i++) {
                    multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
                }
                transactionObject = Transactions.BuilderFactory
                    .transfer()
                    .amount(1)
                    .fee(1)
                    .recipientId(recipientAddress);
                transactionObject.data.senderPublicKey = senderPublicKey;
                transactionObject.data.signatures = [];
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
            });
            it('should return false if no multiSignature property', function () {
                transaction.multiSignature = undefined;
                expect(TransactionService.needsWalletSignature(transaction, 'public key')).toBe(false);
            });
            it('should return false if public key is not required for multi-signature', function () {
                expect(TransactionService.needsWalletSignature(transaction, 'public key')).toBe(false);
            });
            it('should return true if no signatures property', function () {
                transaction.signatures = undefined;
                expect(TransactionService.needsWalletSignature(transaction, multiSignatureAsset.publicKeys[0])).toBe(true);
            });
            it('should return true if signature is missing', function () {
                expect(TransactionService.needsWalletSignature(transaction, multiSignatureAsset.publicKeys[0])).toBe(true);
            });
            it('should return false if signature exists', function () {
                transactionObject.multiSign('passphrase 1');
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                expect(TransactionService.needsWalletSignature(transaction, multiSignatureAsset.publicKeys[0])).toBe(false);
            });
            it('should return false if min keys is met', function () {
                for (var i = 1; i <= multiSignatureAsset.min; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                expect(TransactionService.needsWalletSignature(transaction, multiSignatureAsset.publicKeys[9])).toBe(false);
            });
        });
    });
    describe('needsFinalSignature', function () {
        var multiSignatureAsset, transactionObject, transaction;
        beforeEach(function () {
            multiSignatureAsset = {
                min: 5,
                publicKeys: []
            };
            for (var i = 1; i <= 10; i++) {
                multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
            }
            transactionObject = Transactions.BuilderFactory
                .multiSignature()
                .multiSignatureAsset(multiSignatureAsset)
                .fee(1);
            transactionObject.data.senderPublicKey = senderPublicKey;
            transactionObject.data.signatures = [];
            transaction = transactionObject.getStruct();
        });
        it('should return true if no signature property', function () {
            transaction.signature = undefined;
            expect(TransactionService.needsFinalSignature(transaction)).toBe(true);
        });
        it('should return true if signed before multi-sign signatures', function () {
            transactionObject.sign(senderPassphrase);
            for (var i = 1; i <= 10; i++) {
                transactionObject.multiSign("passphrase " + i);
            }
            transaction = transactionObject.getStruct();
            expect(TransactionService.needsFinalSignature(transaction)).toBe(true);
        });
        it('should return false if signed after multi-sign signatures', function () {
            for (var i = 1; i <= 10; i++) {
                transactionObject.multiSign("passphrase " + i);
            }
            transactionObject.sign(senderPassphrase);
            transaction = transactionObject.getStruct();
            expect(TransactionService.needsFinalSignature(transaction)).toBe(false);
        });
        it('should return false if signed', function () {
            transactionObject.sign(senderPassphrase);
            transaction = transactionObject.getStruct();
            expect(TransactionService.needsFinalSignature(transaction)).toBe(false);
        });
        it('should return false if multi-signature but not registration', function () {
            transactionObject = Transactions.BuilderFactory
                .transfer()
                .amount(1)
                .fee(1)
                .recipientId(recipientAddress);
            transactionObject.data.senderPublicKey = senderPublicKey;
            transactionObject.data.signatures = [];
            transaction = transactionObject.getStruct();
            transaction.multiSignature = multiSignatureAsset;
            var spy = jest.spyOn(Crypto.Hash, 'verifySchnorr');
            expect(TransactionService.needsFinalSignature(transaction)).toBe(false);
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();
        });
    });
    describe('isMultiSignatureReady', function () {
        describe('multi-signature registration', function () {
            var publicKeyCount = 10;
            var multiSignatureAsset, spyRegistration, spyNeedsSignatures, transaction, transactionObject;
            beforeEach(function () {
                multiSignatureAsset = {
                    min: 5,
                    publicKeys: []
                };
                for (var i = 1; i <= publicKeyCount; i++) {
                    multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
                }
                transactionObject = Transactions.BuilderFactory
                    .multiSignature()
                    .multiSignatureAsset(multiSignatureAsset)
                    .fee(1);
                transactionObject.data.senderPublicKey = senderPublicKey;
                transactionObject.data.signatures = [];
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                spyRegistration = jest.spyOn(TransactionService, 'isMultiSignatureRegistration');
                spyNeedsSignatures = jest.spyOn(TransactionService, 'needsSignatures');
            });
            afterEach(function () {
                spyRegistration.mockRestore();
                spyNeedsSignatures.mockRestore();
            });
            it('should return true if multi-signed and with primary passphrase', function () {
                for (var i = 1; i <= publicKeyCount; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transactionObject.sign(senderPassphrase);
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var spyNeedsFinal = jest.spyOn(TransactionService, 'needsFinalSignature');
                var response = TransactionService.isMultiSignatureReady(transaction);
                expect(spyRegistration).toHaveReturnedWith(true);
                expect(spyNeedsSignatures).toHaveReturnedWith(false);
                expect(spyNeedsFinal).toHaveReturnedWith(false);
                expect(response).toBe(true);
                spyNeedsFinal.mockRestore();
            });
            it('should return true if multi-signed but excluding final', function () {
                for (var i = 1; i <= publicKeyCount; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var response = TransactionService.isMultiSignatureReady(transaction, true);
                expect(spyRegistration).toHaveReturnedWith(true);
                expect(spyNeedsSignatures).toHaveReturnedWith(false);
                expect(response).toBe(true);
            });
            it('should return false because all multi-sign signatures are required', function () {
                for (var i = 1; i <= publicKeyCount - 1; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transactionObject.sign(senderPassphrase);
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var response = TransactionService.isMultiSignatureReady(transaction);
                expect(spyRegistration).toHaveReturnedWith(true);
                expect(spyNeedsSignatures).toHaveReturnedWith(true);
                expect(response).toBe(false);
            });
            it('should return false because primary signature is required', function () {
                for (var i = 1; i <= publicKeyCount; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var response = TransactionService.isMultiSignatureReady(transaction);
                expect(spyRegistration).toHaveReturnedWith(true);
                expect(spyNeedsSignatures).toHaveReturnedWith(false);
                expect(response).toBe(false);
            });
            it('should return false if a wrong multi-sign passphrase is provided', function () {
                for (var i = 1; i <= publicKeyCount - 1; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transactionObject.multiSign('wrong passphrase');
                transactionObject.sign(senderPassphrase);
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var response = TransactionService.isMultiSignatureReady(transaction);
                expect(spyRegistration).toHaveReturnedWith(true);
                expect(spyNeedsSignatures).toHaveReturnedWith(true);
                expect(response).toBe(false);
            });
            it('should return false if final passphrase is wrong', function () {
                for (var i = 1; i <= publicKeyCount; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transactionObject.sign('wrong passphrase');
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var response = TransactionService.isMultiSignatureReady(transaction);
                expect(spyRegistration).toHaveReturnedWith(true);
                expect(spyNeedsSignatures).toHaveReturnedWith(true);
                expect(response).toBe(false);
            });
        });
        describe('non-registration', function () {
            var publicKeyCount = 10;
            var multiSignatureAsset, spyRegistration, spyNeedsSignatures, transaction, transactionObject;
            beforeEach(function () {
                multiSignatureAsset = {
                    min: 5,
                    publicKeys: []
                };
                for (var i = 1; i <= publicKeyCount; i++) {
                    multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
                }
                transactionObject = Transactions.BuilderFactory
                    .transfer()
                    .amount(1)
                    .fee(1)
                    .recipientId(recipientAddress);
                transactionObject.data.senderPublicKey = senderPublicKey;
                transactionObject.data.signatures = [];
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                spyRegistration = jest.spyOn(TransactionService, 'isMultiSignatureRegistration');
                spyNeedsSignatures = jest.spyOn(TransactionService, 'needsSignatures');
            });
            afterEach(function () {
                spyRegistration.mockRestore();
                spyNeedsSignatures.mockRestore();
            });
            it('should return true if all multi-signed', function () {
                for (var i = 1; i <= publicKeyCount; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var response = TransactionService.isMultiSignatureReady(transaction);
                expect(spyRegistration).toHaveReturnedWith(false);
                expect(spyNeedsSignatures).toHaveReturnedWith(false);
                expect(response).toBe(true);
            });
            it('should return true if multi-signed upto min', function () {
                for (var i = 1; i <= multiSignatureAsset.min; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var response = TransactionService.isMultiSignatureReady(transaction);
                expect(spyRegistration).toHaveReturnedWith(false);
                expect(spyNeedsSignatures).toHaveReturnedWith(false);
                expect(response).toBe(true);
            });
            it('should return false because below min required signatures', function () {
                for (var i = 1; i <= multiSignatureAsset.min - 1; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var response = TransactionService.isMultiSignatureReady(transaction);
                expect(spyRegistration).toHaveReturnedWith(false);
                expect(spyNeedsSignatures).toHaveReturnedWith(true);
                expect(response).toBe(false);
            });
            it('should return false if a wrong multi-sign passphrase is provided', function () {
                for (var i = 1; i <= multiSignatureAsset.min - 1; i++) {
                    transactionObject.multiSign("passphrase " + i);
                }
                transactionObject.multiSign('wrong passphrase');
                transaction = transactionObject.getStruct();
                transaction.multiSignature = multiSignatureAsset;
                var response = TransactionService.isMultiSignatureReady(transaction);
                expect(spyRegistration).toHaveReturnedWith(false);
                expect(spyNeedsSignatures).toHaveReturnedWith(true);
                expect(response).toBe(false);
            });
        });
    });
    describe('ledgerSign', function () {
        var vmMock = {
            $store: {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                dispatch: function () { }
            },
            $t: function (translationKey) {
                return translationKey;
            }
        };
        var spyDispatch, spyTranslate, transactionObject, wallet;
        beforeEach(function () {
            transactionObject = Transactions.BuilderFactory
                .transfer()
                .amount(1)
                .fee(1)
                .recipientId(recipientAddress);
            spyDispatch = jest.spyOn(vmMock.$store, 'dispatch');
            spyTranslate = jest.spyOn(vmMock, '$t');
            wallet = {
                address: Identities.Address.fromPassphrase(senderPassphrase),
                publicKey: senderPublicKey,
                ledgerIndex: 0
            };
        });
        afterEach(function () {
            spyDispatch.mockRestore();
            spyTranslate.mockRestore();
        });
        it('should sign the transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionJson, bytes, id, signature, spyGetBytes, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionObject.sign(senderPassphrase);
                        transactionJson = transactionObject.getStruct();
                        bytes = TransactionService.getBytes(transactionJson);
                        id = TransactionService.getId(transactionJson);
                        signature = transactionObject.data.signature;
                        spyDispatch.mockImplementation(function (key) {
                            if (key === 'ledger/signTransaction') {
                                return signature;
                            }
                        });
                        spyGetBytes = jest.spyOn(TransactionService, 'getBytes');
                        return [4 /*yield*/, TransactionService.ledgerSign(wallet, transactionObject, vmMock)];
                    case 1:
                        transaction = _a.sent();
                        expect(transaction.id).toEqual(id);
                        expect(spyGetBytes).toHaveBeenCalledWith(transactionJson);
                        expect(spyGetBytes).toHaveReturnedWith(bytes);
                        spyGetBytes.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the recipientId for vote transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var signature, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionObject = Transactions.BuilderFactory
                            .vote()
                            .votesAsset(["+" + senderPublicKey])
                            .fee(1)
                            .sign(senderPassphrase);
                        signature = transactionObject.data.signature;
                        spyDispatch.mockImplementation(function (key) {
                            if (key === 'ledger/signTransaction') {
                                return signature;
                            }
                        });
                        return [4 /*yield*/, TransactionService.ledgerSign(wallet, transactionObject, vmMock)];
                    case 1:
                        transaction = _a.sent();
                        expect(transaction.recipientId).toEqual(wallet.address);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not set the recipientId for bridgechain registration (type 3 group 2)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var signature, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionObject = new MagistrateCrypto.Builders
                            .BridgechainRegistrationBuilder()
                            .bridgechainRegistrationAsset({
                            name: 'test_bridgechain',
                            seedNodes: [
                                '1.1.1.1',
                                '2.2.2.2',
                                '3.3.3.3',
                                '4.4.4.4'
                            ],
                            ports: {
                                '@arkecosystem/core-api': 4003
                            },
                            genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                            bridgechainRepository: 'https://github.com/arkecosystem/core.git'
                        })
                            .fee(1)
                            .sign(senderPassphrase);
                        signature = transactionObject.data.signature;
                        spyDispatch.mockImplementation(function (key) {
                            if (key === 'ledger/signTransaction') {
                                return signature;
                            }
                        });
                        return [4 /*yield*/, TransactionService.ledgerSign(wallet, transactionObject, vmMock)];
                    case 1:
                        transaction = _a.sent();
                        expect(transaction.recipientId).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error if no signature', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(TransactionService.ledgerSign(wallet, transactionObject, vmMock)).rejects.toThrow('TRANSACTION.LEDGER_USER_DECLINED')];
                    case 1:
                        _a.sent();
                        expect(spyTranslate).toHaveBeenCalledWith('TRANSACTION.LEDGER_USER_DECLINED');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('isStandard', function () {
        it('should return true if transaction is transfer', function () {
            var transaction = Transactions.BuilderFactory
                .transfer()
                .amount(1)
                .fee(1)
                .recipientId(recipientAddress)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isStandard(transaction)).toBe(true);
        });
        it('should return true if transaction is vote', function () {
            var transaction = Transactions.BuilderFactory
                .vote()
                .votesAsset(["+" + senderPublicKey])
                .fee(1)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isStandard(transaction)).toBe(true);
        });
        it('should return false if transaction is business registration', function () {
            var transaction = new MagistrateCrypto.Builders
                .BusinessRegistrationBuilder()
                .businessRegistrationAsset({
                name: 'Name',
                website: 'http://github.com/ark/core.git'
            })
                .fee(1)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isStandard(transaction)).toBe(false);
        });
        it('should return false if transaction is bridgechain registration', function () {
            var transaction = new MagistrateCrypto.Builders
                .BridgechainRegistrationBuilder()
                .bridgechainRegistrationAsset({
                name: 'test_bridgechain',
                seedNodes: [
                    '1.1.1.1',
                    '2.2.2.2',
                    '3.3.3.3',
                    '4.4.4.4'
                ],
                ports: {
                    '@arkecosystem/core-api': 4003
                },
                genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                bridgechainRepository: 'https://github.com/arkecosystem/core.git'
            })
                .fee(1)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isStandard(transaction)).toBe(false);
        });
    });
    describe('isTransfer', function () {
        it('should return true if transaction is transfer', function () {
            var transaction = Transactions.BuilderFactory
                .transfer()
                .amount(1)
                .fee(1)
                .recipientId(recipientAddress)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isTransfer(transaction)).toBe(true);
        });
        it('should return false if transaction is vote', function () {
            var transaction = Transactions.BuilderFactory
                .vote()
                .votesAsset(["+" + senderPublicKey])
                .fee(1)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isTransfer(transaction)).toBe(false);
        });
        it('should return false if transaction is business registration (type 0)', function () {
            var transaction = new MagistrateCrypto.Builders
                .BusinessRegistrationBuilder()
                .businessRegistrationAsset({
                name: 'Name',
                website: 'http://github.com/ark/core.git'
            })
                .fee(1)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isTransfer(transaction)).toBe(false);
        });
    });
    describe('isVote', function () {
        it('should return true if transaction is vote', function () {
            var transaction = Transactions.BuilderFactory
                .vote()
                .votesAsset(["+" + senderPublicKey])
                .fee(1)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isVote(transaction)).toBe(true);
        });
        it('should return false if transaction is transfer', function () {
            var transaction = Transactions.BuilderFactory
                .transfer()
                .amount(1)
                .fee(1)
                .recipientId(recipientAddress)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isVote(transaction)).toBe(false);
        });
        it('should return false if transaction is bridgechain registration (type 3)', function () {
            var transaction = new MagistrateCrypto.Builders
                .BridgechainRegistrationBuilder()
                .bridgechainRegistrationAsset({
                name: 'test_bridgechain',
                seedNodes: [
                    '1.1.1.1',
                    '2.2.2.2',
                    '3.3.3.3',
                    '4.4.4.4'
                ],
                ports: {
                    '@arkecosystem/core-api': 4003
                },
                genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                bridgechainRepository: 'https://github.com/arkecosystem/core.git'
            })
                .fee(1)
                .sign(senderPassphrase)
                .getStruct();
            expect(TransactionService.isVote(transaction)).toBe(false);
        });
    });
});
//# sourceMappingURL=transaction.spec.js.map