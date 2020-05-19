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
import LedgerTransport from '@ledgerhq/hw-transport-node-hid-singleton';
import { ARKTransport } from '@arkecosystem/ledger-transport';
import queue from 'async/queue';
import logger from 'electron-log';
var LedgerService = /** @class */ (function () {
    /**
     * Create LedgerService instance.
     * @return {void}
     */
    function LedgerService() {
        var _this = this;
        this.transport = null;
        this.ledger = null;
        this.listeningForLedger = false;
        this.actions = [];
        this.actionsQueue = queue(function (_a, callback) {
            var action = _a.action, resolve = _a.resolve;
            return __awaiter(_this, void 0, void 0, function () {
                var _b, error_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            _b = resolve;
                            return [4 /*yield*/, action()];
                        case 1:
                            _b.apply(void 0, [_c.sent()]);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _c.sent();
                            if (error_1.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
                                resolve(false);
                            }
                            resolve(null);
                            return [3 /*break*/, 3];
                        case 3:
                            callback();
                            return [2 /*return*/];
                    }
                });
            });
        });
        this.listenForLedger();
    }
    LedgerService.prototype.listenForLedger = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.listeningForLedger) {
                            return [2 /*return*/];
                        }
                        this.listeningForLedger = true;
                        _a = this;
                        return [4 /*yield*/, LedgerTransport.create()];
                    case 1:
                        _a.transport = _b.sent();
                        this.ledger = new ARKTransport(this.transport);
                        this.listeningForLedger = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Try connecting to ledger device.
     * @return {Boolean} true if connected, false if failed
     */
    LedgerService.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!this.transport || this.transport.disconnected) {
                        this.listenForLedger();
                    }
                    return [2 /*return*/, this.isConnected()];
                }
                catch (error) {
                    logger.debug(error);
                }
                return [2 /*return*/, false];
            });
        });
    };
    /**
     * Flag ledger as disconnected.
     * @return {void}
     */
    LedgerService.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!this.transport) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.transport.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        logger.error(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if connected to the ledger.
     * @return {Boolean}
     */
    LedgerService.prototype.isConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isConnected, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.transport || this.transport.disconnected) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.__performAction(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, this.ledger.getPublicKey('44\'/1\'/0\'/0/0')];
                                });
                            }); })];
                    case 1:
                        isConnected = _a.sent();
                        return [2 /*return*/, !!isConnected];
                    case 2:
                        error_3 = _a.sent();
                        logger.error(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Get public key from ledger wallet.
     * @param  {string} path Path for wallet location.
     * @return {Promise<string>}
     */
    LedgerService.prototype.getPublicKey = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__performAction(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, this.ledger.getPublicKey(path)];
                        });
                    }); })];
            });
        });
    };
    /**
     * Sign transaction for ledger wallet.
     * @param  {string} path Path for wallet location.
     * @param  {Buffer} transactionBytes bytes of transaction.
     * @return {Promise<string>}
     */
    LedgerService.prototype.signTransaction = function (path, transactionBytes) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__performAction(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, this.ledger.signTransaction(path, transactionBytes)];
                        });
                    }); })];
            });
        });
    };
    /**
     * Sign message for wallet.
     * @param  {string} path Path for wallet location.
     * @param  {Buffer} messageBytes bytes to sign.
     * @return {Promise<string>}
     */
    LedgerService.prototype.signMessage = function (path, messageBytes) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__performAction(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, this.ledger.signMessage(path, messageBytes)];
                        });
                    }); })];
            });
        });
    };
    /**
     * Get version from ledger app.
     * @return {Promise<string>}
     */
    LedgerService.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__performAction(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, this.ledger.getVersion()];
                        });
                    }); })];
            });
        });
    };
    /**
     * Sign transaction for ledger wallet.
     * @param  {Function} [action] Method to run in an synchronous queue.
     * @return {Promise}
     */
    LedgerService.prototype.__performAction = function (action) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.actionsQueue.push({
                action: action,
                resolve: resolve
            });
        });
    };
    return LedgerService;
}());
export default new LedgerService();
//# sourceMappingURL=ledger-service.js.map