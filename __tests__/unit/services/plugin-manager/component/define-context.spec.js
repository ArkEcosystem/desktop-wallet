import { createLocalVue, mount } from '@vue/test-utils'
import { defineContext } from '@/services/plugin-manager/component/define-context'

const localVue = createLocalVue()

describe('Define Context', () => {
  it('should return a valid component', () => {
    const plugin = {
      template: '<div>Test</div>'
    }

    const component = createSafeComponent(plugin)
    const wrapper = mount(component)
    expect(wrapper.isVueInstance()).toBe(true)
  })

  it('should work with props', () => {
    const plugin = {
      template: '<div>{{ name }}</div>',
      props: {
        name: {
          type: String
        }
      }
    }
    const component = createSafeComponent(plugin)
    const wrapper = mount(component, {
      propsData: {
        name: 'Test'
      }
    })
    expect(wrapper.isVueInstance()).toBe(true)
    expect(wrapper.html()).toBe('<div>Test</div>')
  })

  describe('Data', () => {
    it('should mount with data', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        data: () => ({
          name: 'Test'
        })
      }
      const component = createSafeComponent(plugin)
      const wrapper = mount(component)
      expect(wrapper.html()).toBe('<div>Test</div>')
    })

    it('should not access the parent element', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        data: () => ({
          name: this && this.$parent && this.$parent._uid
        })
      }
      const component = createSafeComponent(plugin)
      const wrapper = mount(component)
      expect(wrapper.vm.name).toBeUndefined()
    })
  })

  describe('Created', () => {
    it('should mount with created hook', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        data: () => ({
          name: 'Test'
        }),
        created () {
          this.name = 'Jest'
        }
      }
      const component = createSafeComponent(plugin)
      const wrapper = mount(component)
      expect(wrapper.vm.name).toBe('Jest')
    })

    it('should not access the parent element', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        data: () => ({
          name: 'Test',
          uid: undefined
        }),
        created () {
          this.uid = this.$parent && this.$parent._uid
        }
      }
      const component = createSafeComponent(plugin)
      const wrapper = mount(component)
      expect(wrapper.vm.uid).toBeUndefined()
    })
  })

  describe('Mounted', () => {
    it('should mount with mounted hook', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        data: () => ({
          name: 'Test'
        }),
        mounted () {
          this.name = 'Jest'
        }
      }
      const component = createSafeComponent(plugin)
      const wrapper = mount(component)
      expect(wrapper.vm.name).toBe('Jest')
    })

    it('should access refs', (done) => {
      const plugin = {
        template: '<div ref="test" id="t1">{{ name }}</div>',
        data: () => ({
          name: 'Test',
          id: undefined
        }),
        mounted () {
          this.$nextTick(() => {
            this.id = this.refs.test.id
          })
        }
      }
      const component = createSafeComponent(plugin)
      const wrapper = mount(component)
      localVue.nextTick(() => {
        expect(wrapper.vm.id).toBe('t1')
        done()
      })
    })

    it('should not set custom properties', (done) => {
      const spy = jest.spyOn(console, 'error').mockImplementation()

      const plugin = {
        template: '<div ref="test">{{ name }}</div>',
        data: () => ({
          name: 'Test'
        }),
        mounted () {
          this.$nextTick(() => {
            this.refs.test.innerHTML = 'Jest'
            this.refs.test.outerHTML = 'Jest'
          })
        }
      }
      const component = createSafeComponent(plugin)
      const wrapper = mount(component)
      expect(wrapper.html()).toBe('<div>Test</div>')

      localVue.nextTick(() => {
        expect(spy).toHaveBeenCalledWith('innerHTML 🚫')
        expect(spy).toHaveBeenCalledWith('outerHTML 🚫')
        done()
      })
    })
  })
})

const createSafeComponent = (plugin) => {
  return defineContext('test', plugin, localVue)
}
