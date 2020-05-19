import { create as createDialogsSandbox } from '@/services/plugin-manager/sandbox/dialogs-sandbox';
var walletApi = {};
var dialogsSandbox = createDialogsSandbox(walletApi);
dialogsSandbox();
describe('Dialogs Sandbox', function () {
    it('should expose functions', function () {
        expect(walletApi.dialogs).toBeTruthy();
        expect(walletApi.dialogs.save).toBeTruthy();
        expect(walletApi.dialogs.open).toBeTruthy();
    });
});
//# sourceMappingURL=dialogs-sandbox.spec.js.map