import { create as createStorageSandbox } from '@/services/plugin-manager/sandbox/storage-sandbox';
var plugin = {
    config: {
        id: 'profile1'
    }
};
var walletApi;
var app;
beforeAll(function () {
    walletApi = {};
    var db = {};
    app = {
        $store: {
            getters: {
                'plugin/pluginOptions': jest.fn(function (_, data) {
                    var profileId = data === 'global' ? 'global' : app.$store.getters['session/profileId'];
                    return db[profileId] || [];
                }),
                'session/profileId': '1'
            },
            dispatch: jest.fn(function (action, data) {
                if (action === 'plugin/setPluginOption') {
                    if (!db[data.profileId]) {
                        db[data.profileId] = {};
                    }
                    db[data.profileId][data.key] = data.value;
                }
                else if (action === 'plugin/deletePluginOptionsForProfile') {
                    delete db[data.profileId];
                }
            })
        }
    };
    var storageSandbox = createStorageSandbox(walletApi, app, plugin);
    storageSandbox();
});
describe('Storage Sandbox', function () {
    var globalOptions = {
        key: 'globaltest',
        value: 1,
        pluginId: plugin.config.id,
        profileId: 'global'
    };
    var localOptions = {
        key: 'test',
        value: 1,
        pluginId: plugin.config.id,
        profileId: '1'
    };
    it('should expose functions', function () {
        expect(walletApi.storage).toBeTruthy();
        expect(walletApi.storage.getOptions).toBeTruthy();
        expect(walletApi.storage.get).toBeTruthy();
        expect(walletApi.storage.set).toBeTruthy();
        expect(walletApi.storage.clear).toBeTruthy();
    });
    describe('set', function () {
        it('should set a value to key', function () {
            walletApi.storage.set(localOptions.key, localOptions.value);
            expect(app.$store.dispatch).toHaveBeenCalledWith('plugin/setPluginOption', localOptions);
        });
        it('should set a value to global key', function () {
            walletApi.storage.set(globalOptions.key, globalOptions.value, true);
            expect(app.$store.dispatch).toHaveBeenCalledWith('plugin/setPluginOption', globalOptions);
        });
    });
    describe('get', function () {
        it('should get the value of key', function () {
            var result = walletApi.storage.get(localOptions.key);
            expect(app.$store.getters['plugin/pluginOptions']).toHaveBeenCalledWith(plugin.config.id, '1');
            expect(result).toBe(localOptions.value);
        });
        it('should get the value of global key from the same profile', function () {
            var result = walletApi.storage.get(globalOptions.key, true);
            expect(result).toBe(globalOptions.value);
        });
        it('should get the value of global key from a different profile', function () {
            app.$store.getters['session/profileId'] = '2';
            var result = walletApi.storage.get(globalOptions.key, true);
            expect(result).toBe(globalOptions.value);
        });
        it('should NOT get the value of a local key from a different profile', function () {
            app.$store.getters['session/profileId'] = '2';
            var result = walletApi.storage.get(localOptions.key);
            expect(result).toBe(undefined);
        });
    });
    describe('getOptions', function () {
        it('should get all local values', function () {
            app.$store.getters['session/profileId'] = '1';
            var result = walletApi.storage.getOptions();
            expect(Object.keys(result)).toHaveLength(1);
            expect(result).toHaveProperty(localOptions.key, localOptions.value);
            app.$store.getters['session/profileId'] = '2';
            result = walletApi.storage.getOptions();
            expect(Object.keys(result)).toHaveLength(0);
        });
        it('should get all global values', function () {
            var result = walletApi.storage.getOptions(true);
            expect(Object.keys(result)).toHaveLength(1);
            expect(result).toHaveProperty(globalOptions.key, globalOptions.value);
        });
    });
    describe('clear', function () {
        beforeAll(function () {
            walletApi.storage.set(localOptions.key, localOptions.value);
            walletApi.storage.set(globalOptions.key, globalOptions.value, true);
        });
        it('should clear all local values', function () {
            expect(walletApi.storage.get(localOptions.key)).toBe(localOptions.value);
            walletApi.storage.clear();
            expect(walletApi.storage.get(localOptions.key)).toBe(undefined);
        });
        it('should clear all global values', function () {
            expect(walletApi.storage.get(globalOptions.key, true)).toBe(globalOptions.value);
            walletApi.storage.clear(true);
            expect(walletApi.storage.get(globalOptions.key, true)).toBe(undefined);
        });
    });
});
//# sourceMappingURL=storage-sandbox.spec.js.map