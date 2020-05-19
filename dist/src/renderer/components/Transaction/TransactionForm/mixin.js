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
import { required } from 'vuelidate/lib/validators';
import Bip38 from '@/services/bip38';
import TransactionService from '@/services/transaction';
export default {
    validators: {
        fee: {
            required: required,
            isValid: function () {
                if (this.$refs.fee) {
                    return !this.$refs.fee.$v.$invalid;
                }
                return false;
            }
        },
        passphrase: {
            isValid: function () {
                if (this.isMultiSignature) {
                    return true;
                }
                else if (this.currentWallet && (this.currentWallet.isLedger || this.currentWallet.passphrase)) {
                    return true;
                }
                if (this.$refs.passphrase) {
                    return !this.$refs.passphrase.$v.$invalid;
                }
                return false;
            }
        },
        walletPassword: {
            isValid: function () {
                if (this.isMultiSignature) {
                    return true;
                }
                else if (this.currentWallet && (this.currentWallet.isLedger || !this.currentWallet.passphrase)) {
                    return true;
                }
                if (!this.form.walletPassword || !this.form.walletPassword.length) {
                    return false;
                }
                if (this.$refs.password) {
                    return !this.$refs.password.$v.$invalid;
                }
                return false;
            }
        },
        secondPassphrase: {
            isValid: function () {
                if (!this.currentWallet.secondPublicKey) {
                    return true;
                }
                if (this.$refs.secondPassphrase) {
                    return !this.$refs.secondPassphrase.$v.$invalid;
                }
                return false;
            }
        }
    },
    data: function () {
        return {
            showEncryptLoader: false,
            showLedgerLoader: false
        };
    },
    computed: {
        isMultiSignature: function () {
            return this.currentWallet && !!this.currentWallet.multiSignature;
        },
        currentWallet: function () {
            return this.wallet_fromRoute;
        },
        senderLabel: function () {
            return this.wallet_formatAddress(this.currentWallet.address);
        },
        walletNetwork: function () {
            return this.session_network;
        }
    },
    mounted: function () {
        if (this.$refs.fee) {
            this.form.fee = this.$refs.fee.fee;
        }
    },
    methods: {
        /**
         * Decrypt the WIF of the wallet if has a password and submit the form
         */
        onSubmit: function () {
            return __awaiter(this, void 0, void 0, function () {
                var dataToDecrypt, bip38, encodedWif, _error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.form.walletPassword && this.form.walletPassword.length)) return [3 /*break*/, 6];
                            this.showEncryptLoader = true;
                            dataToDecrypt = {
                                bip38key: this.currentWallet.passphrase,
                                password: this.form.walletPassword,
                                wif: this.walletNetwork.wif
                            };
                            bip38 = new Bip38();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, bip38.decrypt(dataToDecrypt)];
                        case 2:
                            encodedWif = (_a.sent()).encodedWif;
                            this.form.passphrase = null;
                            this.form.wif = encodedWif;
                            return [3 /*break*/, 5];
                        case 3:
                            _error_1 = _a.sent();
                            this.$error(this.$t('ENCRYPTION.FAILED_DECRYPT'));
                            return [3 /*break*/, 5];
                        case 4:
                            bip38.quit();
                            return [7 /*endfinally*/];
                        case 5:
                            this.showEncryptLoader = false;
                            if (!this.form.wif) {
                                return [2 /*return*/];
                            }
                            _a.label = 6;
                        case 6:
                            this.submit();
                            return [2 /*return*/];
                    }
                });
            });
        },
        submit: function () {
            return __awaiter(this, void 0, void 0, function () {
                var transactionData, success, transaction, error_1, transactionObject, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Ensure that fee has value, even when the user has not interacted
                            if (!this.form.fee && this.$refs.fee) {
                                this.$set(this.form, 'fee', this.$refs.fee.fee);
                            }
                            transactionData = this.getTransactionData();
                            success = true;
                            if (!!this.currentWallet.isLedger) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.buildTransaction(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee)];
                        case 2:
                            transaction = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.$logger.error('Could not build transaction: ', error_1);
                            if (this.transactionError) {
                                this.transactionError(error_1);
                            }
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 11];
                        case 5:
                            success = false;
                            this.showLedgerLoader = true;
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 9, , 10]);
                            return [4 /*yield*/, this.buildTransaction(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee, true)];
                        case 7:
                            transactionObject = _a.sent();
                            return [4 /*yield*/, TransactionService.ledgerSign(this.currentWallet, transactionObject, this)];
                        case 8:
                            transaction = _a.sent();
                            transaction.totalAmount = TransactionService.getTotalAmount(transaction);
                            success = true;
                            return [3 /*break*/, 10];
                        case 9:
                            error_2 = _a.sent();
                            this.$error(this.$t('TRANSACTION.LEDGER_SIGN_FAILED') + ": " + error_2.message);
                            return [3 /*break*/, 10];
                        case 10:
                            this.showLedgerLoader = false;
                            _a.label = 11;
                        case 11:
                            if (success) {
                                this.emitNext(transaction);
                                if (this.postSubmit) {
                                    this.postSubmit();
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        getFee: function () {
            return this.currency_unitToSub(this.form.fee);
        },
        onFee: function (fee) {
            this.$set(this.form, 'fee', fee);
        },
        emitNext: function (transaction) {
            this.$emit('next', { transaction: transaction });
        }
    }
};
//# sourceMappingURL=mixin.js.map