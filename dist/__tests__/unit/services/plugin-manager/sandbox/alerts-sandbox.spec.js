import { create as createAlertsSandbox } from '@/services/plugin-manager/sandbox/alerts-sandbox';
var walletApi = {};
var app = {
    $error: jest.fn(),
    $info: jest.fn(),
    $success: jest.fn(),
    $warn: jest.fn()
};
var alertsSandbox = createAlertsSandbox(walletApi, app);
alertsSandbox();
describe('Alerts Sandbox', function () {
    it('should expose functions', function () {
        expect(walletApi.alert).toBeTruthy();
        expect(walletApi.alert.error).toBeTruthy();
        expect(walletApi.alert.info).toBeTruthy();
        expect(walletApi.alert.success).toBeTruthy();
        expect(walletApi.alert.warn).toBeTruthy();
    });
});
//# sourceMappingURL=alerts-sandbox.spec.js.map