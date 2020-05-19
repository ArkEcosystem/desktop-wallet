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
/* eslint-disable import/no-duplicates */
import got from 'got/source/index';
import gotWallet from 'got';
var MultiSignature = /** @class */ (function () {
    function MultiSignature() {
    }
    MultiSignature.performHandshake = function (_a) {
        var host = _a.host, port = _a.port;
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        // this request should fail because the endpoint does not exist
                        return [4 /*yield*/, got.get(host + ":" + port + "/handshake")];
                    case 1:
                        // this request should fail because the endpoint does not exist
                        _b.sent();
                        return [2 /*return*/, false];
                    case 2:
                        error_1 = _b.sent();
                        if (error_1.response && error_1.response.headers && error_1.response.headers['x-server-type'] === 'MultiSignature') {
                            return [2 /*return*/, true];
                        }
                        console.error('Could not get multi-sig server handshake: ', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    MultiSignature.sendTransaction = function (_a, transaction) {
        var host = _a.host, port = _a.port;
        return __awaiter(this, void 0, void 0, function () {
            var multiSignature, response, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        multiSignature = transaction.multiSignature;
                        if (transaction.asset && transaction.asset.multiSignature) {
                            multiSignature = transaction.asset.multiSignature;
                        }
                        return [4 /*yield*/, gotWallet.post(host + ":" + port + "/transaction", {
                                body: JSON.stringify({
                                    data: transaction,
                                    multisigAsset: multiSignature
                                })
                            })];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Could not post transaction: ', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    MultiSignature.getTransactions = function (_a, publicKey) {
        var host = _a.host, port = _a.port;
        return __awaiter(this, void 0, void 0, function () {
            var response, transactions, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, gotWallet.get(host + ":" + port + "/transactions", {
                                query: {
                                    publicKey: publicKey
                                }
                            })];
                    case 1:
                        response = _b.sent();
                        transactions = JSON.parse(response.body);
                        return [2 /*return*/, {
                                totalCount: transactions.length,
                                transactions: transactions.map(function (transaction) {
                                    return __assign(__assign({}, transaction.data), { multiSignature: transaction.multisigAsset, timestamp: transaction.timestamp });
                                })
                            }];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Could not post transaction: ', error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, {
                            totalCount: 0,
                            transactions: []
                        }];
                }
            });
        });
    };
    return MultiSignature;
}());
export default MultiSignature;
//# sourceMappingURL=client-multisig.js.map