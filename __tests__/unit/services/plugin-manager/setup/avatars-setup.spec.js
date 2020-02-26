import { create as createAvatarsSetup } from '@/services/plugin-manager/setup/avatars-setup'
import { Plugin } from '@/services/plugin-manager/plugin'

const plugin = new Plugin({
  config: {
    id: 1
  }
})

plugin.components = {
  man: {},
  woman: {}
}

const pluginObject = {
  getAvatars: jest.fn(() => ['man', 'woman'])
}

const sandbox = {
  app: {
    $store: {
      dispatch: jest.fn()
    }
  }
}

const profileId = 'profile1'

const avatarsSetup = createAvatarsSetup(plugin, pluginObject, sandbox, profileId)
avatarsSetup()

describe('Avatars Setup', () => {
  it('should call the getAvatars method', () => {
    expect(pluginObject.getAvatars).toHaveBeenCalled()
  })

  it('should populate the avatars field', () => {
    expect(plugin.avatars.length).toBeGreaterThan(0)
  })

  it('should dispatch to vuex', () => {
    expect(sandbox.app.$store.dispatch).toHaveBeenCalled()
  })
})
