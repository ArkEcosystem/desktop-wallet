import { createLocalVue, mount } from '@vue/test-utils'
import { PluginComponentSandbox } from '@/services/plugin-manager/plugin-component-sandbox'

const vue = createLocalVue()

const plugin = {
  config: {
    id: 1
  }
}

const vm = {
  run: jest.fn(buffer => JSON.parse(buffer))
}

const name = 'test'

const options = {
  vue,
  plugin,
  vm,
  name
}

describe('Plugin Component Sandbox', () => {
  it('should return a valid component', () => {
    const sandbox = new PluginComponentSandbox({
      ...options,
      fullPath: './',
      source: {
        template: '<div>Test</div>'
      }
    })
    const component = sandbox.render()
    const wrapper = mount(component)
    expect(wrapper.isVueInstance()).toBe(true)
    expect(wrapper.html()).toBe('<div>Test</div>')
  })

  it('should render from buffer', () => {
    const sandbox = new PluginComponentSandbox({
      ...options,
      fullPath: './',
      source: Buffer.from(JSON.stringify({
        template: '<div>Test</div>'
      }))
    })
    const component = sandbox.render()
    const wrapper = mount(component)
    expect(wrapper.isVueInstance()).toBe(true)
    expect(wrapper.html()).toBe('<div>Test</div>')
    expect(vm.run).toHaveBeenCalled()
  })

  it('should render with global components', () => {
    plugin.globalComponents = {
      Test: {
        template: '<div>Global</div>'
      }
    }
    const sandbox = new PluginComponentSandbox({
      ...options,
      fullPath: './',
      source: {
        template: '<Test />'
      }
    })
    const component = sandbox.render()
    const wrapper = mount(component)
    expect(wrapper.isVueInstance()).toBe(true)
    expect(wrapper.html()).toBe('<div>Global</div>')
  })

  it('should parse child components', (done) => {
    const spy = jest.spyOn(console, 'error').mockImplementation()

    const sandbox = new PluginComponentSandbox({
      ...options,
      fullPath: './',
      source: {
        template: '<Test />',
        components: {
          Test: {
            template: '<button @click="increment" ref="btn">{{ count }}</button>',
            data: () => ({
              count: 0
            }),
            methods: {
              increment () {
                this.count++
              }
            },
            mounted () {
              this.$nextTick(() => {
                this.refs.btn.innerHTML = '<div></div>'
              })
            }
          }
        }
      }
    })

    const component = sandbox.render()
    mount(component)

    vue.nextTick(() => {
      expect(spy).toHaveBeenCalledWith('innerHTML 🚫')
      done()
    })
  })
})
