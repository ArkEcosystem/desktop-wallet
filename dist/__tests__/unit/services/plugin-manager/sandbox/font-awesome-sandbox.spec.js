import { create as createFontAwesomeSandbox } from '@/services/plugin-manager/sandbox/font-awesome-sandbox';
var walletApi = {};
var fontAwesomeSandbox = createFontAwesomeSandbox(walletApi);
fontAwesomeSandbox();
describe('Font Awesome Sandbox', function () {
    it('should expose functions', function () {
        expect(walletApi.fontAwesomeIcons).toBeTruthy();
    });
});
//# sourceMappingURL=font-awesome-sandbox.spec.js.map