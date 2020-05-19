var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import store from '@/store';
import config from '@config';
var storeSnapshot = JSON.parse(JSON.stringify(store.state));
beforeEach(function () {
    store.replaceState(JSON.parse(JSON.stringify(storeSnapshot)));
});
describe('NetworkModule', function () {
    var networks = [
        { id: 'yes', name: 'yes', token: 'YES', symbol: 'y' },
        { id: 'maybe', name: 'maybe', token: 'MAY', symbol: 'm' }
    ];
    var customNetworks = [
        { id: 'custom', name: 'custom', token: 'CUST', symbol: 'c' },
        { id: 'custom 2', name: 'custom 2', token: 'CUST', symbol: 'c' }
    ];
    describe('getters bySymbol', function () {
        beforeEach(function () {
            networks.forEach(function (model) { return store.commit('network/STORE', model); });
        });
        afterEach(function () {
            networks.forEach(function (model) { return store.commit('network/DELETE', model.id); });
        });
        describe('when the symbol param does not exist', function () {
            it('should return `undefined`', function () {
                expect(store.getters['network/bySymbol']('n')).toBeUndefined();
            });
        });
        describe('when the symbol param exists', function () {
            it('should find and return the wallet', function () {
                expect(store.getters['network/bySymbol']('y')).toEqual(networks[0]);
            });
        });
    });
    describe('getters byToken', function () {
        beforeEach(function () {
            networks.forEach(function (model) { return store.commit('network/STORE', model); });
        });
        afterEach(function () {
            networks.forEach(function (model) { return store.commit('network/DELETE', model.id); });
        });
        describe('when the token param does not exist', function () {
            it('should return `undefined`', function () {
                expect(store.getters['network/byToken']('NOT')).toBeUndefined();
            });
        });
        describe('when the token param exists', function () {
            it('should find and return the wallet', function () {
                expect(store.getters['network/byToken']('YES')).toEqual(networks[0]);
            });
        });
    });
    describe('actions load', function () {
        it('should set the network defaults if empty', function () {
            expect(store.getters['network/all']).toBeEmpty();
            store.dispatch('network/load');
            expect(store.getters['network/all']).toEqual(config.NETWORKS);
        });
        it('should not set the network if not empty', function () {
            store.commit('network/STORE', networks[0]);
            expect(store.getters['network/all']).toEqual([networks[0]]);
            store.dispatch('network/load');
            expect(store.getters['network/all']).toEqual([networks[0]]);
        });
        it('should load missing custom networks', function () {
            store.commit('network/STORE', networks[0]);
            customNetworks.forEach(function (network) { return store.commit('network/ADD_CUSTOM_NETWORK', network); });
            expect(store.getters['network/all']).toEqual([networks[0]]);
            store.dispatch('network/load');
            expect(store.getters['network/all']).toEqual(__spreadArrays([networks[0]], customNetworks));
        });
    });
});
//# sourceMappingURL=network.spec.js.map