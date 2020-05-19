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
import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../__utils__/i18n';
import { WalletMultiSignature } from '@/components/Wallet/WalletMultiSignature';
import MultiSignatureClient from '@/services/client-multisig';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var samplePeer = Object.freeze({
    host: 'http://1.1.1.1',
    port: '1234'
});
var wrapper;
var errorMock;
var successMock;
var dispatchMock;
var createWrapper = function (component, gettersPeer) {
    component = component || WalletMultiSignature;
    gettersPeer = gettersPeer === undefined ? samplePeer : gettersPeer;
    errorMock = jest.fn();
    successMock = jest.fn();
    dispatchMock = jest.fn();
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        mocks: {
            $error: errorMock,
            $success: successMock,
            $store: {
                dispatch: dispatchMock,
                getters: {
                    get 'session/multiSignaturePeer'() {
                        return gettersPeer;
                    }
                }
            }
        },
        stubs: {
            Portal: '<div class="Portal"><slot /></div>',
            WalletTransactionsMultiSignature: '<div class="WalletTransactionsMultiSignature"></div>'
        }
    });
};
describe('WalletMultiSignature', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.contains('.WalletMultiSignature')).toBe(true);
    });
    it('should include WalletTransactionsMultiSignature component', function () {
        expect(wrapper.contains('.WalletTransactionsMultiSignature')).toBe(true);
    });
    describe('computed peer', function () {
        it('should get value from store', function () {
            expect(wrapper.vm.peer).toBe(samplePeer);
        });
    });
    describe('computed peerOutput', function () {
        it('should output peer if connected to one', function () {
            expect(wrapper.vm.peerOutput).toBe(samplePeer.host + ":" + samplePeer.port);
        });
        it('should output message if not connected to one', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, null);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.peerOutput).toBe('PEER.NONE');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('showLoadingModal', function () {
        it('should update when connecting to peer', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyHandshake, spyShowLoading;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyHandshake = jest.spyOn(MultiSignatureClient, 'performHandshake').mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); });
                        spyShowLoading = jest.spyOn(wrapper.vm, 'showLoadingModal', 'set').mockImplementation();
                        return [4 /*yield*/, wrapper.vm.connectPeer({ peer: samplePeer, closeTrigger: null })];
                    case 1:
                        _a.sent();
                        expect(spyShowLoading).toHaveBeenCalledWith(true);
                        expect(spyShowLoading).toHaveBeenCalledWith(false);
                        expect(spyShowLoading).toHaveBeenCalledTimes(2);
                        spyHandshake.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should show loader when true', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(wrapper.contains('.ModalLoader')).toBe(false);
                wrapper.vm.showLoadingModal = true;
                expect(wrapper.find('.ModalLoader').isVisible()).toBe(true);
                return [2 /*return*/];
            });
        }); });
    });
    describe('connectPeer', function () {
        it('should save peer if handshake is successful', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyHandshake;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyHandshake = jest.spyOn(MultiSignatureClient, 'performHandshake').mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, true];
                        }); }); });
                        return [4 /*yield*/, wrapper.vm.connectPeer({ peer: samplePeer, closeTrigger: null })];
                    case 1:
                        _a.sent();
                        expect(dispatchMock).toHaveBeenCalledWith('session/setMultiSignaturePeer', samplePeer);
                        expect(dispatchMock).toHaveBeenCalledWith('profile/setMultiSignaturePeer', samplePeer);
                        expect(dispatchMock).toHaveBeenCalledTimes(2);
                        expect(successMock).toHaveBeenCalledWith("PEER.CONNECTED: " + samplePeer.host + ":" + samplePeer.port);
                        expect(successMock).toHaveBeenCalledTimes(1);
                        spyHandshake.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should trigger close method if handshake is successful', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyHandshake, closeTrigger;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyHandshake = jest.spyOn(MultiSignatureClient, 'performHandshake').mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, true];
                        }); }); });
                        closeTrigger = jest.fn();
                        return [4 /*yield*/, wrapper.vm.connectPeer({ peer: samplePeer, closeTrigger: closeTrigger })];
                    case 1:
                        _a.sent();
                        expect(closeTrigger).toHaveBeenCalledTimes(1);
                        spyHandshake.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error if handshake is not successful', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyHandshake;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyHandshake = jest.spyOn(MultiSignatureClient, 'performHandshake').mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); });
                        return [4 /*yield*/, wrapper.vm.connectPeer({ peer: samplePeer, closeTrigger: null })];
                    case 1:
                        _a.sent();
                        expect(errorMock).toHaveBeenCalledWith('PEER.CONNECT_FAILED');
                        expect(errorMock).toHaveBeenCalledTimes(1);
                        spyHandshake.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=WalletMultiSignature.spec.js.map