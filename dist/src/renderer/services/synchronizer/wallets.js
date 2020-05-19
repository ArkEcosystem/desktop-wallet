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
import { groupBy, keyBy, maxBy, partition, uniqBy } from 'lodash';
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config';
import eventBus from '@/plugins/event-bus';
import truncateMiddle from '@/filters/truncate-middle';
import TransactionService from '@/services/transaction';
var Action = /** @class */ (function () {
    function Action(synchronizer) {
        this.synchronizer = synchronizer;
        this.checked = [];
    }
    /**
     * Check if the data of a wallet is the same than some data
     *
     * a@param {Object} wallet - wallet with the attributes of a `Wallet` model
     * a@param {Object} walletData - the data that is retrieved from the API
     * @return {Boolean} true if the data is equal
     */
    Action.compareWalletData = function (wallet, walletData) {
        return Object.keys(walletData).every(function (property) { return wallet[property] === walletData[property]; });
    };
    Object.defineProperty(Action.prototype, "$client", {
        get: function () {
            return this.synchronizer.$client;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "$dispatch", {
        get: function () {
            return this.synchronizer.$store.dispatch;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "$getters", {
        get: function () {
            return this.synchronizer.$store.getters;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "$logger", {
        get: function () {
            return this.$scope.$logger;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "$scope", {
        get: function () {
            return this.synchronizer.scope;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "$success", {
        get: function () {
            return this.$scope.$success;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "$info", {
        get: function () {
            return this.$scope.$info;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "$t", {
        get: function () {
            return this.$scope.$t.bind(this.$scope);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "profile", {
        get: function () {
            return this.$scope.session_profile;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "profileWallets", {
        /**
         * Regular wallets
         */
        get: function () {
            return this.profile
                ? this.$getters['wallet/byProfileId'](this.profile.id)
                : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "ledgerWallets", {
        /**
         * NOTE: Ledger wallets should not have its own store, but, since the current
         * implementation does it, it is important to have that in mind and never
         * try to save them as normal wallets
         */
        get: function () {
            return this.$getters['session/backgroundUpdateLedger']
                ? this.$getters['ledger/wallets']
                : {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "wallets", {
        get: function () {
            return __spreadArrays(this.profileWallets, Object.values(this.ledgerWallets));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "contacts", {
        // TODO contacts should be moved to a new Synchronizer action
        get: function () {
            return this.profile
                ? this.$getters['wallet/contactsByProfileId'](this.profile.id)
                : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "allWallets", {
        get: function () {
            return __spreadArrays(this.contacts, this.wallets);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "allWalletsByAddress", {
        /**
         * An `Object` with an address as key and an Array of wallets as value.
         *
         * NOTE: regular wallets and contacts should not be duplicated, but, currently,
         * Ledger wallets could be, so, the same address could belong to 1 wallet
         * on the `wallet` store and 1 wallet on the `ledger` store
         */
        get: function () {
            return groupBy(this.allWallets, 'address') || [];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * TODO when adding a new wallet do not display the success toast with the last
     * transaction: is not necessary
     * TODO do not display 2 success toast when sending txs from 1 wallet to other
     */
    Action.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var expiredTransactions, _i, expiredTransactions_1, transactionId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.allWallets.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sync()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.$dispatch('transaction/clearUnconfirmedVotes');
                        return [4 /*yield*/, this.$dispatch('transaction/clearExpired')];
                    case 3:
                        expiredTransactions = _a.sent();
                        for (_i = 0, expiredTransactions_1 = expiredTransactions; _i < expiredTransactions_1.length; _i++) {
                            transactionId = expiredTransactions_1[_i];
                            this.emit("transaction:" + transactionId + ":expired");
                            this.$info(this.$t('TRANSACTION.ERROR.EXPIRED', { transactionId: truncateMiddle(transactionId) }));
                        }
                        return [4 /*yield*/, this.processUnconfirmedVotes()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Synchronize the wallets and contacts
     *
     * @return {void}
     */
    Action.prototype.sync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, walletsData, transactionsByAddress, walletsToUpdate;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetch()];
                    case 1:
                        _a = _b.sent(), walletsData = _a.walletsData, transactionsByAddress = _a.transactionsByAddress;
                        return [4 /*yield*/, this.process(walletsData, transactionsByAddress)];
                    case 2:
                        walletsToUpdate = _b.sent();
                        if (!walletsToUpdate.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.update(walletsToUpdate)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetch, in parallel, the wallet data to every wallet and contact and the transactions
     * of regular and Ledger wallets.
     * Contact transactions are not fetched because they are not processed
     * (i.e. display a toast when a new transaction is received).
     *
     * @return {Object}
     */
    Action.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allAddresses, walletAddresses, _a, walletsData, transactionsByAddress;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        allAddresses = uniqBy(this.allWallets, 'address').map(function (wallet) { return wallet.address; });
                        walletAddresses = uniqBy(this.wallets, 'address').map(function (wallet) { return wallet.address; });
                        return [4 /*yield*/, Promise.all([
                                this.fetchWalletsData(allAddresses),
                                this.fetchWalletsTransactions(walletAddresses)
                            ])
                            // TODO: this should be removed later, when the transactions are stored, to take advantage of the reactivity
                        ];
                    case 1:
                        _a = _b.sent(), walletsData = _a[0], transactionsByAddress = _a[1];
                        // TODO: this should be removed later, when the transactions are stored, to take advantage of the reactivity
                        this.emit('transactions:fetched', transactionsByAddress);
                        return [2 /*return*/, { walletsData: walletsData, transactionsByAddress: transactionsByAddress }];
                }
            });
        });
    };
    Action.prototype.fetchWalletsData = function (addresses) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$client.fetchWallets(addresses)];
            });
        });
    };
    Action.prototype.fetchWalletsTransactions = function (addresses) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$client.fetchTransactionsForWallets(addresses)];
            });
        });
    };
    /**
     * Process, in parallel, the wallets and their transactions and, after that,
     * return the wallets that need to be stored with the updated information.
     *
     * @param {Array} walletsData - the fetched data of the wallets
     * @param {Array} transactionsByAddress - the fetched transactions of each wallet
     * @return {Array} wallets that need update (with their updated data)
     */
    Action.prototype.process = function (walletsData, transactionsByAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dataByWallet, walletsTransactionsAt, addressesToUpdate;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.processWalletsData(walletsData),
                            this.processTransactions(transactionsByAddress)
                        ])
                        // An address would be updated if it has new data or it has received a new transaction
                    ];
                    case 1:
                        _a = _b.sent(), dataByWallet = _a[0], walletsTransactionsAt = _a[1];
                        addressesToUpdate = __spreadArrays(Object.keys(dataByWallet), Object.keys(walletsTransactionsAt));
                        return [2 /*return*/, addressesToUpdate.reduce(function (walletsToUpdate, address) {
                                // 1 address could have 1 wallet on the `wallet` store and 1 wallet on the `ledger` store
                                for (var _i = 0, _a = _this.allWalletsByAddress[address]; _i < _a.length; _i++) {
                                    var originalWallet = _a[_i];
                                    var wallet = __assign(__assign({}, originalWallet), dataByWallet[address]);
                                    if (!wallet.publicKey && originalWallet.publicKey) {
                                        wallet.publicKey = originalWallet.publicKey;
                                    }
                                    var checkedAt = walletsTransactionsAt[address];
                                    if (checkedAt) {
                                        wallet.transactions = { checkedAt: checkedAt };
                                    }
                                    walletsToUpdate.push(wallet);
                                }
                                return walletsToUpdate;
                            }, [])];
                }
            });
        });
    };
    /**
     * For every wallet data, check which wallets should be updated and return
     * that data aggregated by address
     *
     * @param {Array} walletsData - fetched (incomplete) data of each wallet
     * @return {Object} data of the wallets that should be updated aggregated by address
     */
    Action.prototype.processWalletsData = function (walletsData) {
        var _this = this;
        return walletsData.reduce(function (dataByAddress, data) {
            // 1 address could have 1 wallet on the `wallet` store and 1 wallet on the `ledger` store
            for (var _i = 0, _a = _this.allWalletsByAddress[data.address]; _i < _a.length; _i++) {
                var wallet = _a[_i];
                var isEqual = Action.compareWalletData(wallet, data);
                if (!isEqual) {
                    dataByAddress[data.address] = data;
                }
            }
            return dataByAddress;
        }, {});
    };
    /**
     * Fetch the transactions of the wallets and process them.
     *
     * @param  {Object} transactionsByAddress - transactions aggregated by wallet address
     * @return {Object} timestamp of new transactions aggregated by address
     */
    Action.prototype.processTransactions = function (transactionsByAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var walletsTransactionsAt, _loop_1, this_1, _i, _a, address;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        walletsTransactionsAt = {};
                        _loop_1 = function (address) {
                            var transactions, wallet, latestAt;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        transactions = transactionsByAddress[address];
                                        if (!(transactions && transactions.length)) return [3 /*break*/, 2];
                                        wallet = this_1.wallets.find(function (wallet) { return wallet.address === address; });
                                        return [4 /*yield*/, this_1.processWalletTransactions(wallet, transactions)];
                                    case 1:
                                        latestAt = _a.sent();
                                        if (latestAt) {
                                            walletsTransactionsAt[address] = latestAt;
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = Object.keys(transactionsByAddress);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        address = _a[_i];
                        return [5 /*yield**/, _loop_1(address)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, walletsTransactionsAt];
                }
            });
        });
    };
    /**
     * Process the transaction of a wallet:
     *  - If any of the transaction is new, display a toast
     *  - Store the votes of vote transactions
     *  - Return the last time that a new transaction was received
     *
     * @params {Object} wallet
     * @params {Array} transactions - non-empty Array of transactions
     * @return {Number|void} timestamp of the new transaction
     */
    Action.prototype.processWalletTransactions = function (wallet, transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var latestTransaction, latestAt, checkedAt, types;
            return __generator(this, function (_a) {
                try {
                    // TODO delete only 1 time
                    this.$dispatch('transaction/deleteBulk', {
                        transactions: transactions,
                        profileId: wallet.profileId
                    });
                    this.$dispatch('transaction/processVotes', transactions);
                    latestTransaction = maxBy(transactions, 'timestamp');
                    latestAt = latestTransaction.timestamp;
                    checkedAt = wallet.transactions ? wallet.transactions.checkedAt : 0;
                    if (latestAt > checkedAt) {
                        // Disable notification on first check
                        if (checkedAt > 0) {
                            this.displayNewTransaction(latestTransaction, wallet);
                            types = [
                                TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION,
                                TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION
                            ];
                            if (types.includes(latestTransaction.type)) {
                                this.$dispatch('delegate/load');
                            }
                        }
                        return [2 /*return*/, latestAt];
                    }
                }
                catch (error) {
                    this.$logger.error(error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Fetch all votes for wallets with unconfirmed vote transactions.
     *
     * @return {void}
     */
    Action.prototype.processUnconfirmedVotes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var unconfirmedVotes, addresses, _i, addresses_1, address, votes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unconfirmedVotes = this.$getters['session/unconfirmedVotes'];
                        addresses = uniqBy(unconfirmedVotes, 'address').map(function (wallet) { return wallet.address; });
                        _i = 0, addresses_1 = addresses;
                        _a.label = 1;
                    case 1:
                        if (!(_i < addresses_1.length)) return [3 /*break*/, 5];
                        address = addresses_1[_i];
                        return [4 /*yield*/, this.$client.fetchWalletVotes(address)];
                    case 2:
                        votes = _a.sent();
                        return [4 /*yield*/, this.$dispatch('transaction/processVotes', votes)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // TODO use the eventBus to display transactions
    Action.prototype.displayNewTransaction = function (transaction, wallet) {
        switch ((transaction.typeGroup || 1)) {
            case TRANSACTION_GROUPS.STANDARD: {
                this.displayNewStandardTransaction(transaction, wallet);
                break;
            }
            case TRANSACTION_GROUPS.MAGISTRATE: {
                this.displayNewMagistrateTransaction(transaction, wallet);
                break;
            }
        }
    };
    // TODO use the eventBus to display transactions
    Action.prototype.displayNewStandardTransaction = function (transaction, wallet) {
        var message = {};
        switch (transaction.type) {
            case TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_1.NEW_SECOND_SIGNATURE',
                    options: {
                        address: truncateMiddle(wallet.address)
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_1.NEW_DELEGATE_REGISTRATION',
                    options: {
                        address: truncateMiddle(wallet.address),
                        username: transaction.asset.delegate.username
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_1.VOTE: {
                var type = transaction.asset.votes[0].substring(0, 1) === '+' ? 'VOTE' : 'UNVOTE';
                var voteUnvote = this.$t("SYNCHRONIZER.GROUP_1." + type);
                message = {
                    translation: 'SYNCHRONIZER.GROUP_1.NEW_VOTE',
                    options: {
                        address: truncateMiddle(wallet.address),
                        voteUnvote: voteUnvote,
                        publicKey: truncateMiddle(transaction.asset.votes[0].substring(1))
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_1.NEW_MULTI_SIGNATURE',
                    options: {
                        address: truncateMiddle(wallet.address)
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_1.IPFS: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_1.NEW_IPFS',
                    options: {
                        address: truncateMiddle(wallet.address)
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT: {
                var amount = this.$scope.currency_toBuilder(0);
                var type = 'SENT';
                var recipient = transaction.asset.payments.filter(function (payment) { return payment.recipientId === wallet.address; });
                if (recipient.length) {
                    type = 'RECEIVED';
                    for (var _i = 0, recipient_1 = recipient; _i < recipient_1.length; _i++) {
                        var entry = recipient_1[_i];
                        amount.add(entry.amount);
                    }
                    recipient = truncateMiddle(wallet.address);
                }
                else {
                    amount = TransactionService.getAmount(this.$scope, transaction, wallet);
                    recipient = transaction.asset.payments.length + ' recipients';
                }
                message = {
                    translation: "SYNCHRONIZER.GROUP_1.NEW_MULTI_PAYMENT_" + type,
                    options: {
                        address: truncateMiddle(wallet.address),
                        amount: "" + this.$getters['session/network'].symbol + (amount / 1e8),
                        sender: truncateMiddle(transaction.sender),
                        recipient: recipient
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_1.NEW_DELEGATE_RESIGNATION',
                    options: {
                        address: truncateMiddle(wallet.address),
                        username: transaction.asset.delegate.username
                    }
                };
                break;
            }
            default: {
                var type = transaction.sender === wallet.address ? 'SENT' : 'RECEIVED';
                message = {
                    translation: "SYNCHRONIZER.GROUP_1.NEW_TRANSFER_" + type,
                    options: {
                        address: truncateMiddle(wallet.address),
                        amount: "" + this.$getters['session/network'].symbol + (transaction.amount / 1e8),
                        sender: truncateMiddle(transaction.sender),
                        recipient: truncateMiddle(transaction.recipient)
                    }
                };
                break;
            }
        }
        this.$success(this.$t(message.translation, message.options));
    };
    // TODO use the eventBus to display transactions
    Action.prototype.displayNewMagistrateTransaction = function (transaction, wallet) {
        var message = null;
        switch (transaction.type) {
            case TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_2.NEW_BUSINESS_REGISTRATION',
                    options: {
                        address: truncateMiddle(wallet.address),
                        name: transaction.asset.businessRegistration.name
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_2.BUSINESS_RESIGNATION: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_2.NEW_BUSINESS_RESIGNATION',
                    options: {
                        address: truncateMiddle(wallet.address)
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_2.NEW_BUSINESS_UPDATE',
                    options: {
                        address: truncateMiddle(wallet.address)
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_2.NEW_BRIDGECHAIN_REGISTRATION',
                    options: {
                        address: truncateMiddle(wallet.address),
                        bridgechain: truncateMiddle(transaction.asset.bridgechainRegistration.genesisHash)
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_2.NEW_BRIDGECHAIN_RESIGNATION',
                    options: {
                        address: truncateMiddle(wallet.address),
                        bridgechain: truncateMiddle(transaction.asset.bridgechainResignation.bridgechainId)
                    }
                };
                break;
            }
            case TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_UPDATE: {
                message = {
                    translation: 'SYNCHRONIZER.GROUP_2.NEW_BRIDGECHAIN_UPDATE',
                    options: {
                        address: truncateMiddle(wallet.address),
                        bridgechain: truncateMiddle(transaction.asset.bridgechainUpdate.bridgechainId)
                    }
                };
                break;
            }
        }
        if (message) {
            this.$success(this.$t(message.translation, message.options));
        }
    };
    /**
     * @param {Array} walletsToUpdate - regular or Ledger wallets that should be updated
     */
    Action.prototype.update = function (walletsToUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ledgerWallets, wallets;
            return __generator(this, function (_b) {
                _a = partition(walletsToUpdate, 'isLedger'), ledgerWallets = _a[0], wallets = _a[1];
                try {
                    if (wallets.length) {
                        this.$dispatch('wallet/updateBulk', wallets);
                    }
                    if (ledgerWallets.length) {
                        this.$dispatch('ledger/updateWallets', keyBy(ledgerWallets, 'address'));
                    }
                }
                catch (error) {
                    this.$logger.error(error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    Action.prototype.emit = function (event, data) {
        eventBus.emit(event, data);
    };
    return Action;
}());
/*
 * This `Synchronizer` action keeps the wallets of the current profile in sync.
 * Instead of checking each wallet every interval, to be more efficient, since
 * some users have dozens of wallets, it loads their data initially and updates
 * them on each new block.
 *
 * @param {Synchronizer} synchronizer
 * @return {Promise}
 */
var action = function (synchronizer) { return __awaiter(void 0, void 0, void 0, function () {
    var action;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                action = new Action(synchronizer);
                return [4 /*yield*/, action.run()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export { Action, action };
export default action;
//# sourceMappingURL=wallets.js.map