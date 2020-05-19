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
import Bip38 from '@/services/bip38';
var bip38key = '6PYRXLq9jrSmgsa9zxoTWWiCQsQt3urzCM4HPBwj1eR2WyH96qiRVggod7';
var passphrase = 'sample passphrase';
var password = 'testing';
var wif = 170;
var bip38;
beforeEach(function () {
    bip38 = new Bip38();
    jest.spyOn(bip38.worker, 'on');
    jest.spyOn(bip38.worker, 'send');
});
afterEach(function () {
    bip38.worker.on.mockRestore();
    bip38.worker.send.mockRestore();
    bip38.worker.send('quit');
});
describe('BIP38 service', function () {
    describe('decrypt', function () {
        it('should send the data to decrypt to the worker', function () {
            bip38.decrypt({ bip38key: bip38key, password: password, wif: wif });
            expect(bip38.worker.send).toHaveBeenCalledWith({ bip38key: bip38key, password: password, wif: wif });
        });
        describe('when there is a successful message', function () {
            it('should resolve the Promise', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(bip38.decrypt({ bip38key: bip38key, password: password, wif: wif })).resolves.toEqual({ encodedWif: 'SHPmaLNivfNRW9yf5indKKKuUCabUvNQdvpkcLJEvnNB8Q45Ki4U' })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, 20000);
        });
        describe('when there is an error message', function () {
            it('should reject the Promise', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(bip38.decrypt({ bip38key: 'lol', password: password, wif: wif })).rejects.toBe('Failed to decrypt passphrase: Non-base58 character')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('encrypt', function () {
        it('should send the data to encrypt to the worker', function () {
            bip38.encrypt({ passphrase: passphrase, password: password, wif: wif });
            expect(bip38.worker.send).toHaveBeenCalledWith({ passphrase: passphrase, password: password, wif: wif });
        });
        describe('when there is a successful message', function () {
            it('should resolve the Promise', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(bip38.encrypt({ passphrase: passphrase, password: password, wif: wif })).resolves.toEqual({ bip38key: '6PYRXLq9jrSmgsa9zxoTWWiCQsQt3urzCM4HPBwj1eR2WyH96qiRVggod7' })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, 20000);
        });
        describe('when there is an error message', function () {
            it('should reject the Promise', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(bip38.encrypt({ passphrase: passphrase, password: password, wif: null })).rejects.toBe("Failed to encrypt passphrase: Cannot read property 'version' of null")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('quit', function () {
        it('should send the `quit` message to the worker', function () {
            bip38.quit();
            expect(bip38.worker.send).toHaveBeenCalledWith('quit');
        });
    });
});
//# sourceMappingURL=bip38.spec.js.map