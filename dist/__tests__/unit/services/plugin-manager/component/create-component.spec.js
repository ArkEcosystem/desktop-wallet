var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import { createLocalVue, mount } from '@vue/test-utils';
import { createSafeComponent } from '@/services/plugin-manager/component/create-component';
var localVue = createLocalVue();
var wrapperPlugin = function (plugin) {
    return createSafeComponent('test', plugin, localVue);
};
describe('Create Component', function () {
    it('should return a valid component', function () {
        var plugin = {
            template: '<div>Test</div>'
        };
        var component = wrapperPlugin(plugin);
        var wrapper = mount(component);
        expect(wrapper.isVueInstance()).toBe(true);
    });
    describe('Props', function () {
        it('should mount with props', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                props: {
                    name: {
                        type: String
                    }
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component, {
                propsData: {
                    name: 'Test'
                }
            });
            expect(wrapper.html()).toBe('<div>Test</div>');
        });
        it('should sync changes', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                props: {
                    name: {
                        type: String
                    }
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component, {
                propsData: {
                    name: 'Test'
                }
            });
            expect(wrapper.html()).toBe('<div>Test</div>');
            wrapper.setProps({ name: 'Jest' });
            expect(wrapper.html()).toBe('<div>Jest</div>');
        });
    });
    describe('Data', function () {
        it('should mount with data', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                data: function () { return ({
                    name: 'Test'
                }); }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            expect(wrapper.html()).toBe('<div>Test</div>');
        });
        it('should not access the parent element', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                data: function () { return ({
                    name: _this && _this.$parent && _this.$parent._uid
                }); }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            expect(wrapper.vm.name).toBeUndefined();
        });
    });
    describe('Computed', function () {
        it('should mount with computed data', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                computed: {
                    name: function () {
                        return 'Test';
                    }
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            expect(wrapper.html()).toBe('<div>Test</div>');
        });
        it('should not access parent element', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                computed: {
                    name: function () {
                        return this.$parent;
                    }
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            expect(wrapper.vm.name).toBeUndefined();
        });
    });
    describe('Methods', function () {
        it('should mount with methods', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                data: function () { return ({
                    name: 'Test'
                }); },
                methods: {
                    change: function () {
                        this.name = 'Jest';
                    }
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            wrapper.vm.change();
            expect(wrapper.vm.name).toBe('Jest');
        });
        it('should not access restricted properties', function () {
            var plugin = {
                template: '<div></div>',
                data: function () { return ({
                    parent: undefined,
                    root: undefined
                }); },
                methods: {
                    change: function () {
                        this.parent = this.$parent;
                        this.root = this.$root;
                    }
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            wrapper.vm.change();
            expect(wrapper.vm.parent).toBe(undefined);
            expect(wrapper.vm.root).toBe(undefined);
        });
        it('should not access restricted properties from events', function () {
            var plugin = {
                template: '<button ref="btn" @click="change">Test</button>',
                data: function () { return ({
                    parent: undefined,
                    root: undefined
                }); },
                methods: {
                    change: function () {
                        this.parent = this.$parent;
                        this.root = this.$root;
                    }
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            var btn = wrapper.find({ ref: 'btn' });
            btn.trigger('click');
            expect(wrapper.vm.parent).toBe(undefined);
            expect(wrapper.vm.root).toBe(undefined);
        });
        it('should call methods from elements', function () {
            var plugin = {
                template: '<button ref="btn" @click="change">{{ name }}</button>',
                data: function () { return ({
                    name: 'Test'
                }); },
                methods: {
                    change: function () {
                        this.name = 'Jest';
                    }
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            var btn = wrapper.find({ ref: 'btn' });
            btn.trigger('click');
            expect(wrapper.vm.name).toBe('Jest');
        });
        it('should call methods from elements with params', function () {
            var plugin = {
                template: '<button ref="btn" @click="change(customName)">{{ name }}</button>',
                data: function () { return ({
                    name: 'Test',
                    customName: 'Jest'
                }); },
                methods: {
                    change: function (name) {
                        this.name = name;
                    }
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            var btn = wrapper.find({ ref: 'btn' });
            btn.trigger('click');
            expect(wrapper.vm.name).toBe('Jest');
        });
    });
    describe('Created', function () {
        it('should mount with created hook', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                data: function () { return ({
                    name: 'Test'
                }); },
                created: function () {
                    this.name = 'Jest';
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            expect(wrapper.vm.name).toBe('Jest');
        });
        it('should not access the parent element', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                data: function () { return ({
                    name: 'Test',
                    uid: undefined
                }); },
                created: function () {
                    this.uid = this.$parent && this.$parent._uid;
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            expect(wrapper.vm.uid).toBeUndefined();
        });
    });
    describe('Mounted', function () {
        it('should mount with mounted hook', function () {
            var plugin = {
                template: '<div>{{ name }}</div>',
                data: function () { return ({
                    name: 'Test'
                }); },
                mounted: function () {
                    this.name = 'Jest';
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            expect(wrapper.vm.name).toBe('Jest');
        });
        it('should access refs', function (done) {
            var plugin = {
                template: '<div ref="test" id="t1">{{ name }}</div>',
                data: function () { return ({
                    name: 'Test',
                    id: undefined
                }); },
                mounted: function () {
                    var _this = this;
                    this.$nextTick(function () {
                        _this.id = _this.refs.test.id;
                    });
                }
            };
            var component = wrapperPlugin(plugin);
            var wrapper = mount(component);
            localVue.nextTick(function () {
                expect(wrapper.vm.id).toBe('t1');
                done();
            });
        });
        it('should not set custom properties', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, plugin, component, wrapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(console, 'error').mockImplementation();
                        plugin = {
                            template: '<div ref="test">{{ name }}</div>',
                            data: function () { return ({
                                name: 'Test'
                            }); },
                            mounted: function () {
                                var _this = this;
                                this.$nextTick(function () {
                                    _this.refs.test.href = 'Jest';
                                    _this.refs.test.innerHTML = 'Jest';
                                    _this.refs.test.outerHTML = 'Jest';
                                    _this.refs.test.appendChild(document.createElement('p'));
                                    _this.refs.test.cloneNode();
                                    _this.refs.test.getRootNode();
                                    _this.refs.test.insertBefore();
                                    _this.refs.test.normalize();
                                    _this.refs.test.querySelector();
                                    _this.refs.test.querySelectorAll();
                                    _this.refs.test.removeChild();
                                    _this.refs.test.replaceChild();
                                });
                            }
                        };
                        component = wrapperPlugin(plugin);
                        wrapper = mount(component);
                        expect(wrapper.html()).toBe('<div>Test</div>');
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledWith('href 🚫');
                        expect(spy).toHaveBeenCalledWith('innerHTML 🚫');
                        expect(spy).toHaveBeenCalledWith('outerHTML 🚫');
                        expect(spy).toHaveBeenCalledWith('appendChild 🚫');
                        expect(spy).toHaveBeenCalledWith('cloneNode 🚫');
                        expect(spy).toHaveBeenCalledWith('getRootNode 🚫');
                        expect(spy).toHaveBeenCalledWith('insertBefore 🚫');
                        expect(spy).toHaveBeenCalledWith('normalize 🚫');
                        expect(spy).toHaveBeenCalledWith('querySelector 🚫');
                        expect(spy).toHaveBeenCalledWith('querySelectorAll 🚫');
                        expect(spy).toHaveBeenCalledWith('removeChild 🚫');
                        expect(spy).toHaveBeenCalledWith('replaceChild 🚫');
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should only allow href change via template variable', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, plugin, component, wrapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(console, 'error').mockImplementation();
                        plugin = {
                            template: "<div>\n          <a ref=\"normalLink\" href=\"testHref\">test link</a>\n          <a ref=\"variableLink\" :href=\"testHref\">test link</a>\n        </div>",
                            data: function () { return ({
                                testHref: 'testHref'
                            }); },
                            mounted: function () {
                                var _this = this;
                                this.$nextTick(function () {
                                    _this.refs.normalLink.href = 'Failed';
                                    _this.testHref = 'Success';
                                });
                            },
                            methods: {
                                updateHref: function () {
                                    this.refs.variableLink.href = 'Failed';
                                }
                            }
                        };
                        component = wrapperPlugin(plugin);
                        wrapper = mount(component);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.find({ ref: 'normalLink' }).element.href).toBe(undefined);
                        expect(wrapper.find({ ref: 'variableLink' }).element.href).toBe('http://localhost/Success');
                        wrapper.vm.updateHref();
                        expect(wrapper.find({ ref: 'variableLink' }).element.href).toBe(undefined);
                        expect(spy).toHaveBeenCalledWith('href 🚫');
                        expect(spy).toHaveBeenCalledTimes(2);
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=create-component.spec.js.map