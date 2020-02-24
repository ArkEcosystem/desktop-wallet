import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../__utils__/i18n'
import { InputEditableList } from '@/components/Input'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component, propsData) => {
  component = component || InputEditableList
  propsData = propsData || {
    value: []
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    propsData
  })
}

describe('InputEditableList', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.InputEditableList')).toBe(true)
  })

  describe('title', () => {
    it('should show title', () => {
      createWrapper(null, {
        value: [],
        title: 'Test List'
      })

      expect(wrapper.find('.InputField__label').text()).toBe('Test List')
    })

    it('should show title including the item count', () => {
      createWrapper(null, {
        value: [
          'test item 1',
          'test item 2'
        ],
        title: 'Test List',
        showCount: true
      })

      expect(wrapper.find('.InputField__label').text()).toBe('Test List - 2')
    })

    it('should not show the item count if there are zero items', () => {
      createWrapper(null, {
        value: [],
        title: 'Test List',
        showCount: true
      })

      expect(wrapper.find('.InputField__label').text()).toBe('Test List')
    })

    it('should show title including the item count and maximum allowed count', () => {
      createWrapper(null, {
        value: [
          'test item 1',
          'test item 2'
        ],
        title: 'Test List',
        showCount: true,
        maxItems: 3
      })

      expect(wrapper.find('.InputField__label').text()).toBe('Test List - 2 / 3')
    })
  })

  it('should list each item', () => {
    createWrapper(null, {
      value: [
        'test item 1',
        'test item 2'
      ]
    })

    expect(wrapper.findAll('.InputEditableList__list__item').length).toBe(2)
  })

  it('should update items when property is updated', () => {
    createWrapper(null, {
      value: [
        'test item 1',
        'test item 2'
      ]
    })

    expect(wrapper.findAll('.InputEditableList__list__item').length).toBe(2)

    wrapper.setProps({
      value: [
        'test item 1',
        'test item 2',
        'test item 3',
        'test item 4'
      ]
    })

    expect(wrapper.findAll('.InputEditableList__list__item').length).toBe(4)
  })

  it('should show remove button if not readonly', () => {
    createWrapper(null, {
      value: [
        'test item 1',
        'test item 2'
      ],
      readonly: false
    })

    expect(wrapper.contains('.InputEditableList__list__item__remove')).toBe(true)
  })

  it('should not show remove button if readonly', () => {
    createWrapper(null, {
      value: [
        'test item 1',
        'test item 2'
      ],
      readonly: true
    })

    expect(wrapper.contains('.InputEditableList__list__item__remove')).toBe(false)
  })

  it('should trigger remove when clicking remove button', () => {
    createWrapper(null, {
      value: [
        'test item 1',
        'test item 2'
      ],
      readonly: false
    })

    wrapper.setMethods({
      ...wrapper.vm.methods,
      emitRemove: jest.fn(wrapper.vm.emitRemove)
    })

    wrapper.find('.InputEditableList__list__item__remove').trigger('click')
    expect(wrapper.vm.emitRemove).toHaveBeenCalled()
    expect(wrapper.emitted().remove).toBeTruthy()
  })

  it('should show as invalid if property is specified', () => {
    createWrapper(null, {
      value: [
        'test item 1',
        'test item 2'
      ],
      isInvalid: true
    })

    expect(wrapper.classes('InputEditableList--invalid')).toBe(true)
  })

  it('should show as invalid if required and no items', () => {
    createWrapper({
      template: `<div>
        <InputEditableList :value="['test 1', 'test 2']">
          <div class="TestSlotItem" slot-scope="{ item }">
            {{ item }}
          </div>
        </InputEditableList>
      </div>`,

      components: {
        InputEditableList
      }
    }, {})

    const items = wrapper.findAll('.TestSlotItem')

    expect(items.length).toBe(2)

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items.at(itemIndex)

      expect(item.text()).toEqual(`test ${itemIndex + 1}`)
    }
  })

  it('should output helper text', () => {
    const helperText = 'This is a test helper message'
    expect(wrapper.contains('.InputEditableList__helper-text')).toBe(false)

    createWrapper(null, {
      value: [],
      helperText
    })

    expect(wrapper.contains('.InputEditableList__helper-text')).toBe(true)
    expect(wrapper.find('.InputEditableList__helper-text').text()).toBe(helperText)
  })

  it('should output helper text', () => {
    const noItemsMessage = 'This is "no items" message'
    expect(wrapper.find('.InputEditableList__no-items').text()).toBe('INPUT_EDITABLE_LIST.NO_ITEMS')

    createWrapper(null, {
      value: [],
      noItemsMessage
    })

    expect(wrapper.find('.InputEditableList__no-items').text()).toBe(noItemsMessage)
  })
})
