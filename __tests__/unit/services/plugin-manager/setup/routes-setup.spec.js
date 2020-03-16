import { create as createRoutesSetup } from '@/services/plugin-manager/setup/routes-setup'
import { Plugin } from '@/services/plugin-manager/plugin'

const pluginObject = {
  getRoutes: jest.fn(() => [
    {
      name: 'test',
      component: 'test'
    }
  ])
}

let plugin
let sandbox
let routesSetup

beforeEach(() => {
  plugin = new Plugin({
    config: {
      id: 1
    }
  })

  plugin.components = {
    test: {}
  }

  sandbox = {
    app: {
      $router: {
        options: {
          routes: []
        },
        addRoutes: jest.fn()
      }
    }
  }

  routesSetup = createRoutesSetup(plugin, pluginObject, sandbox)
})

describe('Routes Items Setup', () => {
  it('should call the getRoutes method', () => {
    routesSetup()
    expect(pluginObject.getRoutes).toHaveBeenCalled()
  })

  it('should populate the plugin field', () => {
    routesSetup()
    expect(plugin.routes).toHaveLength(1)
  })

  it('should populate app routes', () => {
    routesSetup()
    expect(sandbox.app.$router.addRoutes).toHaveBeenCalled()
  })

  it('should not override app routes', () => {
    const customSandbox = { ...sandbox }
    customSandbox.app.$router.options.routes.push({
      name: 'test'
    })

    const customSetup = createRoutesSetup(plugin, pluginObject, sandbox)
    customSetup()

    expect(plugin.routes.length).toBe(1)
    expect(sandbox.app.$router.addRoutes).toHaveBeenCalledTimes(1)
  })
})
