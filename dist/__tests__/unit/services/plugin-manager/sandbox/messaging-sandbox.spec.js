import { create as createMessagingSandbox } from '@/services/plugin-manager/sandbox/messaging-sandbox';
var walletApi;
var app;
beforeEach(function () {
    walletApi = {};
    app = {
        $router: {
            beforeEach: jest.fn()
        }
    };
    var messagingSandbox = createMessagingSandbox(walletApi, app);
    messagingSandbox();
});
describe('Messaging Sandbox', function () {
    it('should expose functions', function () {
        expect(walletApi.messages).toBeTruthy();
        expect(walletApi.messages.on).toBeTruthy();
        expect(walletApi.messages.clear).toBeTruthy();
    });
    it('should define the router hook', function () {
        expect(app.$router.beforeEach).toHaveBeenCalled();
    });
    it('should register listeners', function () {
        walletApi.messages.on('transaction', function () { return 'test'; });
        expect(Object.keys(walletApi.messages.events)).toHaveLength(1);
    });
    it('should clear listeners', function () {
        walletApi.messages.on('transaction', function () { return 'test'; });
        expect(Object.keys(walletApi.messages.events)).toHaveLength(1);
        walletApi.messages.clear();
        expect(Object.keys(walletApi.messages.events)).toHaveLength(0);
    });
});
//# sourceMappingURL=messaging-sandbox.spec.js.map