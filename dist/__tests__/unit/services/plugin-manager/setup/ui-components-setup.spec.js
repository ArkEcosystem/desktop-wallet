import { Plugin } from '@/services/plugin-manager/plugin';
import { create as createUiComponentsSetup } from '@/services/plugin-manager/setup/ui-components-setup';
var plugin = new Plugin({
    config: {
        id: 1
    }
});
var uiComponentsSetup = createUiComponentsSetup(plugin);
uiComponentsSetup();
describe('UI Components Setup', function () {
    it('should populate the globalComponents field', function () {
        expect(Object.keys(plugin.globalComponents).length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=ui-components-setup.spec.js.map