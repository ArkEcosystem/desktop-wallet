import { mount, shallowMount } from '@vue/test-utils'
import { Collapse, CollapseAccordion } from '@/components/Collapse'

describe('Collapse', () => {
  it('should render collapse', () => {
    const wrapper = mount(Collapse)
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should render with default slot', () => {
    const slot = 'My Collapsible content'
    const wrapper = mount(Collapse, {
      propsData: {
        isOpen: true
      },
      slots: {
        default: slot
      }
    })
    expect(wrapper.find('.Collapse__content').isVisible())
  })

  it('should render with handler slot', () => {
    const handler = 'My Collapsible handler'
    const content = 'My Collapsible content'
    const wrapper = mount(Collapse, {
      slots: {
        handler,
        default: content
      }
    })
    const button = wrapper.find('.Collapse__handler')
    button.trigger('click')
    expect(wrapper.find('.Collapse__content').isVisible())
  })

  it('should emit close/open event', () => {
    const wrapper = mount(Collapse)
    wrapper.vm.toggle()
    expect(wrapper.emitted('open')).toBeTruthy()
    wrapper.vm.toggle()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should disable handler', () => {
    const wrapper = mount(Collapse, {
      propsData: {
        isDisabled: true
      }
    })
    wrapper.vm.toggle()
    expect(wrapper.emitted('open')).toBeFalsy()
  })

  it('should render accordion', () => {
    const wrapper = shallowMount(CollapseAccordion, {
      propsData: {
        items: []
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
