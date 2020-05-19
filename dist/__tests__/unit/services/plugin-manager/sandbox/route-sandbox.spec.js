import { create as createRouteSandbox } from '@/services/plugin-manager/sandbox/route-sandbox';
var walletApi = {};
var routeSandbox = createRouteSandbox(walletApi, {}, {});
routeSandbox();
describe('Route Sandbox', function () {
    it('should expose functions', function () {
        expect(walletApi.route).toBeTruthy();
        expect(walletApi.route.get).toBeTruthy();
        expect(walletApi.route.goTo).toBeTruthy();
    });
});
//# sourceMappingURL=route-sandbox.spec.js.map