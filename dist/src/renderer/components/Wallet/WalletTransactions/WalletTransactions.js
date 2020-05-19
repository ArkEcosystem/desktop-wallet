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
import mergeTableTransactions from '@/components/utils/merge-table-transactions';
import { TransactionTable } from '@/components/Transaction';
export default {
    name: 'WalletTransactions',
    components: {
        TransactionTable: TransactionTable
    },
    mixins: [mixin],
    created: function () {
        this.loadTransactions();
        this.$eventBus.on('wallet:reload', this.loadTransactions);
        this.enableNewTransactionEvent(this.wallet_fromRoute.address);
    },
    beforeDestroy: function () {
        this.$eventBus.off('wallet:reload', this.loadTransactions);
        if (this.wallet_fromRoute) {
            this.disableNewTransactionEvent(this.wallet_fromRoute.address);
        }
    },
    methods: {
        enableNewTransactionEvent: function (address) {
            if (!address) {
                return;
            }
            this.disableNewTransactionEvent(address);
            this.$eventBus.on("wallet:" + address + ":transaction:new", this.refreshStatusEvent);
        },
        disableNewTransactionEvent: function (address) {
            if (!address) {
                return;
            }
            try {
                this.$eventBus.off("wallet:" + address + ":transaction:new", this.refreshStatusEvent);
            }
            catch (error) {
                //
            }
        },
        getStoredTransactions: function (address) {
            var _this = this;
            if (!address) {
                return [];
            }
            var transactions = this.$store.getters['transaction/byAddress'](address, { includeExpired: true });
            if (this.transactionType === null) {
                return transactions;
            }
            return transactions.filter(function (transaction) { return transaction.type === _this.transactionType; });
        },
        getTransactions: function (address) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, limit, page, sort, response;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!address) {
                                return [2 /*return*/, []];
                            }
                            _a = this.queryParams, limit = _a.limit, page = _a.page, sort = _a.sort;
                            return [4 /*yield*/, this.$client.fetchWalletTransactions(address, {
                                    transactionType: this.transactionType,
                                    page: page,
                                    limit: limit,
                                    orderBy: sort.field + ":" + sort.type
                                })];
                        case 1:
                            response = _b.sent();
                            return [2 /*return*/, response];
                    }
                });
            });
        },
        fetchTransactions: function () {
            return __awaiter(this, void 0, void 0, function () {
                var address, response, transactions, error_1, messages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // If we're already fetching, it's unneccessary to fetch again
                            if (this.isFetching) {
                                return [2 /*return*/];
                            }
                            if (this.wallet_fromRoute) {
                                address = this.wallet_fromRoute.address;
                            }
                            this.isFetching = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.getTransactions(address)];
                        case 2:
                            response = _a.sent();
                            this.$store.dispatch('transaction/deleteBulk', {
                                transactions: response.transactions,
                                profileId: this.session_profile.id
                            });
                            transactions = mergeTableTransactions(response.transactions, this.getStoredTransactions(address), this.queryParams.sort);
                            if (this.wallet_fromRoute && address === this.wallet_fromRoute.address) {
                                this.$set(this, 'fetchedTransactions', transactions);
                                // TODO: Does this need fixing? This only stores total count from API, not including locally stored transactions
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
        refreshStatusEvent: function () {
            this.refreshStatus();
        },
        refreshStatus: function () {
            return __awaiter(this, void 0, void 0, function () {
                var address, newTransactions, response, transactions, _i, _a, existingTransaction, _b, transactions_1, transaction, _c, transactions_2, transaction, matched, _d, _e, existingTransaction, error_2;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            if (!this.wallet_fromRoute || !this.wallet_fromRoute.address) {
                                return [2 /*return*/];
                            }
                            address = this.wallet_fromRoute.address;
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 3, , 4]);
                            newTransactions = 0;
                            return [4 /*yield*/, this.getTransactions(address)];
                        case 2:
                            response = _f.sent();
                            transactions = mergeTableTransactions(response.transactions, this.getStoredTransactions(address), this.queryParams.sort);
                            for (_i = 0, _a = this.fetchedTransactions; _i < _a.length; _i++) {
                                existingTransaction = _a[_i];
                                for (_b = 0, transactions_1 = transactions; _b < transactions_1.length; _b++) {
                                    transaction = transactions_1[_b];
                                    if (existingTransaction.id === transaction.id) {
                                        existingTransaction.confirmations = transaction.confirmations;
                                        break;
                                    }
                                }
                            }
                            for (_c = 0, transactions_2 = transactions; _c < transactions_2.length; _c++) {
                                transaction = transactions_2[_c];
                                matched = false;
                                for (_d = 0, _e = this.fetchedTransactions; _d < _e.length; _d++) {
                                    existingTransaction = _e[_d];
                                    if (existingTransaction.id === transaction.id) {
                                        matched = true;
                                        break;
                                    }
                                }
                                if (!matched) {
                                    newTransactions++;
                                }
                            }
                            // Avoid throwing an Error if the user changes to a different route
                            if (this.wallet_fromRoute) {
                                if (address === this.wallet_fromRoute.address && newTransactions > 0) {
                                    this.newTransactionsNotice = this.$tc('WALLET_TRANSACTIONS.NEW_TRANSACTIONS', newTransactions, {
                                        count: newTransactions
                                    });
                                }
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _f.sent();
                            this.$logger.error('Failed to update confirmations: ', error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        onWalletChange: function (newWallet, oldWallet) {
            if (oldWallet) {
                this.disableNewTransactionEvent(oldWallet.address);
            }
            if (newWallet) {
                this.enableNewTransactionEvent(newWallet.address);
            }
        },
        onPageChange: function (_a) {
            var currentPage = _a.currentPage;
            if (currentPage && currentPage !== this.currentPage) {
                this.currentPage = currentPage;
                this.__updateParams({ page: currentPage });
                this.loadTransactions();
            }
        },
        onPerPageChange: function (_a) {
            var currentPerPage = _a.currentPerPage;
            if (currentPerPage && currentPerPage !== this.transactionTableRowCount) {
                this.transactionTableRowCount = currentPerPage;
                this.currentPage = 1;
                this.__updateParams({ limit: currentPerPage, page: 1 });
                this.loadTransactions();
            }
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
                    },
                    page: 1
                });
                this.loadTransactions();
            }
        },
        reset: function () {
            this.currentPage = 1;
            this.queryParams.page = 1;
            this.totalCount = 0;
            this.fetchedTransactions = [];
            this.lastStatusRefresh = null;
            this.newTransactionsNotice = null;
        }
    }
};
//# sourceMappingURL=WalletTransactions.js.map