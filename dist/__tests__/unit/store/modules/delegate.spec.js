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
import nock from 'nock';
import Vue from 'vue';
import Vuex from 'vuex';
import apiClient, { client as ClientService } from '@/plugins/api-client';
import store from '@/store';
import delegates, { delegate1, delegate2 } from '../../__fixtures__/store/delegate';
import { network1 } from '../../__fixtures__/store/network';
import { profile1 } from '../../__fixtures__/store/profile';
Vue.use(Vuex);
Vue.use(apiClient);
beforeAll(function () {
    store.commit('network/SET_ALL', [network1]);
    store.commit('profile/CREATE', profile1);
    store.commit('session/SET_PROFILE_ID', profile1.id);
    store.dispatch('delegate/set', delegates);
});
beforeEach(function () {
    nock.cleanAll();
    ClientService.host = 'http://127.0.0.1';
});
describe('delegate store module', function () {
    it('should get delegate list', function () {
        expect(Object.values(store.getters['delegate/all'][profile1.networkId])).toEqual(delegates);
    });
    it('should get a single delegate by its address', function () {
        expect(store.getters['delegate/byAddress']('AKdr5d9AMEnsKYxpDcoHdyyjSCKVx3r9Nj')).toEqual(delegate1);
    });
    it('should return false when delegate with address does not exist', function () {
        expect(store.getters['delegate/byAddress']('wrong address')).toBe(false);
    });
    it('should return false when no address is given', function () {
        expect(store.getters['delegate/byAddress']()).toBe(false);
    });
    it('should get a single delegate by its public key', function () {
        expect(store.getters['delegate/byPublicKey']('02bf72c578a12c35a97ca1230b93017161ee42c3f0ab82f6fe7c95b3b43561a076')).toEqual(delegate2);
    });
    it('should return false when delegate with public key does not exist', function () {
        expect(store.getters['delegate/byPublicKey']('wrong public key')).toBe(false);
    });
    it('should return false when no public key is given', function () {
        expect(store.getters['delegate/byPublicKey']()).toBe(false);
    });
    describe('dispatch', function () {
        describe('load', function () {
            it('should fetch delegates from api', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            nock('http://127.0.0.1')
                                .get('/api/delegates')
                                .query({ page: 1, limit: 100, orderBy: 'rank:asc' })
                                .reply(200, {
                                data: delegates,
                                meta: {
                                    totalCount: 2
                                }
                            });
                            return [4 /*yield*/, store.dispatch('delegate/load')];
                        case 1:
                            _a.sent();
                            expect(Object.values(store.getters['delegate/all'][profile1.networkId])).toEqual(delegates);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should load all pages', function () { return __awaiter(void 0, void 0, void 0, function () {
                var pageCount, _loop_1, page;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pageCount = 10;
                            _loop_1 = function (page) {
                                nock('http://127.0.0.1')
                                    .get('/api/delegates')
                                    .query({ page: page, limit: 100, orderBy: 'rank:asc' })
                                    .reply(200, {
                                    data: delegates.map(function (delegate) { return (__assign(__assign({}, delegate), { address: delegate.address + "-" + page })); }),
                                    meta: {
                                        pageCount: 10,
                                        totalCount: (delegates.length * 10)
                                    }
                                });
                            };
                            for (page = 1; page <= pageCount; page++) {
                                _loop_1(page);
                            }
                            return [4 /*yield*/, store.dispatch('delegate/load')];
                        case 1:
                            _a.sent();
                            expect(Object.values(store.getters['delegate/all'][profile1.networkId]).length).toEqual(delegates.length * 10);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=delegate.spec.js.map