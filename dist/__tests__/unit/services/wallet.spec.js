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
import * as bip39 from 'bip39';
import nock from 'nock';
import { Identities } from '@arkecosystem/crypto';
import WalletService from '../../../src/renderer/services/wallet';
import { CryptoUtils } from '@/services/crypto/utils';
jest.mock('@/store', function () { return ({
    getters: {
        'session/network': {
            crypto: require('@arkecosystem/crypto').Managers.configManager.config
        },
        'delegate/byUsername': function (username) {
            if (username === 'exists') {
                return {
                    username: 'exists'
                };
            }
            return false;
        }
    },
    dispatch: jest.fn(),
    watch: jest.fn()
}); });
beforeEach(function () {
    nock.cleanAll();
});
describe('Services > Wallet', function () {
    describe('generate', function () {
        it('should generate a wallet in English', function () {
            var wallet = WalletService.generate(30, 'english');
            expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address);
            expect(bip39.wordlists.english).toIncludeAllMembers(wallet.passphrase.split(' '));
        });
        it('should generate a wallet in Chinese (Traditional)', function () {
            var wallet = WalletService.generate(30, 'chinese_traditional');
            expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address);
            expect(bip39.wordlists.chinese_traditional).toIncludeAllMembers(wallet.passphrase.split(' '));
        });
        it('should generate a wallet in Chinese (Simplified)', function () {
            var wallet = WalletService.generate(30, 'chinese_simplified');
            expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address);
            expect(bip39.wordlists.chinese_simplified).toIncludeAllMembers(wallet.passphrase.split(' '));
        });
        it('should generate a wallet in Korean', function () {
            var wallet = WalletService.generate(30, 'korean');
            expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address);
            expect(bip39.wordlists.korean).toIncludeAllMembers(wallet.passphrase.split(' '));
        });
        it('should generate a wallet in French', function () {
            var wallet = WalletService.generate(30, 'french');
            expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address);
            expect(bip39.wordlists.french).toIncludeAllMembers(wallet.passphrase.split(' '));
        });
        it('should generate a wallet in Italian', function () {
            var wallet = WalletService.generate(30, 'italian');
            expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address);
            expect(bip39.wordlists.italian).toIncludeAllMembers(wallet.passphrase.split(' '));
        });
        it('should generate a wallet in Spanish', function () {
            var wallet = WalletService.generate(30, 'spanish');
            expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address);
            expect(bip39.wordlists.spanish).toIncludeAllMembers(wallet.passphrase.split(' '));
        });
        it('should generate a wallet in Japanese', function () {
            var wallet = WalletService.generate(30, 'japanese');
            expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address);
            expect(bip39.wordlists.japanese).toIncludeAllMembers(wallet.passphrase.split('　'));
        });
    });
    describe('generateSecondPassphrase', function () {
        it('should generate second passphrase for wallet in English', function () {
            var passphrase = WalletService.generateSecondPassphrase('english');
            expect(bip39.wordlists.english).toIncludeAllMembers(passphrase.split(' '));
        });
        it('should generate second passphrase for wallet in Chinese (Traditional)', function () {
            var passphrase = WalletService.generateSecondPassphrase('chinese_traditional');
            expect(bip39.wordlists.chinese_traditional).toIncludeAllMembers(passphrase.split(' '));
        });
        it('should generate second passphrase for wallet in Chinese (Simplified)', function () {
            var passphrase = WalletService.generateSecondPassphrase('chinese_simplified');
            expect(bip39.wordlists.chinese_simplified).toIncludeAllMembers(passphrase.split(' '));
        });
        it('should generate second passphrase for wallet in Korean', function () {
            var passphrase = WalletService.generateSecondPassphrase('korean');
            expect(bip39.wordlists.korean).toIncludeAllMembers(passphrase.split(' '));
        });
        it('should generate second passphrase for wallet in French', function () {
            var passphrase = WalletService.generateSecondPassphrase('french');
            expect(bip39.wordlists.french).toIncludeAllMembers(passphrase.split(' '));
        });
        it('should generate second passphrase for wallet in Italian', function () {
            var passphrase = WalletService.generateSecondPassphrase('italian');
            expect(bip39.wordlists.italian).toIncludeAllMembers(passphrase.split(' '));
        });
        it('should generate second passphrase for wallet in Spanish', function () {
            var passphrase = WalletService.generateSecondPassphrase('spanish');
            expect(bip39.wordlists.spanish).toIncludeAllMembers(passphrase.split(' '));
        });
        it('should generate second passphrase for wallet in Japanese', function () {
            var passphrase = WalletService.generateSecondPassphrase('japanese');
            expect(bip39.wordlists.japanese).toIncludeAllMembers(passphrase.split('　'));
        });
    });
    describe('getAddress', function () {
        var normalizeSpy;
        beforeEach(function () {
            normalizeSpy = jest.spyOn(CryptoUtils, 'normalizePassphrase');
        });
        afterEach(function () {
            normalizeSpy.mockRestore();
        });
        it('should work in English', function () {
            var passphrase = 'one video jaguar gap soldier ill hobby motor bundle couple trophy smoke';
            var address = 'DAy2xDNZLRQsgiJCnF3x4WDxGsBrmsKCsV';
            expect(WalletService.getAddress(passphrase, 30)).toEqual(address);
            expect(normalizeSpy).toHaveBeenCalledWith(passphrase);
        });
        it('should work in Chinese (Traditional)', function () {
            var passphrase = '苗 雛 陸 桿 用 腐 爐 詞 鬼 雨 爾 然';
            var address = 'DS6hPMzbgRkKCZa6fJSmQrG2M7toJAtd5B';
            expect(WalletService.getAddress(passphrase, 30)).toEqual(address);
            expect(normalizeSpy).toHaveBeenCalledWith(passphrase);
        });
        it('should work in French', function () {
            var passphrase = 'galerie notoire prudence mortier soupape cerise argent neurone pommade géranium potager émouvoir';
            var address = 'DUFdRiUNXt1PiLVakbq4ADo1Ttsx3kH1AT';
            expect(WalletService.getAddress(passphrase, 30)).toEqual(address);
            expect(normalizeSpy).toHaveBeenCalledWith(passphrase);
        });
        it('should work in Italian', function () {
            var passphrase = 'mucca comodo imbevuto talismano sconforto cavillo obelisco quota recupero malinteso gergo bipede';
            var address = 'D8nAGdSCCRMsLPsM4GgzRtgbiTn16rHW6J';
            expect(WalletService.getAddress(passphrase, 30)).toEqual(address);
            expect(normalizeSpy).toHaveBeenCalledWith(passphrase);
        });
        it('should work in Japanese', function () {
            var passphrase = 'うかべる　くすりゆび　ひさしぶり　たそがれ　そっこう　ちけいず　ひさしぶり　ていか　しゃちょう　けおりもの　ちぬり　りきせつ';
            var address = 'DQquFjRfgA26cut7A8wFC4Bbo4TawWArWr';
            expect(WalletService.getAddress(passphrase, 30)).toEqual(address);
            expect(normalizeSpy).toHaveBeenCalledWith(passphrase);
        });
        it('should work in Korean with initially decomposed characters', function () {
            var passphrase = '변명 박수 사건 실컷 목적 비용 가능 시골 수동적 청춘 식량 도망';
            var address = 'D5FvjRH136fbw8j4thcmKiFiJjfbYHT3zY';
            expect(WalletService.getAddress(passphrase, 30)).toEqual(address);
            expect(normalizeSpy).toHaveBeenCalledWith(passphrase);
        });
        it('should work in Korean without decomposing', function () {
            var passphrase = '변명 박수 사건 실컷 목적 비용 가능 시골 수동적 청춘 식량 도망';
            var address = 'D5FvjRH136fbw8j4thcmKiFiJjfbYHT3zY';
            expect(WalletService.getAddress(passphrase, 30)).toEqual(address);
            expect(normalizeSpy).toHaveBeenCalledWith(passphrase);
        });
        it('should work in Spanish', function () {
            var passphrase = 'cadena cadáver malla etapa vista alambre burbuja vejez aéreo taco rebaño tauro';
            var address = 'DNZSrNt7SQ1VBrzx7C17gbPv9FDAxnaor3';
            expect(WalletService.getAddress(passphrase, 30)).toEqual(address);
            expect(normalizeSpy).toHaveBeenCalledWith(passphrase);
        });
    });
    describe('getAddressFromPublicKey', function () {
        it('should generate the correct address', function () {
            var passphrase = 'one video jaguar gap soldier ill hobby motor bundle couple trophy smoke';
            var address = 'DAy2xDNZLRQsgiJCnF3x4WDxGsBrmsKCsV';
            expect(WalletService.getAddressFromPublicKey(Identities.PublicKey.fromPassphrase(passphrase), 30)).toEqual(address);
        });
    });
    describe('getAddressFromMultiSignatureAsset', function () {
        it('should get address for a multisignature asset', function () {
            var multisignatureAsset = {
                min: 2,
                publicKeys: [
                    '037eaa8cb236c40a08fcb9d6220743ee6ae1b5c40e8a77a38f286516c3ff663901',
                    '0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce',
                    '0209d3c0f68994253cee24b23df3266ba1f0ca2f0666cd69a46544d63001cdf150'
                ]
            };
            expect(WalletService.getAddressFromMultiSignatureAsset(multisignatureAsset)).toEqual('DHBKa1HFsKd9BYMPruYNAoadt5SW8oGggj');
        });
    });
    describe('getPublicKeyFromWallet', function () {
        it('should get public key for a standard wallet', function () {
            var wallet = {
                publicKey: '037eaa8cb236c40a08fcb9d6220743ee6ae1b5c40e8a77a38f286516c3ff663901'
            };
            expect(WalletService.getPublicKeyFromWallet(wallet)).toEqual('037eaa8cb236c40a08fcb9d6220743ee6ae1b5c40e8a77a38f286516c3ff663901');
        });
        it('should return null if no public key', function () {
            var wallet = {};
            expect(WalletService.getPublicKeyFromWallet(wallet)).toEqual(null);
        });
        it('should get public key from multisignature info if exists', function () {
            var multiSignatureSpy = jest.spyOn(WalletService, 'getPublicKeyFromMultiSignatureAsset').mockImplementation(function () { return true; });
            var wallet = {
                multiSignature: true
            };
            WalletService.getPublicKeyFromWallet(wallet);
            expect(multiSignatureSpy).toHaveBeenCalledWith(wallet.multiSignature);
            multiSignatureSpy.mockRestore();
        });
    });
    describe('getPublicKeyFromPassphrase', function () {
        it('should get public key for a standard wallet', function () {
            var passphrase = 'passphrase 1';
            var publicKey = Identities.PublicKey.fromPassphrase(passphrase);
            expect(WalletService.getPublicKeyFromPassphrase(passphrase)).toEqual('03e8021105a6c202097e97e6c6d650942d913099bf6c9f14a6815df1023dde3b87');
            expect(WalletService.getPublicKeyFromPassphrase(passphrase)).toEqual(publicKey);
        });
    });
    describe('getPublicKeyFromMultiSignatureAsset', function () {
        it('should get public key from multisignature info if exists', function () {
            var multiSignatureSpy = jest.spyOn(WalletService, 'getPublicKeyFromMultiSignatureAsset');
            var wallet = {
                multiSignature: {
                    min: 2,
                    publicKeys: [
                        '037eaa8cb236c40a08fcb9d6220743ee6ae1b5c40e8a77a38f286516c3ff663901',
                        '0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce',
                        '0209d3c0f68994253cee24b23df3266ba1f0ca2f0666cd69a46544d63001cdf150'
                    ]
                }
            };
            expect(WalletService.getPublicKeyFromWallet(wallet)).toEqual('03e8d4175126a39ed7ba803f31705b6f5fb78cbf46455ba778c5f39a32c6adfbd9');
            expect(multiSignatureSpy).toHaveBeenCalledWith(wallet.multiSignature);
            multiSignatureSpy.mockRestore();
        });
    });
    describe('isNeoAddress', function () {
        var address = Identities.Address.fromPassphrase('test address', 23);
        it('should check if valid version', function () {
            var validateAddressSpy = jest.spyOn(WalletService, 'validateAddress').mockImplementation(function () { return (false); });
            WalletService.isNeoAddress(address);
            expect(validateAddressSpy).toHaveBeenCalledWith(address, 23);
            validateAddressSpy.mockRestore();
        });
        it('should return false if not on NEO network', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nock('https://neoscan.io')
                            .persist()
                            .get("/api/main_net/v1/get_last_transactions_by_address/" + address)
                            .reply(200, []);
                        _a = expect;
                        return [4 /*yield*/, WalletService.isNeoAddress(address)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return true if on NEO network', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nock('https://neoscan.io')
                            .persist()
                            .get("/api/main_net/v1/get_last_transactions_by_address/" + address)
                            .reply(200, [{
                                vouts: [],
                                vin: []
                            }]);
                        _a = expect;
                        return [4 /*yield*/, WalletService.isNeoAddress(address)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('canResignDelegate', function () {
        it('should return true if delegate that has not resigned', function () {
            var wallet = {
                isDelegate: true,
                isResigned: false
            };
            expect(WalletService.canResignDelegate(wallet)).toBe(true);
        });
        it('should return false if delegate has resigned', function () {
            var wallet = {
                isDelegate: true,
                isResigned: true
            };
            expect(WalletService.canResignDelegate(wallet)).toBe(false);
        });
        it('should return false if not a delegate', function () {
            var wallet = {};
            expect(WalletService.canResignDelegate(wallet)).toBe(false);
        });
    });
    describe('isBusiness', function () {
        it('should return true if wallet has not resigned as a business when checking both scenarios', function () {
            var wallet = {
                business: {
                    name: 'mybusiness',
                    resigned: false
                }
            };
            expect(WalletService.isBusiness(wallet)).toBe(true);
            expect(WalletService.isBusiness(wallet, false)).toBe(true);
        });
        it('should return true if wallet has ever been a business', function () {
            var wallet = {
                business: {
                    name: 'mybusiness',
                    resigned: true
                }
            };
            expect(WalletService.isBusiness(wallet)).toBe(true);
        });
        it('should return false when checking if wallet has resigned as a business', function () {
            var wallet = {
                business: {
                    name: 'mybusiness',
                    resigned: true
                }
            };
            expect(WalletService.isBusiness(wallet, false)).toBe(false);
        });
        it('should return false if wallet has never been a business', function () {
            var wallet = {};
            expect(WalletService.isBusiness(wallet)).toBe(false);
        });
    });
    describe('canResignBusiness', function () {
        it('should return true if business that has not resigned', function () {
            var wallet = {
                business: {
                    name: 'mybusiness',
                    resigned: false
                }
            };
            expect(WalletService.canResignBusiness(wallet)).toBe(true);
        });
        it('should return false if business has resigned', function () {
            var wallet = {
                business: {
                    name: 'mybusiness',
                    resigned: true
                }
            };
            expect(WalletService.canResignBusiness(wallet)).toBe(false);
        });
        it('should return false if not a business', function () {
            var wallet = {};
            expect(WalletService.canResignBusiness(wallet)).toBe(false);
        });
    });
    describe('hasBridgechains', function () {
        var vm;
        beforeEach(function () {
            vm = {
                $client: {
                    fetchBusinessBridgechains: jest.fn()
                }
            };
        });
        it('should return true if active bridgechains', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        vm.$client.fetchBusinessBridgechains.mockReturnValue({
                            data: [{
                                    isResigned: false
                                }, {
                                    isResigned: false
                                }, {
                                    isResigned: true
                                }]
                        });
                        _a = expect;
                        return [4 /*yield*/, WalletService.hasBridgechains({}, vm)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false if all bridgechains are resigned', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        vm.$client.fetchBusinessBridgechains.mockReturnValue({
                            data: [{
                                    isResigned: true
                                }, {
                                    isResigned: true
                                }, {
                                    isResigned: true
                                }]
                        });
                        _a = expect;
                        return [4 /*yield*/, WalletService.hasBridgechains({}, vm)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false if no bridgechains', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        vm.$client.fetchBusinessBridgechains.mockReturnValue({
                            data: []
                        });
                        _a = expect;
                        return [4 /*yield*/, WalletService.hasBridgechains({}, vm)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Messages', function () {
        var message = 'test message';
        var passphrase = 'test passphrase';
        var publicKey = Identities.PublicKey.fromPassphrase(passphrase);
        var messageSignature = '30440220115d561431df663a0e8b2807e0036d08ebdbbd0b77317cf6cd73d861c0983baf0220624792bd66453e666b3f08f4ee62b63736246e45da0bb19c9f747a37ce8b3db7';
        describe('signMessage', function () {
            it('should sign a message', function () {
                var response = WalletService.signMessage(message, passphrase);
                expect(response.message).toEqual(message);
                expect(response.publicKey).toEqual(publicKey);
                expect(response.signature).toEqual(messageSignature);
            });
        });
        describe('signMessageWithWif', function () {
            it('should sign a message', function () {
                var wif = Identities.WIF.fromPassphrase(passphrase);
                var response = WalletService.signMessageWithWif(message, wif, {
                    wif: 170
                });
                expect(response.message).toEqual(message);
                expect(response.publicKey).toEqual(publicKey);
                expect(response.signature).toEqual(messageSignature);
            });
        });
        describe('verifyMessage', function () {
            it('should return true if verified successfully', function () {
                expect(WalletService.verifyMessage(message, publicKey, messageSignature)).toBe(true);
            });
            it('should throw an error for wrong signature', function () {
                expect(function () {
                    WalletService.verifyMessage(message, publicKey, 'wrong');
                }).toThrowError();
            });
        });
    });
    describe('validateAddress', function () {
        it('should return true if the address is valid', function () {
            var address = Identities.Address.fromPassphrase('test passphrase');
            expect(WalletService.validateAddress(address)).toBe(true);
        });
        it('should return true if the address is valid on another network', function () {
            var address = Identities.Address.fromPassphrase('test passphrase', 23);
            expect(WalletService.validateAddress(address, 23)).toBe(true);
        });
        it('should return false if the address is not valid', function () {
            expect(WalletService.validateAddress('not an address')).toBe(false);
        });
        it('should return false if the address is for a different network', function () {
            var address = Identities.Address.fromPassphrase('test passphrase for mainnet', 23);
            expect(WalletService.validateAddress(address)).toBe(false);
        });
    });
    describe('validatePassphrase', function () {
        it('should return true when a string is provided', function () {
            expect(WalletService.validatePassphrase('test')).toBe(true);
        });
    });
    describe('isBip39Passphrase', function () {
        it('should return true for a valid passphrase', function () {
            expect(WalletService.isBip39Passphrase('one video jaguar gap soldier ill hobby motor bundle couple trophy smoke', 'english')).toBeTrue();
        });
        it('should return false for an invalid passphrase', function () {
            expect(WalletService.isBip39Passphrase('one two three four five six seven eight nine ten eleven twelve', 'english')).toBeFalse();
        });
    });
    describe('validateUsername', function () {
        it('should work OK', function () {
            var username = 'example';
            expect(WalletService.validateUsername(username)).toEqual({
                passes: true,
                errors: []
            });
        });
        it('should not be empty', function () {
            var username = '';
            expect(WalletService.validateUsername(username)).toEqual({
                passes: false,
                errors: [{ type: 'empty' }]
            });
        });
        it('should admit 20 characters at most', function () {
            var username = 'asdf1234asdf1234asdf1234';
            expect(WalletService.validateUsername(username)).toEqual({
                passes: false,
                errors: [{ type: 'maxLength' }]
            });
        });
        it('should error if username exists', function () {
            var username = 'exists';
            expect(WalletService.validateUsername(username)).toEqual({
                passes: false,
                errors: [{ type: 'exists' }]
            });
        });
        it('should not admit uppercase characters', function () {
            var username = 'eXamPLe';
            expect(WalletService.validateUsername(username)).toEqual({
                passes: false,
                errors: [{ type: 'invalidFormat' }]
            });
        });
        it('should admit only alphanumeric characters and some symbols', function () {
            expect(WalletService.validateUsername('a!5@$&_.')).toEqual({
                passes: true,
                errors: []
            });
            expect(WalletService.validateUsername('~ll')).toEqual({
                passes: false,
                errors: [{ type: 'invalidFormat' }]
            });
            expect(WalletService.validateUsername('a#')).toEqual({
                passes: false,
                errors: [{ type: 'invalidFormat' }]
            });
            expect(WalletService.validateUsername('a%0')).toEqual({
                passes: false,
                errors: [{ type: 'invalidFormat' }]
            });
            expect(WalletService.validateUsername('(a)')).toEqual({
                passes: false,
                errors: [{ type: 'invalidFormat' }]
            });
            expect(WalletService.validateUsername('a}a{')).toEqual({
                passes: false,
                errors: [{ type: 'invalidFormat' }]
            });
            expect(WalletService.validateUsername('a[a]')).toEqual({
                passes: false,
                errors: [{ type: 'invalidFormat' }]
            });
            expect(WalletService.validateUsername('a+a')).toEqual({
                passes: false,
                errors: [{ type: 'invalidFormat' }]
            });
            expect(WalletService.validateUsername('a-a')).toEqual({
                passes: false,
                errors: [{ type: 'invalidFormat' }]
            });
        });
    });
    describe('verifyPassphrase', function () {
        it('should return true if address matches passphrase', function () {
            var passphrase = 'test passphrase';
            var address = Identities.Address.fromPassphrase(passphrase);
            expect(WalletService.verifyPassphrase(address, passphrase)).toBe(true);
        });
        it('should return false if address matches passphrase but wrong network', function () {
            var passphrase = 'test passphrase';
            var address = Identities.Address.fromPassphrase(passphrase);
            expect(WalletService.verifyPassphrase(address, passphrase, 23)).toBe(false);
        });
        it('should return false if address is not related to passphrase', function () {
            var passphrase = 'test passphrase';
            expect(WalletService.verifyPassphrase('wrong address', passphrase)).toBe(false);
        });
    });
});
//# sourceMappingURL=wallet.spec.js.map