import { createLocalVue, mount } from '@vue/test-utils'
import { create as createComponentsSetup } from '@/services/plugin-manager/setup/components-setup'
import { Plugin } from '@/services/plugin-manager/plugin'

jest.mock('fs', () => ({
  readFileSync: () => ({
    template: '<div>Test</div>'
  })
}))

jest.mock('@/services/plugin-manager/component/compile-template.js', () => ({
  compileTemplate: jest.fn((vm, template) => {
    const { compileToFunctions } = require('vue-template-compiler')
    return compileToFunctions(template)
  })
}))

const localVue = createLocalVue()

const plugin = new Plugin({
  fullPath: './',
  config: {
    id: 1
  }
})

const pluginObject = {
  getComponentPaths: jest.fn(() => ({
    test: 'pages/index.js'
  }))
}

const sandbox = {
  getComponentVM: jest.fn(() => ({
    run: jest.fn()
  })),
  getPluginVM: jest.fn(() => ({
    run: jest.fn()
  })),
  app: {}
}

const componentsSetup = createComponentsSetup(plugin, pluginObject, sandbox, localVue)
componentsSetup()

describe('Components Setup', () => {
  it('should call the getComponentPaths method', () => {
    expect(pluginObject.getComponentPaths).toHaveBeenCalled()
  })

  it('should populate the components field', () => {
    const componentNames = Object.keys(plugin.components)
    expect(componentNames.length).toBeGreaterThan(0)
    const wrapper = mount(plugin.components[componentNames[0]])
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
