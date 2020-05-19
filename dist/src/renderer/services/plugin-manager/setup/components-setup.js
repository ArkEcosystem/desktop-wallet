import fs from 'fs';
import path from 'path';
import { PluginComponentSandbox } from '../plugin-component-sandbox';
export function create(plugin, pluginObject, sandbox, vue) {
    return function () {
        if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getComponentPaths')) {
            return;
        }
        var pluginComponents = pluginObject.getComponentPaths();
        var components = {};
        for (var _i = 0, _a = Object.keys(pluginComponents); _i < _a.length; _i++) {
            var componentName = _a[_i];
            var fullPath = path.join(plugin.fullPath, 'src', pluginComponents[componentName]);
            var source = fs.readFileSync(fullPath);
            if (source) {
                var component = new PluginComponentSandbox({
                    source: source,
                    plugin: plugin,
                    vue: vue,
                    fullPath: fullPath,
                    name: componentName,
                    pluginVM: sandbox.getPluginVM(),
                    componentVM: sandbox.getComponentVM(),
                    logger: sandbox.app.$logger
                });
                var vmComponent = component.render();
                if (vmComponent) {
                    components[componentName] = vmComponent;
                }
            }
        }
        plugin.components = components;
    };
}
//# sourceMappingURL=components-setup.js.map