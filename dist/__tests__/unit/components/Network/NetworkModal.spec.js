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
import { shallowMount } from '@vue/test-utils';
import { useI18nGlobally } from '../../__utils__/i18n';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import nock from 'nock';
import { NetworkModal } from '@/components/Network';
import { testIsValid, testNumeric, testRequired, testScheme, testUrl } from '../../__utils__/validation';
var i18n = useI18nGlobally();
var wrapper;
var mocks = {
    $store: {
        dispatch: jest.fn(),
        getters: {
            'network/byName': jest.fn(function (name) {
                return name === 'exists';
            })
        }
    },
    $error: jest.fn(),
    $logger: {
        error: jest.fn()
    }
};
jest.mock('@/store', function () { return ({
    getters: {
        'session/network': {
            nethash: '1234'
        }
    }
}); });
Vue.use(Vuelidate);
describe('NetworkModal', function () {
    beforeEach(function () {
        wrapper = shallowMount(NetworkModal, {
            i18n: i18n,
            mocks: mocks,
            props: {
                title: 'Network Modal'
            }
        });
        nock.cleanAll();
    });
    it('should render modal', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('form validation', function () {
        describe('name', function () {
            it('should switch from invalid to valid to invalid for required when changed', function () {
                testRequired(wrapper.vm.$v.form.name);
            });
            it('should switch from invalid to valid to invalid when network name exists', function () {
                wrapper.vm.$v.form.name.$model = 'exists';
                expect(wrapper.vm.$v.form.name.doesNotExist).toBe(false);
                expect(wrapper.vm.$v.form.name.$invalid).toBe(true);
                wrapper.vm.$v.form.name.$model = 'not exists';
                expect(wrapper.vm.$v.form.name.doesNotExist).toBe(true);
                expect(wrapper.vm.$v.form.name.$invalid).toBe(false);
                wrapper.vm.$v.form.name.$model = 'exists';
                expect(wrapper.vm.$v.form.name.doesNotExist).toBe(false);
                expect(wrapper.vm.$v.form.name.$invalid).toBe(true);
            });
        });
        describe('description', function () {
            it('should switch from invalid to valid to invalid for required when changed', function () {
                testRequired(wrapper.vm.$v.form.description);
            });
        });
        describe('server', function () {
            it('should switch from invalid to valid to invalid for required when changed', function () {
                testRequired(wrapper.vm.$v.form.server, 'http://1.2.3.4');
            });
            it('should switch from invalid to valid to invalid for url', function () {
                testUrl(wrapper.vm.$v.form.server);
            });
            it('should switch from invalid to valid to invalid when has scheme', function () {
                testScheme(wrapper.vm.$v.form.server);
            });
        });
        describe('fetch button', function () {
            beforeEach(function () {
                wrapper.vm.$v.form.name.$model = 'sample name';
                wrapper.vm.$v.form.description.$model = 'sample description';
                wrapper.vm.$v.form.server.$model = 'http://1.2.3.4';
            });
            it('should enable if all valid', function () {
                expect(wrapper.vm.$v.form.$invalid).toBe(false);
            });
            it('should disable if invalid name', function () {
                wrapper.vm.$v.form.name.$model = 'exists';
                expect(wrapper.vm.$v.form.$invalid).toBe(true);
            });
            it('should disable if invalid description', function () {
                wrapper.vm.$v.form.description.$model = '';
                expect(wrapper.vm.$v.form.$invalid).toBe(true);
            });
            it('should disable if invalid server', function () {
                wrapper.vm.$v.form.server.$model = 'http://test.com:abcd';
                expect(wrapper.vm.$v.form.$invalid).toBe(true);
            });
        });
        describe('fetchNetworkInfo', function () {
            beforeEach(function () {
                wrapper.vm.$v.form.name.$model = 'sample name';
                wrapper.vm.$v.form.description.$model = 'sample description';
                wrapper.vm.$v.form.server.$model = 'http://1.2.3.4';
            });
            it('should fetch data and populate', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            nock('http://1.2.3.4')
                                .get('/api/node/configuration')
                                .reply(200, {
                                data: {
                                    nethash: 1234,
                                    token: 'TEST',
                                    constants: {
                                        activeDelegates: 48,
                                        vendorFieldLength: 10
                                    }
                                }
                            });
                            nock('https://min-api.cryptocompare.com')
                                .get('/data/price')
                                .query({
                                fsym: 'TEST',
                                tsyms: 'BTC'
                            })
                                .reply(200, {
                                BTC: true
                            });
                            return [4 /*yield*/, wrapper.vm.fetchNetworkInfo()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$v.form.$model.activeDelegates).toBe('48');
                            expect(wrapper.vm.$v.form.$model.vendorField.maxLength).toBe(10);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('full form', function () {
            beforeEach(function () {
                wrapper.vm.configChoice = 'Basic';
                wrapper.vm.showFull = true;
            });
            describe('nethash', function () {
                it('should switch from invalid to valid to invalid for required when changed', function () {
                    testRequired(wrapper.vm.$v.form.nethash, '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988');
                });
                it('should switch from invalid to valid to invalid for format', function () {
                    testIsValid(wrapper.vm.$v.form.nethash, [
                        {
                            value: 'not a nethash',
                            valid: false
                        },
                        {
                            value: '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988',
                            valid: true
                        },
                        {
                            value: 'not a nethash',
                            valid: false
                        }
                    ]);
                });
            });
            describe('token', function () {
                it('should switch from invalid to valid to invalid for required when changed', function () {
                    testRequired(wrapper.vm.$v.form.token);
                });
            });
            describe('symbol', function () {
                it('should switch from invalid to valid to invalid for required when changed', function () {
                    testRequired(wrapper.vm.$v.form.symbol);
                });
            });
            describe('version', function () {
                it('should switch from invalid to valid to invalid for required when changed', function () {
                    testRequired(wrapper.vm.$v.form.version, 1);
                });
                it('should switch from invalid to valid to invalid for format', function () {
                    testNumeric(wrapper.vm.$v.form.version);
                });
            });
            describe('explorer', function () {
                it('should switch from invalid to valid to invalid for required when changed', function () {
                    testRequired(wrapper.vm.$v.form.explorer, 'http://1.2.3.4');
                });
                it('should switch from invalid to valid to invalid for url', function () {
                    testUrl(wrapper.vm.$v.form.explorer);
                });
                it('should switch from invalid to valid to invalid when has scheme', function () {
                    testScheme(wrapper.vm.$v.form.explorer);
                });
            });
            describe('knownWalletsUrl', function () {
                it('should switch from invalid to valid to invalid for url', function () {
                    testUrl(wrapper.vm.$v.form.knownWalletsUrl);
                });
            });
            describe('epoch', function () {
                it('should switch from invalid to valid to invalid for required when changed', function () {
                    testRequired(wrapper.vm.$v.form.epoch, '2019-04-09T15:32:16.123Z');
                });
                it('should switch from invalid to valid to invalid for epoch timestamp', function () {
                    testIsValid(wrapper.vm.$v.form.epoch, [
                        {
                            value: 'not valid',
                            valid: false
                        },
                        {
                            value: '2019-04-09T15:32:16.123Z',
                            valid: true
                        },
                        {
                            value: '2019-04-09T15:32:16.123',
                            valid: false
                        },
                        {
                            value: '2019-04-09T15:32:16.000Z',
                            valid: true
                        },
                        {
                            value: '04/09/2019 15:32:16',
                            valid: false
                        }
                    ]);
                });
            });
            describe('wif', function () {
                it('should switch from invalid to valid to invalid for required when changed', function () {
                    testRequired(wrapper.vm.$v.form.wif, 1);
                });
                it('should switch from invalid to valid to invalid for format', function () {
                    testNumeric(wrapper.vm.$v.form.wif);
                });
            });
            describe('slip44', function () {
                it('should switch from invalid to valid to invalid for required when changed', function () {
                    testRequired(wrapper.vm.$v.form.slip44, 1);
                });
            });
            describe('activeDelegates', function () {
                it('should switch from invalid to valid to invalid for required when changed', function () {
                    testRequired(wrapper.vm.$v.form.activeDelegates, 1);
                });
                it('should switch from invalid to valid to invalid for format', function () {
                    testNumeric(wrapper.vm.$v.form.activeDelegates);
                });
            });
            describe('validateSeed', function () {
                var spyDispatch;
                beforeEach(function () {
                    spyDispatch = jest.spyOn(mocks.$store, 'dispatch');
                });
                afterEach(function () {
                    spyDispatch.mockRestore();
                });
                it('should return true for correct urls', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                wrapper.vm.$v.form.server.$model = 'http://1.2.3.4:4040';
                                spyDispatch.mockImplementation(function () { return ({}); });
                                _a = expect;
                                return [4 /*yield*/, wrapper.vm.validateSeed()];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).toBeTruthy();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should return false for incorrect urls', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                wrapper.vm.$v.form.server.$model = 'http://1.2.3.4:4040:4040';
                                _a = expect;
                                return [4 /*yield*/, wrapper.vm.validateSeed()];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).toBe(false);
                                expect(spyDispatch).not.toHaveBeenCalled();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('save button', function () {
                beforeEach(function () {
                    wrapper.vm.$v.form.name.$model = 'sample name';
                    wrapper.vm.$v.form.description.$model = 'sample description';
                    wrapper.vm.$v.form.server.$model = 'http://1.2.3.4';
                    wrapper.vm.$v.form.nethash.$model = '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988';
                    wrapper.vm.$v.form.token.$model = 'A';
                    wrapper.vm.$v.form.symbol.$model = 'A';
                    wrapper.vm.$v.form.version.$model = '1';
                    wrapper.vm.$v.form.explorer.$model = 'http://1.2.3.4';
                    wrapper.vm.$v.form.knownWalletsUrl.$model = 'http://1.2.3.4/know-wallets.json';
                    wrapper.vm.$v.form.epoch.$model = '2019-04-09T15:32:16.123Z';
                    wrapper.vm.$v.form.wif.$model = '1';
                    wrapper.vm.$v.form.slip44.$model = '1';
                    wrapper.vm.$v.form.activeDelegates.$model = '1';
                });
                it('should enable if all valid', function () {
                    expect(wrapper.vm.$v.form.$invalid).toBe(false);
                });
                it('should disable if invalid name', function () {
                    wrapper.vm.$v.form.name.$model = 'exists';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid description', function () {
                    wrapper.vm.$v.form.description.$model = '';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid server', function () {
                    wrapper.vm.$v.form.server.$model = 'http://test.com:abcd';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid nethash', function () {
                    wrapper.vm.$v.form.nethash.$model = 'not a nethash';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid token', function () {
                    wrapper.vm.$v.form.token.$model = '';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid symbol', function () {
                    wrapper.vm.$v.form.symbol.$model = '';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid version', function () {
                    wrapper.vm.$v.form.version.$model = 'ten';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid explorer', function () {
                    wrapper.vm.$v.form.explorer.$model = 'http://test.com:abcd';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid knownWalletsUrl', function () {
                    wrapper.vm.$v.form.knownWalletsUrl.$model = 'http://test.com:abcd/know-wallets.json';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid epoch', function () {
                    wrapper.vm.$v.form.epoch.$model = '04/09/2019 15:32:16';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid wif', function () {
                    wrapper.vm.$v.form.wif.$model = 'ten';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid slip44', function () {
                    wrapper.vm.$v.form.slip44.$model = '';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
                it('should disable if invalid activeDelegates', function () {
                    wrapper.vm.$v.form.activeDelegates.$model = 'ten';
                    expect(wrapper.vm.$v.form.$invalid).toBe(true);
                });
            });
        });
    });
});
//# sourceMappingURL=NetworkModal.spec.js.map