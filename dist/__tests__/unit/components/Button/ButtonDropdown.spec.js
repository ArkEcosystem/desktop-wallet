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
import { mount } from '@vue/test-utils';
import { ButtonDropdown } from '@/components/Button';
var stubs = {
    Portal: '<div><slot/></div>'
};
var wrapper;
var createWrapper = function (component, propsData) {
    component = component || ButtonDropdown;
    propsData = propsData || {
        title: 'Test',
        items: [
            'Test 1',
            'Test 2'
        ]
    };
    wrapper = mount(component, {
        stubs: stubs,
        propsData: propsData
    });
};
describe('ButtonDropdown', function () {
    beforeEach(function () {
        createWrapper();
        Element.prototype.__defineGetter__('clientHeight', function () { return 10; });
        Element.prototype.getBoundingClientRect = function () { return ({
            top: 10,
            left: 15
        }); };
    });
    it('should render with dropdown', function () {
        expect(wrapper.contains('.ButtonDropdown')).toBeTruthy();
        expect(wrapper.contains('.ButtonDropdown__button')).toBeTruthy();
        expect(wrapper.contains('.ButtonDropdown__list')).toBeTruthy();
    });
    it('should have a primary button', function () {
        createWrapper({
            template: "<div>\n        <ButtonDropdown ref=\"testButton\" :items=\"[]\">\n          <div slot=\"primaryButton\">\n            test\n          </div>\n        </ButtonDropdown>\n      </div>",
            components: {
                ButtonDropdown: ButtonDropdown
            }
        }, {});
        var buttonDropdown = wrapper.find({ ref: 'testButton' });
        expect(buttonDropdown.contains('.ButtonDropdown__primary')).toBeTruthy();
        expect(buttonDropdown.vm.hasPrimaryButton).toEqual(true);
    });
    it('should have a dropdown button per item', function () {
        expect(wrapper.findAll('.ButtonDropdown__list__item').length).toBe(2);
    });
    it('should show the dropdown on click', function () {
        wrapper.setMethods(__assign(__assign({}, wrapper.vm.methods), { toggleDropdown: jest.fn(wrapper.vm.toggleDropdown) }));
        wrapper.find('.ButtonDropdown__button').trigger('click');
        expect(wrapper.vm.showDropdown).toBe(true);
        expect(wrapper.vm.toggleDropdown).toHaveBeenCalled();
    });
    it('should toggle dropdown programmatically', function () {
        wrapper.vm.toggleDropdown();
        expect(wrapper.vm.showDropdown).toBe(true);
        wrapper.vm.toggleDropdown();
        expect(wrapper.vm.showDropdown).toBe(false);
    });
    it('should close dropdown on item click', function () {
        wrapper.setMethods(__assign(__assign({}, wrapper.vm.methods), { triggerClose: jest.fn(wrapper.vm.triggerClose) }));
        wrapper.vm.showDropdown = true;
        wrapper.find('.ButtonDropdown__list__item .ButtonGeneric').trigger('click');
        expect(wrapper.vm.showDropdown).toBe(false);
        expect(wrapper.vm.triggerClose).toHaveBeenCalled();
    });
    it('should close dropdown programmatically', function () {
        wrapper.vm.showDropdown = true;
        wrapper.vm.triggerClose();
        expect(wrapper.vm.showDropdown).toBe(false);
    });
    it('should popluate classes onto dropdown', function () {
        createWrapper(ButtonDropdown, {
            title: 'Test',
            items: [
                'Test 1',
                'Test 2'
            ],
            classes: 'test-class-1 test-class-2'
        });
        expect(wrapper.find('.ButtonDropdown__button').classes('test-class-1')).toBe(true);
        expect(wrapper.find('.ButtonDropdown__button').classes('test-class-2')).toBe(true);
        expect(wrapper.vm.dropdownButtonClasses).toEqual({ 'ButtonDropdown__button--nolabel': false, 'test-class-1': true, 'test-class-2': true });
    });
    it('should change arrow viewbox if dropdown is open', function () {
        expect(wrapper.vm.arrowViewbox).toBe('0 -2 12 16');
        wrapper.vm.showDropdown = true;
        expect(wrapper.vm.arrowViewbox).toBe('0 2 12 16');
    });
    it('should generate dropdown style', function () {
        // Create sub-component which correctly populates $refs for ButtonDropdown
        createWrapper({
            template: "<div>\n        <ButtonDropdown ref=\"testButton\" :items=\"[]\" />\n      </div>",
            components: {
                ButtonDropdown: ButtonDropdown
            }
        }, {});
        expect(wrapper.find({ ref: 'testButton' }).vm.dropdownStyle).toBe('top: 20px;left: 15px;z-index: 10');
    });
});
//# sourceMappingURL=ButtonDropdown.spec.js.map