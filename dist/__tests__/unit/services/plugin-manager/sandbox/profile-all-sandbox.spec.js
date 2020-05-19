import { create as createProfileAllSandbox } from '@/services/plugin-manager/sandbox/profile-all-sandbox';
var mockGetter = jest.fn(function () { return [
    {
        id: 1
    }
]; });
var walletApi;
var app;
var profileAllSandbox;
describe('Profile All Sandbox', function () {
    beforeEach(function () {
        walletApi = {};
        app = {
            $store: {
                getters: {
                    'profile/public': mockGetter
                }
            }
        };
        profileAllSandbox = createProfileAllSandbox(walletApi, app);
        profileAllSandbox();
    });
    it('should expose functions', function () {
        expect(mockGetter).toHaveBeenCalled();
        expect(walletApi.profiles.all).toBeTruthy();
        expect(walletApi.profiles.all).toHaveLength(1);
    });
});
//# sourceMappingURL=profile-all-sandbox.spec.js.map