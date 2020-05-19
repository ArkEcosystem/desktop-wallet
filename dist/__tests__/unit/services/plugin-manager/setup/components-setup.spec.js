import { createLocalVue, mount } from '@vue/test-utils';
import { create as createComponentsSetup } from '@/services/plugin-manager/setup/components-setup';
import { Plugin } from '@/services/plugin-manager/plugin';
jest.mock('fs', function () { return ({
    readFileSync: function () { return ({
        template: '<div>Test</div>'
    }); }
}); });
jest.mock('@/services/plugin-manager/component/compile-template.js', function () { return ({
    compileTemplate: jest.fn(function (vm, template) {
        var compileToFunctions = require('vue-template-compiler').compileToFunctions;
        return compileToFunctions(template);
    })
}); });
var localVue = createLocalVue();
var plugin = new Plugin({
    fullPath: './',
    config: {
        id: 1
    }
});
var pluginObject = {
    getComponentPaths: jest.fn(function () { return ({
        test: 'pages/index.js'
    }); })
};
var sandbox = {
    getComponentVM: jest.fn(function () { return ({
        run: jest.fn()
    }); }),
    getPluginVM: jest.fn(function () { return ({
        run: jest.fn()
    }); }),
    app: {}
};
var componentsSetup = createComponentsSetup(plugin, pluginObject, sandbox, localVue);
componentsSetup();
describe('Components Setup', function () {
    it('should call the getComponentPaths method', function () {
        expect(pluginObject.getComponentPaths).toHaveBeenCalled();
    });
    it('should populate the components field', function () {
        var componentNames = Object.keys(plugin.components);
        expect(componentNames.length).toBeGreaterThan(0);
        var wrapper = mount(plugin.components[componentNames[0]]);
        expect(wrapper.isVueInstance()).toBe(true);
    });
});
//# sourceMappingURL=components-setup.spec.js.map