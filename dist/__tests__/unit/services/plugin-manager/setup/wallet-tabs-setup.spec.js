import { create as createWalletTabsSetup } from '@/services/plugin-manager/setup/wallet-tabs-setup';
import { Plugin } from '@/services/plugin-manager/plugin';
var plugin = new Plugin({
    config: {
        id: 1
    }
});
plugin.components = {
    test: {}
};
var pluginObject = {
    getWalletTabs: jest.fn(function () { return [
        {
            tabTitle: 'Test',
            componentName: 'test'
        }
    ]; })
};
var sandbox = {
    app: {
        $store: {
            dispatch: jest.fn()
        }
    }
};
var profileId = 'profile1';
var walletTabsSetup = createWalletTabsSetup(plugin, pluginObject, sandbox, profileId);
walletTabsSetup();
describe('Wallet Tabs Setup', function () {
    it('should call the getWalletTabs method', function () {
        expect(pluginObject.getWalletTabs).toHaveBeenCalled();
    });
    it('should dispatch to vuex', function () {
        expect(sandbox.app.$store.dispatch).toHaveBeenCalled();
    });
});
//# sourceMappingURL=wallet-tabs-setup.spec.js.map