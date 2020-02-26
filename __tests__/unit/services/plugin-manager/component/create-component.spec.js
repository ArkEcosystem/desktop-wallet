import { createLocalVue, mount } from '@vue/test-utils'
import { createSafeComponent } from '@/services/plugin-manager/component/create-component'

const localVue = createLocalVue()

const wrapperPlugin = (plugin) => {
  return createSafeComponent('test', plugin, localVue)
}

describe('Create Component', () => {
  it('should return a valid component', () => {
    const plugin = {
      template: '<div>Test</div>'
    }

    const component = wrapperPlugin(plugin)
    const wrapper = mount(component)
    expect(wrapper.isVueInstance()).toBe(true)
  })

  describe('Props', () => {
    it('should mount with props', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        props: {
          name: {
            type: String
          }
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component, {
        propsData: {
          name: 'Test'
        }
      })
      expect(wrapper.html()).toBe('<div>Test</div>')
    })

    it('should sync changes', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        props: {
          name: {
            type: String
          }
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component, {
        propsData: {
          name: 'Test'
        }
      })
      expect(wrapper.html()).toBe('<div>Test</div>')
      wrapper.setProps({ name: 'Jest' })
      expect(wrapper.html()).toBe('<div>Jest</div>')
    })
  })

  describe('Data', () => {
    it('should mount with data', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        data: () => ({
          name: 'Test'
        })
      }
      const component = wrapperPlugin(plugin)
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
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      expect(wrapper.vm.name).toBeUndefined()
    })
  })

  describe('Computed', () => {
    it('should mount with computed data', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        computed: {
          name () {
            return 'Test'
          }
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      expect(wrapper.html()).toBe('<div>Test</div>')
    })

    it('should not access parent element', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        computed: {
          name () {
            return this.$parent
          }
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      expect(wrapper.vm.name).toBeUndefined()
    })
  })

  describe('Methods', () => {
    it('should mount with methods', () => {
      const plugin = {
        template: '<div>{{ name }}</div>',
        data: () => ({
          name: 'Test'
        }),
        methods: {
          change () {
            this.name = 'Jest'
          }
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      wrapper.vm.change()
      expect(wrapper.vm.name).toBe('Jest')
    })

    it('should not access restricted properties', () => {
      const plugin = {
        template: '<div></div>',
        data: () => ({
          parent: undefined,
          root: undefined
        }),
        methods: {
          change () {
            this.parent = this.$parent
            this.root = this.$root
          }
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      wrapper.vm.change()
      expect(wrapper.vm.parent).toBe(undefined)
      expect(wrapper.vm.root).toBe(undefined)
    })

    it('should not access restricted properties from events', () => {
      const plugin = {
        template: '<button ref="btn" @click="change">Test</button>',
        data: () => ({
          parent: undefined,
          root: undefined
        }),
        methods: {
          change () {
            this.parent = this.$parent
            this.root = this.$root
          }
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      const btn = wrapper.find({ ref: 'btn' })
      btn.trigger('click')
      expect(wrapper.vm.parent).toBe(undefined)
      expect(wrapper.vm.root).toBe(undefined)
    })

    it('should call methods from elements', () => {
      const plugin = {
        template: '<button ref="btn" @click="change">{{ name }}</button>',
        data: () => ({
          name: 'Test'
        }),
        methods: {
          change () {
            this.name = 'Jest'
          }
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      const btn = wrapper.find({ ref: 'btn' })
      btn.trigger('click')
      expect(wrapper.vm.name).toBe('Jest')
    })

    it('should call methods from elements with params', () => {
      const plugin = {
        template: '<button ref="btn" @click="change(customName)">{{ name }}</button>',
        data: () => ({
          name: 'Test',
          customName: 'Jest'
        }),
        methods: {
          change (name) {
            this.name = name
          }
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      const btn = wrapper.find({ ref: 'btn' })
      btn.trigger('click')
      expect(wrapper.vm.name).toBe('Jest')
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
      const component = wrapperPlugin(plugin)
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
      const component = wrapperPlugin(plugin)
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
      const component = wrapperPlugin(plugin)
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
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      localVue.nextTick(() => {
        expect(wrapper.vm.id).toBe('t1')
        done()
      })
    })

    it('should not set custom properties', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation()

      const plugin = {
        template: '<div ref="test">{{ name }}</div>',
        data: () => ({
          name: 'Test'
        }),
        mounted () {
          this.$nextTick(() => {
            this.refs.test.href = 'Jest'
            this.refs.test.innerHTML = 'Jest'
            this.refs.test.outerHTML = 'Jest'
            this.refs.test.appendChild(document.createElement('p'))
            this.refs.test.cloneNode()
            this.refs.test.getRootNode()
            this.refs.test.insertBefore()
            this.refs.test.normalize()
            this.refs.test.querySelector()
            this.refs.test.querySelectorAll()
            this.refs.test.removeChild()
            this.refs.test.replaceChild()
          })
        }
      }
      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)
      expect(wrapper.html()).toBe('<div>Test</div>')

      await wrapper.vm.$nextTick()

      expect(spy).toHaveBeenCalledWith('href 🚫')
      expect(spy).toHaveBeenCalledWith('innerHTML 🚫')
      expect(spy).toHaveBeenCalledWith('outerHTML 🚫')
      expect(spy).toHaveBeenCalledWith('appendChild 🚫')
      expect(spy).toHaveBeenCalledWith('cloneNode 🚫')
      expect(spy).toHaveBeenCalledWith('getRootNode 🚫')
      expect(spy).toHaveBeenCalledWith('insertBefore 🚫')
      expect(spy).toHaveBeenCalledWith('normalize 🚫')
      expect(spy).toHaveBeenCalledWith('querySelector 🚫')
      expect(spy).toHaveBeenCalledWith('querySelectorAll 🚫')
      expect(spy).toHaveBeenCalledWith('removeChild 🚫')
      expect(spy).toHaveBeenCalledWith('replaceChild 🚫')

      spy.mockRestore()
    })

    it('should only allow href change via template variable', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation()

      const plugin = {
        template: `<div>
          <a ref="normalLink" href="testHref">test link</a>
          <a ref="variableLink" :href="testHref">test link</a>
        </div>`,
        data: () => ({
          testHref: 'testHref'
        }),
        mounted () {
          this.$nextTick(() => {
            this.refs.normalLink.href = 'Failed'

            this.testHref = 'Success'
          })
        },
        methods: {
          updateHref () {
            this.refs.variableLink.href = 'Failed'
          }
        }
      }

      const component = wrapperPlugin(plugin)
      const wrapper = mount(component)

      await wrapper.vm.$nextTick()

      expect(wrapper.find({ ref: 'normalLink' }).element.href).toBe(undefined)
      expect(wrapper.find({ ref: 'variableLink' }).element.href).toBe('http://localhost/Success')

      wrapper.vm.updateHref()

      expect(wrapper.find({ ref: 'variableLink' }).element.href).toBe(undefined)
      expect(spy).toHaveBeenCalledWith('href 🚫')
      expect(spy).toHaveBeenCalledTimes(2)

      spy.mockRestore()
    })
  })
})
