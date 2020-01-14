import { createLocalVue, mount } from '@vue/test-utils'
import { getSafeContext } from '@/services/plugin-manager/component/get-context'

let localVue

beforeEach(() => {
  localVue = createLocalVue()
})

const createSafeRender = (plugin) => {
  return localVue.extend({
    ...plugin,
    render: function (...args) {
      return plugin.render.apply(getSafeContext(this, plugin), args)
    }
  })
}

describe('Prepare Component Context', () => {
  describe('Render', () => {
    it('should render', () => {
      const plugin = {
        render (h) {
          return h('div', 'Test')
        }
      }

      const wrapper = mount(createSafeRender(plugin))
      expect(wrapper.isVueInstance()).toBe(true)
      expect(wrapper.html()).toBe('<div>Test</div>')
    })

    it('should render with computed properties', () => {
      const plugin = {
        render (h) {
          return h('div', this.name)
        },
        computed: {
          name () {
            return 'Test'
          }
        }
      }

      const wrapper = mount(createSafeRender(plugin))
      expect(wrapper.html()).toBe('<div>Test</div>')
    })

    it('should not access the parent element', () => {
      const plugin = {
        render (h) {
          return h('div', this.$parent && this.$parent._uid)
        }
      }

      const wrapper = mount(createSafeRender(plugin))
      expect(wrapper.find('div').text()).toBe('')
    })

    it('should not access the root element', () => {
      const plugin = {
        render (h) {
          return h('div', this.$root && this.$root._uid)
        }
      }

      const wrapper = mount(createSafeRender(plugin))
      expect(wrapper.find('div').text()).toBe('')
    })
  })
})
