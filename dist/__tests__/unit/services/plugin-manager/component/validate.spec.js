import { validateComponent } from '@/services/plugin-manager/component/validate';
describe('Validate component', function () {
    var plugin = {
        config: {
            id: 1
        }
    };
    it('should have template field', function () {
        expect(validateComponent({ plugin: plugin, component: {} })).toBe(false);
        expect(validateComponent({ plugin: plugin, component: { template: '' } })).toBe(true);
    });
    it('should not have unauthorized fields', function () {
        var component = {
            render: function () { }
        };
        expect(validateComponent({ plugin: plugin, component: component })).toBe(false);
    });
    it('should not have v-html', function () {
        var component = {
            template: '<div v-html=""></div>'
        };
        expect(validateComponent({ plugin: plugin, component: component })).toBe(false);
    });
    it('should not have javascript inline script', function () {
        var component = {
            template: '<form action="javascript:alert()"></form>'
        };
        expect(validateComponent({ plugin: plugin, component: component })).toBe(false);
    });
    it('should not have iframe tag', function () {
        var component = {
            template: '<iframe src="ark.io"></iframe>'
        };
        expect(validateComponent({ plugin: plugin, component: component })).toBe(false);
    });
    it('should not have webview tag', function () {
        var component = {
            template: '<webview src="ark.io"></webview>'
        };
        expect(validateComponent({ plugin: plugin, component: component })).toBe(false);
    });
    it('should not have script tag', function () {
        var component = {
            template: '<script type="text/javascript">alert()</script>'
        };
        expect(validateComponent({ plugin: plugin, component: component })).toBe(false);
    });
    it('should not have eval', function () {
        var component = {
            template: '<input name="eval()" />'
        };
        expect(validateComponent({ plugin: plugin, component: component })).toBe(false);
    });
    it('should not have inline events', function () {
        expect(validateComponent({ plugin: plugin, component: { template: '<input onchange="alert()" />' } })).toBe(false);
        expect(validateComponent({ plugin: plugin, component: { template: '<input onclick="alert()" />' } })).toBe(false);
        expect(validateComponent({ plugin: plugin, component: { template: '<input onfocus="alert()" />' } })).toBe(false);
    });
});
//# sourceMappingURL=validate.spec.js.map