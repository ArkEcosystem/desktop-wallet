import { create as createThemesSetup } from '@/services/plugin-manager/setup/themes-setup'

jest.mock('fs', () => ({
  existsSync: jest.fn(() => true)
}))

const pluginObject = {
  getThemes: jest.fn(() => ({
    test: {
      cssPath: 'styles/themes.css',
      darkMode: true
    }
  }))
}

const sandbox = {
  app: {
    $store: {
      dispatch: jest.fn()
    }
  }
}

const plugin = {
  fullPath: __dirname,
  config: {
    id: 1
  }
}

const profileId = 'profile1'

const themesSetup = createThemesSetup(plugin, pluginObject, sandbox, profileId)
themesSetup()

describe('Themes Setup', () => {
  it('should call the getThemes method', () => {
    expect(pluginObject.getThemes).toHaveBeenCalled()
  })

  it('should dispatch to vuex', () => {
    expect(sandbox.app.$store.dispatch).toHaveBeenCalled()
  })
})
