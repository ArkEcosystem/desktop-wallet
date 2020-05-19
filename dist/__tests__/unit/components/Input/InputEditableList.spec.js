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
import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../__utils__/i18n';
import { InputEditableList } from '@/components/Input';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component, propsData) {
    component = component || InputEditableList;
    propsData = propsData || {
        value: []
    };
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        propsData: propsData
    });
};
describe('InputEditableList', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.contains('.InputEditableList')).toBe(true);
    });
    describe('title', function () {
        it('should show title', function () {
            createWrapper(null, {
                value: [],
                title: 'Test List'
            });
            expect(wrapper.find('.InputField__label').text()).toBe('Test List');
        });
        it('should show title including the item count', function () {
            createWrapper(null, {
                value: [
                    'test item 1',
                    'test item 2'
                ],
                title: 'Test List',
                showCount: true
            });
            expect(wrapper.find('.InputField__label').text()).toBe('Test List - 2');
        });
        it('should not show the item count if there are zero items', function () {
            createWrapper(null, {
                value: [],
                title: 'Test List',
                showCount: true
            });
            expect(wrapper.find('.InputField__label').text()).toBe('Test List');
        });
        it('should show title including the item count and maximum allowed count', function () {
            createWrapper(null, {
                value: [
                    'test item 1',
                    'test item 2'
                ],
                title: 'Test List',
                showCount: true,
                maxItems: 3
            });
            expect(wrapper.find('.InputField__label').text()).toBe('Test List - 2 / 3');
        });
    });
    it('should list each item', function () {
        createWrapper(null, {
            value: [
                'test item 1',
                'test item 2'
            ]
        });
        expect(wrapper.findAll('.InputEditableList__list__item').length).toBe(2);
    });
    it('should update items when property is updated', function () {
        createWrapper(null, {
            value: [
                'test item 1',
                'test item 2'
            ]
        });
        expect(wrapper.findAll('.InputEditableList__list__item').length).toBe(2);
        wrapper.setProps({
            value: [
                'test item 1',
                'test item 2',
                'test item 3',
                'test item 4'
            ]
        });
        expect(wrapper.findAll('.InputEditableList__list__item').length).toBe(4);
    });
    it('should show remove button if not readonly', function () {
        createWrapper(null, {
            value: [
                'test item 1',
                'test item 2'
            ],
            readonly: false
        });
        expect(wrapper.contains('.InputEditableList__list__item__remove')).toBe(true);
    });
    it('should not show remove button if readonly', function () {
        createWrapper(null, {
            value: [
                'test item 1',
                'test item 2'
            ],
            readonly: true
        });
        expect(wrapper.contains('.InputEditableList__list__item__remove')).toBe(false);
    });
    it('should trigger remove when clicking remove button', function () {
        createWrapper(null, {
            value: [
                'test item 1',
                'test item 2'
            ],
            readonly: false
        });
        wrapper.setMethods(__assign(__assign({}, wrapper.vm.methods), { emitRemove: jest.fn(wrapper.vm.emitRemove) }));
        wrapper.find('.InputEditableList__list__item__remove').trigger('click');
        expect(wrapper.vm.emitRemove).toHaveBeenCalled();
        expect(wrapper.emitted().remove).toBeTruthy();
    });
    it('should show as invalid if property is specified', function () {
        createWrapper(null, {
            value: [
                'test item 1',
                'test item 2'
            ],
            isInvalid: true
        });
        expect(wrapper.classes('InputEditableList--invalid')).toBe(true);
    });
    it('should show as invalid if required and no items', function () {
        createWrapper({
            template: "<div>\n        <InputEditableList :value=\"['test 1', 'test 2']\">\n          <div class=\"TestSlotItem\" slot-scope=\"{ item }\">\n            {{ item }}\n          </div>\n        </InputEditableList>\n      </div>",
            components: {
                InputEditableList: InputEditableList
            }
        }, {});
        var items = wrapper.findAll('.TestSlotItem');
        expect(items.length).toBe(2);
        for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
            var item = items.at(itemIndex);
            expect(item.text()).toEqual("test " + (itemIndex + 1));
        }
    });
    it('should output helper text', function () {
        var helperText = 'This is a test helper message';
        expect(wrapper.contains('.InputEditableList__helper-text')).toBe(false);
        createWrapper(null, {
            value: [],
            helperText: helperText
        });
        expect(wrapper.contains('.InputEditableList__helper-text')).toBe(true);
        expect(wrapper.find('.InputEditableList__helper-text').text()).toBe(helperText);
    });
    it('should output helper text', function () {
        var noItemsMessage = 'This is "no items" message';
        expect(wrapper.find('.InputEditableList__no-items').text()).toBe('INPUT_EDITABLE_LIST.NO_ITEMS');
        createWrapper(null, {
            value: [],
            noItemsMessage: noItemsMessage
        });
        expect(wrapper.find('.InputEditableList__no-items').text()).toBe(noItemsMessage);
    });
});
//# sourceMappingURL=InputEditableList.spec.js.map