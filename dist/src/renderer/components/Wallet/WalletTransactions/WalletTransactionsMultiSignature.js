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
import { at, isEqual } from 'lodash';
import mixin from './mixin';
import { TransactionTableMultiSignature } from '@/components/Transaction';
import MultiSignature from '@/services/client-multisig';
import WalletService from '@/services/wallet';
export default {
    name: 'WalletTransactionsMultiSignature',
    isRemote: false,
    hasPagination: false,
    components: {
        TransactionTable: TransactionTableMultiSignature
    },
    mixins: [mixin],
    created: function () {
        this.loadTransactions();
        this.$eventBus.on('wallet:reload', this.loadTransactions);
        this.$eventBus.on('wallet:reload:multi-signature', this.loadTransactions);
    },
    beforeDestroy: function () {
        this.$eventBus.off('wallet:reload', this.loadTransactions);
        this.$eventBus.off('wallet:reload:multi-signature', this.loadTransactions);
    },
    methods: {
        getTransactions: function (publicKey) {
            return __awaiter(this, void 0, void 0, function () {
                var peer, transactions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            peer = this.$store.getters['session/multiSignaturePeer'];
                            if (!publicKey || !peer) {
                                return [2 /*return*/, {
                                        totalCount: 0,
                                        transactions: []
                                    }];
                            }
                            return [4 /*yield*/, MultiSignature.getTransactions(peer, publicKey)];
                        case 1:
                            transactions = _a.sent();
                            return [2 /*return*/, transactions];
                    }
                });
            });
        },
        fetchTransactions: function () {
            return __awaiter(this, void 0, void 0, function () {
                var publicKey, response, error_1, messages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // If we're already fetching, it's unneccessary to fetch again
                            if (this.isFetching) {
                                return [2 /*return*/];
                            }
                            if (!this.wallet_fromRoute) {
                                return [2 /*return*/];
                            }
                            publicKey = WalletService.getPublicKeyFromWallet(this.wallet_fromRoute);
                            if (!publicKey) {
                                return [2 /*return*/];
                            }
                            this.isFetching = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.getTransactions(publicKey)];
                        case 2:
                            response = _a.sent();
                            if (publicKey === WalletService.getPublicKeyFromWallet(this.wallet_fromRoute)) {
                                this.$set(this, 'fetchedTransactions', response.transactions);
                                this.totalCount = response.totalCount;
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            messages = at(error_1, 'response.body.message');
                            if (messages[0] !== 'Wallet not found') {
                                this.$logger.error(error_1);
                                this.$error(this.$t('COMMON.FAILED_FETCH', {
                                    name: 'transactions',
                                    msg: error_1.message
                                }));
                            }
                            this.fetchedTransactions = [];
                            return [3 /*break*/, 5];
                        case 4:
                            this.isFetching = false;
                            this.isLoading = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        refreshStatus: function () {
            return __awaiter(this, void 0, void 0, function () {
                var publicKey, newTransactions, response, _loop_1, this_1, _i, _a, transaction, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.wallet_fromRoute) {
                                return [2 /*return*/];
                            }
                            publicKey = WalletService.getPublicKeyFromWallet(this.wallet_fromRoute);
                            if (!publicKey) {
                                return [2 /*return*/];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            newTransactions = 0;
                            return [4 /*yield*/, this.getTransactions(publicKey)];
                        case 2:
                            response = _b.sent();
                            _loop_1 = function (transaction) {
                                if (!this_1.fetchedTransactions.some(function (existingTransaction) { return existingTransaction.id === transaction.id; })) {
                                    newTransactions++;
                                }
                            };
                            this_1 = this;
                            for (_i = 0, _a = response.transactions; _i < _a.length; _i++) {
                                transaction = _a[_i];
                                _loop_1(transaction);
                            }
                            // Avoid throwing an Error if the user changes to a different route
                            if (this.wallet_fromRoute && publicKey === WalletService.getPublicKeyFromWallet(this.wallet_fromRoute) && newTransactions > 0) {
                                this.newTransactionsNotice = this.$t('WALLET_TRANSACTIONS.NEW_TRANSACTIONS', {
                                    count: newTransactions,
                                    plural: newTransactions > 1 ? 's' : ''
                                });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _b.sent();
                            this.$logger.error('Failed to update confirmations: ', error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        onSortChange: function (_a) {
            var source = _a.source, field = _a.field, type = _a.type;
            if (!source || source !== 'transactionsTab') {
                return;
            }
            if (!isEqual({ field: field, type: type }, this.queryParams.sort)) {
                this.__updateParams({
                    sort: {
                        field: field,
                        type: type
                    }
                });
            }
        },
        reset: function () {
            this.totalCount = 0;
            this.fetchedTransactions = [];
            this.newTransactionsNotice = null;
        }
    }
};
//# sourceMappingURL=WalletTransactionsMultiSignature.js.map