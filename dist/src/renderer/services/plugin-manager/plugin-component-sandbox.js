var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { createSafeComponent } from './component/create-component';
import { validateComponent } from './component/validate';
import { compileTemplate } from './component/compile-template';
var PluginComponentSandbox = /** @class */ (function () {
    function PluginComponentSandbox(_a) {
        var fullPath = _a.fullPath, name = _a.name, plugin = _a.plugin, source = _a.source, pluginVM = _a.pluginVM, componentVM = _a.componentVM, vue = _a.vue, logger = _a.logger;
        this.fullPath = fullPath;
        this.name = name;
        this.plugin = plugin;
        this.source = source;
        this.pluginVM = pluginVM;
        this.componentVM = componentVM;
        this.vue = vue;
        this.logger = logger;
        this.compiled = undefined;
        this.__compileSource();
    }
    Object.defineProperty(PluginComponentSandbox.prototype, "isFromFilesystem", {
        /**
         * Child components have already been loaded
         * by VM and their code is available.
         */
        get: function () {
            return Buffer.isBuffer(this.source);
        },
        enumerable: false,
        configurable: true
    });
    PluginComponentSandbox.prototype.cloneSandbox = function (_a) {
        var name = _a.name, source = _a.source;
        return new PluginComponentSandbox({
            source: source,
            name: name,
            fullPath: this.fullPath,
            plugin: this.plugin,
            pluginVM: this.pluginVM,
            componentVM: this.componentVM,
            vue: this.vue,
            logger: this.logger
        });
    };
    /**
     * The raw component is validated, parsed and generates
     * a secure component to be mounted by Vue.
     */
    PluginComponentSandbox.prototype.render = function () {
        if (!validateComponent(__assign(__assign({}, this), { component: this.compiled }))) {
            return;
        }
        var compiledTemplate = compileTemplate(this.pluginVM, this.compiled.template);
        var lazyComponent = Object.assign(compiledTemplate, this.compiled);
        delete lazyComponent.template;
        var components = this.plugin.globalComponents;
        for (var _i = 0, _a = Object.keys(this.compiled.components || {}); _i < _a.length; _i++) {
            var childName = _a[_i];
            var childSandbox = this.cloneSandbox({ name: childName, source: this.compiled.components[childName] });
            components[childName] = childSandbox.render();
        }
        lazyComponent.components = components;
        return createSafeComponent(this.name, lazyComponent, this.vue);
    };
    PluginComponentSandbox.prototype.__compileSource = function () {
        if (this.isFromFilesystem) {
            this.compiled = this.componentVM.run(this.source, this.fullPath);
        }
        else {
            this.compiled = this.source;
        }
    };
    return PluginComponentSandbox;
}());
export { PluginComponentSandbox };
//# sourceMappingURL=plugin-component-sandbox.js.map