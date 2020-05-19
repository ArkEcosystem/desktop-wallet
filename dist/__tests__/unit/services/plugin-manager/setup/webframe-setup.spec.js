import { Plugin } from '@/services/plugin-manager/plugin';
import { create as createWebFrameSetup } from '@/services/plugin-manager/setup/webframe-setup';
var plugin = new Plugin({
    config: {
        id: 1
    }
});
var webFrameSetup = createWebFrameSetup(plugin);
webFrameSetup();
describe('Webframe Setup', function () {
    it('should populate the globalComponents field', function () {
        expect(Object.keys(plugin.globalComponents)).toHaveLength(1);
    });
});
//# sourceMappingURL=webframe-setup.spec.js.map