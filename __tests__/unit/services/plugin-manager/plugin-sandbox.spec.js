import path from 'path'
import { createLocalVue } from '@vue/test-utils'
import { PluginSandbox } from '@/services/plugin-manager/plugin-sandbox'
import { Plugin } from '@/services/plugin-manager/plugin'

const rootPath = path.resolve(__dirname, '../../../')
const app = createLocalVue()
const plugin = new Plugin({
  rootPath,
  fullPath: path.resolve(__dirname),
  config: {
    permissions: []
  }
})

beforeEach(() => {
  plugin.config.permissions = []
})

describe('Plugin Sandbox', () => {
  it('should parse component vm file with api', async () => {
    const sandbox = new PluginSandbox({
      app,
      plugin
    })

    await sandbox.install()

    const pluginVM = sandbox.getComponentVM()
    expect(pluginVM.run(`
      module.exports = walletApi
    `)).toBeDefined()
  })

  it('should parse plugin vm file without api', async () => {
    const sandbox = new PluginSandbox({
      app,
      plugin
    })

    await sandbox.install()

    const pluginVM = sandbox.getPluginVM()
    expect(() => pluginVM.run(`
      module.exports = walletApi
    `)).toThrowError('walletApi is not defined')
  })

  it('should read permissions', async () => {
    plugin.config.permissions = ['ALERTS']
    const sandbox = new PluginSandbox({
      app,
      plugin
    })

    await sandbox.install()

    const componentVM = sandbox.getComponentVM()
    expect(componentVM.run(`
      module.exports = walletApi.alert
    `)).toBeDefined()
  })

  it('should not throw error with nonexistent permission', async () => {
    plugin.config.permissions = ['SECRETS']
    const sandbox = new PluginSandbox({
      app,
      plugin
    })

    await sandbox.install()

    const componentVM = sandbox.getComponentVM()
    expect(componentVM.run(`
      module.exports = walletApi.secrets
    `)).toBeUndefined()
  })
})
