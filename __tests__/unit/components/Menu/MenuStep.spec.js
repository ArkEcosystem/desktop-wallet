import { mount } from '@vue/test-utils'
import { MenuStep, MenuStepItem } from '@/components/Menu'

describe('MenuStep', () => {
  describe('Item', () => {
    const mountItem = propsData => {
      return mount(MenuStepItem, {
        propsData
      })
    }

    it('should render', () => {
      const wrapper = mountItem({
        title: 'Test',
        step: 1
      })

      expect(wrapper.contains('.MenuStepItem')).toBeTruthy()
      expect(wrapper.vm.$refs.collapse).toBeTruthy()
    })

    it('should trigger the handler', () => {
      const wrapper = mountItem({
        title: 'Test',
        step: 1
      })
      const handler = wrapper.find('.MenuStepItem__header')
      handler.trigger('click')
      expect(wrapper.emitted('open')).toBeTruthy()
    })

    it('should emit back event', async () => {
      const wrapper = mountItem({
        title: 'Test',
        step: 1
      })

      wrapper.vm.$refs.collapse.toggle()
      const back = wrapper.find('.MenuStepItem__footer__back-button')
      back.trigger('click')

      expect(wrapper.emitted('back')).toBeTruthy()
    })

    it('should emit next event', async () => {
      const wrapper = mountItem({
        title: 'Test',
        step: 1,
        isNextEnabled: true
      })

      wrapper.vm.$refs.collapse.toggle()
      const next = wrapper.find('.MenuStepItem__footer__next-button')
      next.trigger('click')

      expect(wrapper.emitted('next')).toBeTruthy()
    })
  })

  describe('Menu', () => {
    it('should render', () => {
      const wrapper = mount(MenuStep, {
        propsData: {
          step: 1
        },
        mocks: {
          collections_filterChilds: jest.fn()
        }
      })
      expect(wrapper.contains('.MenuStep')).toBeTruthy()
    })
  })
})
