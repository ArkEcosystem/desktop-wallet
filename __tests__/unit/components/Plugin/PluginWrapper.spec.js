import { createLocalVue, mount } from '@vue/test-utils'
import PluginWrapper from '@/components/Plugin/PluginWrapper'
import { Wormhole } from 'portal-vue'

const vue = createLocalVue()

jest.mock('portal-vue', () => ({
  Wormhole: {
    open: jest.fn(),
    close: jest.fn()
  }
}))

describe('PluginWrapper', () => {
  const mountComponent = config => {
    return mount(PluginWrapper, config)
  }

  describe('when there is a footer slot', () => {
    it('should open a Wormhole when mounted', done => {
      const spy = jest.spyOn(Wormhole, 'open')

      const wrapper = mountComponent({
        slots: {
          footer: '<div></div>'
        }
      })

      vue.nextTick(() => {
        expect(spy).toHaveBeenCalledWith({
          to: 'plugin-footer',
          from: 'plugin-wrapper',
          passengers: wrapper.vm.footerSlot
        })
        done()
      })

      spy.mockRestore()
    })

    it('should close a Wormhole when destroyed', done => {
      const spy = jest.spyOn(Wormhole, 'close')

      mountComponent({
        slots: {
          footer: '<div></div>'
        }
      }).destroy()

      vue.nextTick(() => {
        expect(spy).toHaveBeenCalledWith({
          to: 'plugin-footer',
          from: 'plugin-wrapper'
        })
        done()
      })

      spy.mockRestore()
    })
  })

  describe('when there is no footer slot', () => {
    it('should not open a Wormhole when mounted', done => {
      const spy = jest.spyOn(Wormhole, 'open')

      mountComponent()

      vue.nextTick(() => {
        expect(spy).not.toHaveBeenCalled()
        done()
      })

      spy.mockRestore()
    })

    it('should not close a Wormhole when destroyed', done => {
      const spy = jest.spyOn(Wormhole, 'close')

      mountComponent().destroy()

      vue.nextTick(() => {
        expect(spy).not.toHaveBeenCalled()
        done()
      })

      spy.mockRestore()
    })
  })
})
