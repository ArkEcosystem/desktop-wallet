import { createStorageSandbox } from '@/services/plugin-manager/sandbox/storage-sandbox'

const plugin = {
  config: {
    id: 'profile1'
  }
}

let walletApi
let app

beforeAll(() => {
  walletApi = {}
  const db = {}

  app = {
    $store: {
      getters: {
        'plugin/pluginOptions': jest.fn(() => db)
      },
      dispatch: jest.fn((_, data) => (db[data.key] = data.value))
    }
  }

  const storageSandbox = createStorageSandbox(walletApi, app, plugin)
  storageSandbox()
})

describe('Storage Sandbox', () => {
  const options = {
    key: 'test',
    value: 1,
    pluginId: plugin.config.id,
    profileId: undefined
  }

  it('should expose functions', () => {
    expect(walletApi.storage).toBeTruthy()
    expect(walletApi.storage.getOptions).toBeTruthy()
    expect(walletApi.storage.get).toBeTruthy()
    expect(walletApi.storage.set).toBeTruthy()
  })

  it('should set a value to key', () => {
    walletApi.storage.set(options.key, options.value)
    expect(app.$store.dispatch).toHaveBeenCalledWith('plugin/setPluginOption', options)
  })

  it('should get the value from key', () => {
    const result = walletApi.storage.get(options.key)
    expect(app.$store.getters['plugin/pluginOptions']).toHaveBeenCalledWith(plugin.config.id, undefined)
    expect(result).toBe(options.value)
  })

  it('should get all values', () => {
    const result = walletApi.storage.getOptions()
    expect(Object.keys(result)).toHaveLength(1)
    expect(result).toHaveProperty(options.key, options.value)
  })
})
