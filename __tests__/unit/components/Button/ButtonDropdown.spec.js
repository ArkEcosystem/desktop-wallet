import { mount } from '@vue/test-utils'
import { ButtonDropdown } from '@/components/Button'

const stubs = {
  Portal: '<div><slot/></div>'
}

let wrapper
const createWrapper = (component, propsData) => {
  component = component || ButtonDropdown
  propsData = propsData || {
    title: 'Test',
    items: [
      'Test 1',
      'Test 2'
    ]
  }

  wrapper = mount(component, {
    stubs,
    propsData
  })
}

describe('ButtonDropdown', () => {
  beforeEach(() => {
    createWrapper()

    Element.prototype.__defineGetter__('clientHeight', () => 10)
    Element.prototype.getBoundingClientRect = () => ({
      top: 10,
      left: 15
    })
  })

  it('should render with dropdown', () => {
    expect(wrapper.contains('.ButtonDropdown')).toBeTruthy()
    expect(wrapper.contains('.ButtonDropdown__button')).toBeTruthy()
    expect(wrapper.contains('.ButtonDropdown__list')).toBeTruthy()
  })

  it('should have a primary button', () => {
    createWrapper({
      template: `<div>
        <ButtonDropdown ref="testButton" :items="[]">
          <div slot="primaryButton">
            test
          </div>
        </ButtonDropdown>
      </div>`,

      components: {
        ButtonDropdown
      }
    }, {})

    const buttonDropdown = wrapper.find({ ref: 'testButton' })

    expect(buttonDropdown.contains('.ButtonDropdown__primary')).toBeTruthy()
    expect(buttonDropdown.vm.hasPrimaryButton).toEqual(true)
  })

  it('should have a dropdown button per item', () => {
    expect(wrapper.findAll('.ButtonDropdown__list__item').length).toBe(2)
  })

  it('should show the dropdown on click', () => {
    wrapper.setMethods({
      ...wrapper.vm.methods,
      toggleDropdown: jest.fn(wrapper.vm.toggleDropdown)
    })
    wrapper.find('.ButtonDropdown__button').trigger('click')

    expect(wrapper.vm.showDropdown).toBe(true)
    expect(wrapper.vm.toggleDropdown).toHaveBeenCalled()
  })

  it('should toggle dropdown programmatically', () => {
    wrapper.vm.toggleDropdown()

    expect(wrapper.vm.showDropdown).toBe(true)

    wrapper.vm.toggleDropdown()

    expect(wrapper.vm.showDropdown).toBe(false)
  })

  it('should close dropdown on item click', () => {
    wrapper.setMethods({
      ...wrapper.vm.methods,
      triggerClose: jest.fn(wrapper.vm.triggerClose)
    })
    wrapper.vm.showDropdown = true

    wrapper.find('.ButtonDropdown__list__item .ButtonGeneric').trigger('click')

    expect(wrapper.vm.showDropdown).toBe(false)
    expect(wrapper.vm.triggerClose).toHaveBeenCalled()
  })

  it('should close dropdown programmatically', () => {
    wrapper.vm.showDropdown = true
    wrapper.vm.triggerClose()

    expect(wrapper.vm.showDropdown).toBe(false)
  })

  it('should popluate classes onto dropdown', () => {
    createWrapper(ButtonDropdown, {
      title: 'Test',
      items: [
        'Test 1',
        'Test 2'
      ],
      classes: 'test-class-1 test-class-2'
    })

    expect(wrapper.find('.ButtonDropdown__button').classes('test-class-1')).toBe(true)
    expect(wrapper.find('.ButtonDropdown__button').classes('test-class-2')).toBe(true)
    expect(wrapper.vm.dropdownButtonClasses).toEqual({ 'ButtonDropdown__button--nolabel': false, 'test-class-1': true, 'test-class-2': true })
  })

  it('should change arrow viewbox if dropdown is open', () => {
    expect(wrapper.vm.arrowViewbox).toBe('0 -2 12 16')

    wrapper.vm.showDropdown = true

    expect(wrapper.vm.arrowViewbox).toBe('0 2 12 16')
  })

  it('should generate dropdown style', () => {
    // Create sub-component which correctly populates $refs for ButtonDropdown
    createWrapper({
      template: `<div>
        <ButtonDropdown ref="testButton" :items="[]" />
      </div>`,

      components: {
        ButtonDropdown
      }
    }, {})

    expect(wrapper.find({ ref: 'testButton' }).vm.dropdownStyle).toBe('top: 20px;left: 15px;z-index: 10')
  })
})
