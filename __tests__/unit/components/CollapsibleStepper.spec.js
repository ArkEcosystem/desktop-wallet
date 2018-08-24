import { mount } from '@vue/test-utils'
import { CollapsibleStepper, CollapsibleStepperItem } from '@/components/CollapsibleStepper'

describe('CollapsibleStepper', () => {
  describe('Item', () => {
    it('should render', () => {
      const wrapper = mount(CollapsibleStepperItem, {
        propsData: {
          title: 'Test',
          step: 1
        }
      })
      expect(wrapper.contains('.CollapsibleStepperItem')).toBeTruthy()
    })

    it('should toggle visibility', () => {
      const wrapper = mount(CollapsibleStepperItem, {
        propsData: {
          title: 'Test',
          step: 1
        }
      })
      wrapper.vm.toggle(1)
      expect(wrapper.vm.isActive).toBe(true)
    })

    it('should emit back event', async () => {
      const wrapper = mount(CollapsibleStepperItem, {
        propsData: {
          title: 'Test',
          step: 1
        }
      })
      wrapper.vm.toggle(1)
      const back = wrapper.find('.CollapsibleStepperItem__footer__back-button')
      back.trigger('click')
      expect(wrapper.emitted('back')).toBeTruthy()
    })

    it('should emit next event', async () => {
      const wrapper = mount(CollapsibleStepperItem, {
        propsData: {
          title: 'Test',
          step: 1,
          isNextEnabled: true
        }
      })
      wrapper.vm.toggle(1)
      const next = wrapper.find('.CollapsibleStepperItem__footer__next-button')
      next.trigger('click')
      expect(wrapper.emitted('next')).toBeTruthy()
    })
  })

  describe('Root', () => {
    it('should render', () => {
      const wrapper = mount(CollapsibleStepper)
      expect(wrapper.contains('.CollapsibleStepper')).toBeTruthy()
    })
  })
})
