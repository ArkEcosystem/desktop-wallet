import { create as createProfileCurrentSandbox } from '@/services/plugin-manager/sandbox/profile-current-sandbox';
var mockGetter = jest.fn(function () { return ({
    id: 1
}); });
var walletApi;
var app;
var profileCurrentSandbox;
describe('Profile Current Sandbox', function () {
    beforeEach(function () {
        walletApi = {};
        app = {
            $store: {
                getters: {
                    'profile/public': mockGetter
                }
            }
        };
        profileCurrentSandbox = createProfileCurrentSandbox(walletApi, app);
        profileCurrentSandbox();
    });
    it('should expose functions', function () {
        expect(walletApi.profiles).toBeTruthy();
        expect(walletApi.profiles.getCurrent).toBeTruthy();
    });
});
//# sourceMappingURL=profile-current-sandbox.spec.js.map