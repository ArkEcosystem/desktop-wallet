import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import PluginModule from '@/store/modules/plugin'
import pluginManager from '@/services/plugin-manager'
import releaseService from '@/services/release'
import profiles, { profile1 } from '../../__fixtures__/store/profile'
import merge from 'lodash/merge'

const localVue = createLocalVue()
localVue.use(Vuex)

jest.mock('@/services/plugin-manager')

const dateSpy = jest.spyOn(Date, 'now')
dateSpy.mockReturnValue(1)

const availablePlugins = [
  { config: { id: 'plugin-1', version: '0.0.1' } },
  { config: { id: 'plugin-2', version: '0.0.1' } },
  { config: { id: 'plugin-3', version: '0.0.1' } }
]

const installedPlugins = [
  { config: { id: 'plugin-1', version: '1.0.1' } },
  { config: { id: 'plugin-installed', version: '0.0.1' } }
]

const sessionProfileId = jest.fn()
sessionProfileId.mockReturnValue(profile1.id)

const store = new Vuex.Store({
  modules: {
    plugin: PluginModule,
    session: {
      namespaced: true,
      getters: {
        profile () {
          return profile1
        },
        profileId () {
          return sessionProfileId()
        },
        filterBlacklistedPlugins () {
          return true
        }
      }
    },
    profile: {
      namespaced: true,
      getters: {
        all () {
          return profiles
        }
      }
    }
  },
  strict: true
})

store._vm.$plugins = {
  deletePlugin: jest.fn(),
  enablePlugin: jest.fn(),
  disablePlugin: jest.fn()
}

store._vm.$logger = {
  error: jest.fn()
}

const initialState = JSON.parse(JSON.stringify(store.state))

describe('PluginModule', () => {
  describe('getters', () => {
    describe('lastFetched', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should update lastFetched when setting available plugins', () => {
        expect(store.getters['plugin/lastFetched']).toEqual(0)
        store.dispatch('plugin/setAvailable', {})
        expect(store.getters['plugin/lastFetched']).toEqual(1)
      })
    })

    describe('filtered', () => {
      describe.only('when given a filter', () => {
        beforeAll(() => {
          store.replaceState(merge(
            JSON.parse(JSON.stringify(initialState)),
            {
              plugin: {
                available: {
                  [availablePlugins[0].config.id]: {
                    config: {
                      ...availablePlugins[0].config,
                      isOfficial: true
                    }
                  },
                  [availablePlugins[1].config.id]: availablePlugins[1]
                },
                whitelisted: {
                  global: {
                    [availablePlugins[0].config.id]: {
                      version: availablePlugins[0].config.version
                    },
                    [availablePlugins[1].config.id]: {
                      isGrant: true,
                      version: availablePlugins[1].config.version
                    }
                  }
                }
              }
            }
          ))
        })

        it('should filter official plugins only', () => {
          expect(store.getters['plugin/filtered'](null, null, 'official').map(plugin => {
            return plugin.config.id
          })).toEqual([availablePlugins[0].config.id])
        })

        it('should filter funded plugins only', () => {
          expect(store.getters['plugin/filtered'](null, null, 'funded').map(plugin => {
            return plugin.config.id
          })).toEqual([availablePlugins[1].config.id])
        })
      })

      describe('blacklisted plugins', () => {
        it('should filter out globally blacklisted plugins', () => {
          store.replaceState(merge(
            JSON.parse(JSON.stringify(initialState)),
            {
              plugin: {
                available: {
                  [availablePlugins[0].config.id]: availablePlugins[0]
                },
                blacklisted: {
                  global: [availablePlugins[0].config.id]
                }
              }
            }
          ))

          expect(store.getters['plugin/filtered']()).toEqual([])
        })

        it('should filter out locally blacklisted plugins', () => {
          store.replaceState(merge(
            JSON.parse(JSON.stringify(initialState)),
            {
              plugin: {
                available: {
                  [availablePlugins[0].config.id]: availablePlugins[0]
                },
                blacklisted: {
                  local: [availablePlugins[0].config.id]
                }
              }
            }
          ))

          expect(store.getters['plugin/filtered']()).toEqual([])
        })
      })

      describe('whitelisted plugins', () => {
        it('should filter out plugins that are not installed and not whitelisted', () => {
          store.replaceState(merge(
            JSON.parse(JSON.stringify(initialState)),
            {
              plugin: {
                available: {
                  [availablePlugins[0].config.id]: availablePlugins[0]
                }
              }
            }
          ))

          expect(store.getters['plugin/filtered']()).toEqual([])
        })

        it('should filter out plugins that are not installed and whitelisted', () => {
          store.replaceState(merge(
            JSON.parse(JSON.stringify(initialState)),
            {
              plugin: {
                available: {
                  [availablePlugins[0].config.id]: availablePlugins[0]
                },
                whitelisted: {
                  global: {
                    [availablePlugins[0].config.id]: {
                      version: availablePlugins[0].config.version
                    }
                  }
                }
              }
            }
          ))

          expect(store.getters['plugin/filtered']()).toEqual([availablePlugins[0]])
        })

        it('should not filter out plugins that are installed and not whitelisted', () => {
          store.replaceState(merge(
            JSON.parse(JSON.stringify(initialState)),
            {
              plugin: {
                available: {
                  [availablePlugins[0].config.id]: availablePlugins[0]
                },
                installed: {
                  [availablePlugins[0].config.id]: availablePlugins[0]
                }
              }
            }
          ))

          expect(store.getters['plugin/filtered']()).toEqual([availablePlugins[0]])
        })
      })

      describe('when given a category', () => {
        describe('when the category is \'all\'', () => {
          it('should filter out theme plugins', () => {
            const plugin1 = {
              config: {
                ...availablePlugins[0].config,
                categories: ['match']
              }
            }
            const plugin2 = {
              config: {
                ...availablePlugins[1].config,
                categories: ['theme']
              }
            }

            store.replaceState(merge(
              JSON.parse(JSON.stringify(initialState)),
              {
                plugin: {
                  available: {
                    [plugin1.config.id]: plugin1,
                    [plugin2.config.id]: plugin2
                  },
                  whitelisted: {
                    global: {
                      [plugin1.config.id]: {
                        version: plugin1.config.version
                      },
                      [plugin2.config.id]: {
                        version: plugin2.config.version
                      }
                    }
                  }
                }
              }
            ))

            const result = store.getters['plugin/filtered'](null, 'all')

            expect(result).toEqual(expect.arrayContaining([plugin1]))
            expect(result).toEqual(expect.not.arrayContaining([plugin2]))
          })
        })

        it('should not filter out plugins that match the category', () => {
          const plugin1 = {
            config: {
              ...availablePlugins[0].config,
              categories: ['match']
            }
          }
          const plugin2 = {
            config: {
              ...availablePlugins[1].config,
              categories: ['no-match']
            }
          }

          store.replaceState(merge(
            JSON.parse(JSON.stringify(initialState)),
            {
              plugin: {
                available: {
                  [plugin1.config.id]: plugin1,
                  [plugin2.config.id]: plugin2
                },
                whitelisted: {
                  global: {
                    [plugin1.config.id]: {
                      version: plugin1.config.version
                    },
                    [plugin2.config.id]: {
                      version: plugin2.config.version
                    }
                  }
                }
              }
            }
          ))

          const result = store.getters['plugin/filtered'](null, 'match')

          expect(result).toEqual(expect.arrayContaining([plugin1]))
          expect(result).toEqual(expect.not.arrayContaining([plugin2]))
        })
      })

      describe('when given a query', () => {
        it('should filter out plugins that do not match the query', () => {
          const plugin1 = {
            config: {
              ...availablePlugins[0].config,
              keywords: ['yes']
            }
          }
          const plugin2 = {
            config: {
              ...availablePlugins[1].config,
              keyowrds: ['no']
            }
          }

          store.replaceState(merge(
            JSON.parse(JSON.stringify(initialState)),
            {
              plugin: {
                available: {
                  [plugin1.config.id]: plugin1,
                  [plugin2.config.id]: plugin2
                },
                whitelisted: {
                  global: {
                    [plugin1.config.id]: {
                      version: plugin1.config.version
                    },
                    [plugin2.config.id]: {
                      version: plugin2.config.version
                    }
                  }
                }
              }
            }
          ))

          const result = store.getters['plugin/filtered']('yes')

          expect(result).toEqual(expect.arrayContaining([plugin1]))
          expect(result).toEqual(expect.not.arrayContaining([plugin2]))
        })
      })
    })

    describe('available', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return all available plugins', () => {
        store.dispatch('plugin/setAvailable', availablePlugins)
        expect(store.getters['plugin/available']).toEqual(availablePlugins)
      })
    })

    describe('availableById', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return null if there are no available plugins', () => {
        expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toBeNull()
      })

      it('should return null if the plugin cannot be found', () => {
        expect(store.getters['plugin/availableById']('plugin-not-available')).toBeNull()
      })

      it('should return the plugin if it is available', () => {
        store.dispatch('plugin/setAvailable', [availablePlugins[0]])
        expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toEqual(availablePlugins[0])
      })
    })

    describe('isAvailable', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should be possible to check if a plugin is available', () => {
        store.dispatch('plugin/setAvailable', [availablePlugins[0]])
        expect(store.getters['plugin/isAvailable'](availablePlugins[0].config.id)).toBe(true)
        expect(store.getters['plugin/isAvailable']('plugin-not-available')).toBe(false)
      })
    })

    describe('installed', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return all installed plugins', () => {
        for (const plugin of installedPlugins) {
          store.dispatch('plugin/setInstalled', plugin)
        }
        expect(store.getters['plugin/installed']).toEqual(installedPlugins)
      })
    })

    describe('installedById', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return null if there are no installed plugins', () => {
        expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toBeNull()
      })

      it('should return null if the plugin cannot be found', () => {
        expect(store.getters['plugin/installedById']('plugin-not-installed')).toBeNull()
      })

      it('should return the plugin if it is installed', () => {
        store.dispatch('plugin/setInstalled', installedPlugins[0])
        expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toEqual(installedPlugins[0])
      })
    })

    describe('isInstalled', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should be possible to check if a plugin is installed', () => {
        store.dispatch('plugin/setInstalled', installedPlugins[0])
        expect(store.getters['plugin/isInstalled'](installedPlugins[0].config.id)).toBe(true)
        expect(store.getters['plugin/isInstalled']('plugin-not-installed')).toBe(false)
      })
    })

    describe('isUpdateAvailable', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return false if the plugin is not available', () => {
        const plugin = availablePlugins[0]

        store.dispatch('plugin/setInstalled', plugin)
        expect(store.getters['plugin/isUpdateAvailable'](plugin.config.id)).toBe(false)
      })

      it('should return false if the plugin is not installed', () => {
        const plugin = availablePlugins[0]

        store.dispatch('plugin/setAvailable', [plugin])
        expect(store.getters['plugin/isUpdateAvailable'](plugin.config.id)).toBe(false)
      })

      it('should return false if the installed version is equal or higher than the available version', () => {
        store.dispatch('plugin/setAvailable', [availablePlugins[0]])
        store.dispatch('plugin/setInstalled', installedPlugins[0])
        expect(store.getters['plugin/isUpdateAvailable'](availablePlugins[0].config.id)).toBe(false)
      })

      it('should return true if the installed version is lower than the available version', () => {
        store.dispatch('plugin/setAvailable', [installedPlugins[0]])
        store.dispatch('plugin/setInstalled', availablePlugins[0])
        expect(store.getters['plugin/isUpdateAvailable'](availablePlugins[0].config.id)).toBe(true)
      })
    })

    describe('latestVersion', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return null if the plugin is not available', () => {
        expect(store.getters['plugin/latestVersion']('plugin-not-available')).toBeNull()
      })

      it('should return the version of the available plugin', () => {
        store.dispatch('plugin/setAvailable', [availablePlugins[0]])
        expect(store.getters['plugin/latestVersion'](availablePlugins[0].config.id)).toBe(availablePlugins[0].config.version)
      })
    })

    describe('all', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return all available and installed plugins', () => {
        store.dispatch('plugin/setAvailable', availablePlugins)
        for (const plugin of installedPlugins) {
          store.dispatch('plugin/setInstalled', plugin)
        }

        const all = store.getters['plugin/all']

        for (const plugin of availablePlugins.concat(installedPlugins).map(p => p.config.id)) {
          expect(all.find(p => p.config.id === plugin)).toBeTruthy()
        }
      })

      it('should merge all available and installed plugins correctly', () => {
        store.dispatch('plugin/setAvailable', availablePlugins)
        for (const plugin of installedPlugins) {
          store.dispatch('plugin/setInstalled', plugin)
        }

        expect(store.getters['plugin/all'].find(p => p.config.id === 'plugin-1')).toEqual(installedPlugins[0])
      })
    })

    describe('isEnabled', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true
                }
              }
            }
          }
        ))
      })

      describe('when no profile id given', () => {
        it('should return false if the plugin is not enabled', () => {
          expect(store.getters['plugin/isEnabled']('plugin-not-enabled')).toBe(false)
        })

        it('should return true if the plugin is enabled', () => {
          expect(store.getters['plugin/isEnabled'](availablePlugins[0].config.id)).toBe(true)
        })
      })

      describe('when profile id given', () => {
        it('should return false if the plugin is not enabled', () => {
          expect(store.getters['plugin/isEnabled']('plugin-not-enabled', profile1.id)).toBe(false)
        })

        it('should return false if there are no enabled plugins', () => {
          expect(store.getters['plugin/isEnabled']('plugin-not-enabled', 'wrong-profile')).toBe(false)
        })

        it('should return true if the plugin is enabled', () => {
          expect(store.getters['plugin/isEnabled'](availablePlugins[0].config.id, profile1.id)).toBe(true)
        })
      })
    })

    describe('loaded', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return an empty object if there is no session profile', () => {
        sessionProfileId.mockReturnValue(null)
        expect(store.getters['plugin/loaded']).toEqual({})
      })

      it('should return an empty object if there are no loaded plugins for the session profile', () => {
        sessionProfileId.mockReturnValue(profile1.id)
        expect(store.getters['plugin/loaded']).toEqual({})
      })

      it('should return the loaded plugins for the session profile', () => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {
                    ...availablePlugins[0],
                    profileId: profile1.id,
                    avatars: [],
                    menuItems: []
                  }
                }
              }
            }
          }
        ))

        expect(store.getters['plugin/loaded']).toEqual({
          [availablePlugins[0].config.id]: {
            avatars: [],
            menuItems: [],
            config: availablePlugins[0].config,
            profileId: profile1.id
          }
        })
      })
    })

    describe('isLoaded', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {
                    ...availablePlugins[0],
                    profileId: profile1.id,
                    avatars: [],
                    menuItems: []
                  }
                }
              }
            }
          }
        ))
      })

      describe('when no profile id is given', () => {
        it('should return true if the plugin is loaded', () => {
          expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id)).toBe(true)
        })

        it('should return false if the plugin is not loaded', () => {
          expect(store.getters['plugin/isLoaded']('plugin-not-loaded')).toBe(false)
        })
      })

      describe('when profile id is given', () => {
        it('should return true if the plugin is loaded', () => {
          expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id, profile1.id)).toBe(true)
        })

        it('should return false if the plugin is not loaded', () => {
          expect(store.getters['plugin/isLoaded']('plugin-not-loaded', profile1.id)).toBe(false)
        })

        it('should return false if the profile id does not exist', () => {
          expect(store.getters['plugin/isLoaded']('plugin-not-loaded', 'profile-invalid')).toBe(false)
        })
      })
    })

    describe('isBlacklisted', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              blacklisted: {
                global: [availablePlugins[0].config.id],
                local: [availablePlugins[1].config.id]
              }
            }
          }
        ))
      })

      it('should return true if the plugin is blacklisted globally', () => {
        expect(store.getters['plugin/isBlacklisted'](availablePlugins[0].config.id)).toBe(true)
      })

      it('should return true if the plugin is blacklisted locally', () => {
        expect(store.getters['plugin/isBlacklisted'](availablePlugins[1].config.id)).toBe(true)
      })

      it('should return false if the plugin is not blacklisted', () => {
        expect(store.getters['plugin/isBlacklisted']('plugin-not-blacklisted')).toBe(false)
      })
    })

    describe('isWhitelisted', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))

        store.dispatch('plugin/setWhitelisted', {
          scope: 'global',
          plugins: {
            [availablePlugins[0].config.id]: {
              version: availablePlugins[0].config.version
            }
          }
        })
      })

      it('should return true if the plugin is whitelisted and the version is lower or equal', () => {
        const equal = {
          config: {
            id: availablePlugins[0].config.id,
            version: '0.0.1'
          }
        }
        expect(store.getters['plugin/isWhitelisted'](equal)).toBe(true)
      })

      it('should return false if the plugin is whitelisted and the version is higher', () => {
        const higher = {
          config: {
            id: availablePlugins[0].config.id,
            version: '1.0.0'
          }
        }
        expect(store.getters['plugin/isWhitelisted'](higher)).toBe(false)
      })

      it('should return false if the plugin is not whitelisted', () => {
        expect(store.getters['plugin/isWhitelisted']({ config: { id: 'plugin-not-whitelisted' } })).toBe(false)
      })
    })

    describe('isGrant', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))

        store.dispatch('plugin/setWhitelisted', {
          scope: 'global',
          plugins: {
            [availablePlugins[0].config.id]: {
              isGrant: true,
              version: availablePlugins[0].config.version
            },
            [availablePlugins[1].config.id]: {
              version: availablePlugins[1].config.version
            }
          }
        })
      })

      it('should return true if the plugin is whitelisted and is a funded by ark grants', () => {
        const pluginId = availablePlugins[0].config.id
        expect(store.getters['plugin/isGrant'](pluginId)).toBe(true)
      })

      it('should return false if the plugin is whitelisted and is a not funded by ark grants', () => {
        const pluginId = availablePlugins[1].config.id
        expect(store.getters['plugin/isGrant'](pluginId)).toBe(false)
      })

      it('should return false if the plugin is not whitelisted and is a not funded by ark grants', () => {
        expect(store.getters['plugin/isGrant']('plugin-not-grants')).toBe(false)
      })
    })

    describe('isInstalledSupported', () => {
      let spy

      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
        spy = jest.spyOn(releaseService, 'currentVersion', 'get').mockImplementation(() => '2.0.0')
      })

      afterAll(() => {
        spy.mockRestore()
      })

      it('should return true if the plugin does not define a min version', () => {
        store.dispatch('plugin/setInstalled', installedPlugins[0])
        expect(store.getters['plugin/isInstalledSupported'](installedPlugins[0].config.id)).toBe(true)
      })

      it('should return true if the wallet version is equal or higher than the defined min version', () => {
        store.dispatch('plugin/setInstalled', {
          config: {
            ...installedPlugins[0].config,
            minimumVersion: '1.0.0'
          }
        })
        expect(store.getters['plugin/isInstalledSupported'](installedPlugins[0].config.id)).toBe(true)
      })

      it('should return false if the wallet version is lower than the defined min version', () => {
        store.dispatch('plugin/setInstalled', {
          config: {
            ...installedPlugins[0].config,
            minimumVersion: '3.0.0'
          }
        })
        expect(store.getters['plugin/isInstalledSupported'](installedPlugins[0].config.id)).toBe(false)
      })
    })

    describe('avatar', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  'avatar-plugin': {}
                }
              }
            }
          }
        ))
      })

      it('should return null if there are no loaded plugins for the given profile', () => {
        expect(store.getters['plugin/avatar'](profiles[1])).toBe(null)
      })

      it('should retrieve the avatar components from the plugin manager', () => {
        const spy = jest.spyOn(pluginManager, 'getAvatarComponents').mockImplementation(() => ({
          [profile1.avatar.avatarName]: 'avatar'
        }))

        expect(store.getters['plugin/avatar'](profile1)).toBe('avatar')
        expect(spy).toHaveBeenCalledWith(profile1.avatar.pluginId)

        spy.mockRestore()
      })
    })

    describe('avatars', () => {
      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {
                    ...availablePlugins[0],
                    avatars: { 'avatar-1': 'avatar-1' }
                  }
                }
              }
            }
          }
        ))
      })

      it('should return an empty list if there are no loaded plugins for the given profile', () => {
        expect(store.getters['plugin/avatars'](profiles[1].id)).toEqual([])
      })

      it.each([null, profile1.id])('should return the avatars', (profileId) => {
        const spy = jest.spyOn(pluginManager, 'getAvatarComponents').mockImplementation(() => {
          return store.getters['plugin/loaded'][availablePlugins[0].config.id].avatars
        })

        expect(store.getters['plugin/avatars'](profileId)).toEqual([{
          component: 'avatar-1',
          name: 'avatar-1',
          pluginId: availablePlugins[0].config.id
        }])

        spy.mockRestore()
      })
    })

    describe('menuItems', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {
                    menuItems: [{ title: 'menu-item-1' }]
                  },
                  [availablePlugins[1].config.id]: {
                    menuItems: [{ title: 'menu-item-2' }]
                  }
                }
              }
            }
          }
        ))
      })

      it('should retrieve all menu items', () => {
        expect(store.getters['plugin/menuItems']).toEqual([
          { title: 'menu-item-1' },
          { title: 'menu-item-2' }
        ])
      })
    })

    describe('themes', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return an empty object if there are no loaded plugins', () => {
        expect(store.getters['plugin/themes']).toEqual({})
      })

      it('should return an empty object if there are no loaded plugins with themes', () => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {}
                }
              }
            }
          }
        ))

        expect(store.getters['plugin/themes']).toEqual({})
      })

      it('should retrieve all themes of loaded plugins', () => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {},
                  [availablePlugins[1].config.id]: {
                    themes: {
                      'theme-1': {}
                    }
                  }
                }
              }
            }
          }
        ))

        expect(store.getters['plugin/themes']).toEqual({ 'theme-1': {} })
      })
    })

    describe('languages', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return an empty object if there are no loaded plugins', () => {
        expect(store.getters['plugin/languages']).toEqual({})
      })

      it('should return an empty object if there are no loaded plugins with languages', () => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {}
                }
              }
            }
          }
        ))

        expect(store.getters['plugin/languages']).toEqual({})
      })

      it('should retrieve all languages of loaded plugins', () => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {},
                  [availablePlugins[1].config.id]: {
                    languages: {
                      'language-1': {}
                    }
                  }
                }
              }
            }
          }
        ))

        expect(store.getters['plugin/languages']).toEqual({ 'language-1': {} })
      })
    })

    describe('walletTabs', () => {
      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {},
                  [availablePlugins[1].config.id]: {
                    walletTabs: [{
                      name: 'tab-1'
                    }]
                  }
                }
              }
            }
          }
        ))
      })

      it('should return the wallet tabs', () => {
        const spy = jest.spyOn(pluginManager, 'getWalletTabComponent').mockImplementation(() => 'tab-1-component')

        expect(store.getters['plugin/walletTabs']).toEqual([{
          name: 'tab-1',
          component: 'tab-1-component'
        }])

        spy.mockRestore()
      })
    })

    describe('enabled', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should return an empty object if there is no session profile', () => {
        sessionProfileId.mockReturnValue(null)
        expect(store.getters['plugin/enabled']).toEqual({})
      })

      it('should return an empty object if there are no enabled plugins for the session profile', () => {
        sessionProfileId.mockReturnValue(profile1.id)
        expect(store.getters['plugin/enabled']).toEqual({})
      })

      it('should return the enabled plugins for the session profile', () => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true
                }
              }
            }
          }
        ))

        expect(store.getters['plugin/enabled']).toEqual({ [availablePlugins[0].config.id]: true })
      })
    })

    describe('profileHasPluginOptions', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              pluginOptions: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {}
                }
              }
            }
          }
        ))
      })

      describe('when no profile id given', () => {
        it('should return true if there are options', () => {
          expect(store.getters['plugin/profileHasPluginOptions'](availablePlugins[0].config.id)).toBe(true)
        })

        it('should return false if there are options', () => {
          expect(store.getters['plugin/profileHasPluginOptions']('plugin-no-options')).toBe(false)
        })
      })

      describe('when profile id given', () => {
        it('should return true if there are options', () => {
          expect(store.getters['plugin/profileHasPluginOptions'](availablePlugins[0].config.id, profile1.id)).toBe(true)
        })

        it('should return false if there are options', () => {
          expect(store.getters['plugin/profileHasPluginOptions']('plugin-no-options', profile1.id)).toBe(false)
        })
      })
    })

    describe('pluginOptions', () => {
      const options = { foo: 'bar' }

      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              pluginOptions: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: options
                }
              }
            }
          }
        ))
      })

      it('should return an empty object if there are options for the given profile', () => {
        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, 'profile-no-options')).toEqual({})
      })

      it('should return an empty object if there are options for the given plugin and profile', () => {
        expect(store.getters['plugin/pluginOptions']('plugin-not-available', profile1.id)).toEqual({})
      })

      it('should return a copy of the object', () => {
        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual(options)
      })
    })
  })

  describe('actions', () => {
    describe('setBlacklisted', () => {
      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true
                }
              }
            }
          }
        ))
      })

      const plugins = availablePlugins.map(plugin => plugin.config.id)

      it('should set blacklisted plugins on the given scope', async () => {
        expect(store.getters['plugin/blacklisted'].global).toEqual([])

        await store.dispatch('plugin/setBlacklisted', {
          scope: 'global',
          plugins
        })

        expect(store.getters['plugin/blacklisted'].global).toEqual(plugins)
      })

      it('should disable a plugin if it is enabled on a profile', async () => {
        const spy = jest.spyOn(store, 'dispatch')

        await store.dispatch('plugin/setBlacklisted', {
          scope: 'global',
          plugins
        })

        expect(spy).toHaveBeenCalledWith('plugin/setEnabled', {
          enabled: false,
          pluginId: availablePlugins[0].config.id,
          profileId: profile1.id
        })

        spy.mockRestore()
      })
    })

    describe('setLoaded', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true,
                  [availablePlugins[2].config.id]: true
                }
              }
            }
          }
        ))
      })

      it('should throw an error if the plugin is not enabled', () => {
        try {
          store.dispatch('plugin/setLoaded', {
            ...availablePlugins[1],
            profileId: profile1.id
          })
        } catch (e) {
          expect(e.message).toBe('Plugin is not enabled')
        }
      })

      it('should load the plugin if it is enabled', () => {
        expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id, profile1.id)).toBe(false)

        store.dispatch('plugin/setLoaded', {
          ...availablePlugins[0],
          profileId: profile1.id
        })

        expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id, profile1.id)).toBe(true)
      })

      it('should load the plugin on the session profile if no profile id given', () => {
        expect(store.getters['plugin/isLoaded'](availablePlugins[2].config.id, profile1.id)).toBe(false)

        store.dispatch('plugin/setLoaded', availablePlugins[2])

        expect(store.getters['plugin/isLoaded'](availablePlugins[2].config.id, profile1.id)).toBe(true)
      })
    })

    describe('reset', () => {
      const dummy = { foo: 'bar' }

      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: dummy,
              installed: dummy
            }
          }
        ))
      })

      it('should reset loaded plugins to empty object', async () => {
        expect(store.state.plugin.loaded).toEqual(dummy)
        await store.dispatch('plugin/reset')
        expect(store.state.plugin.loaded).toEqual({})
      })

      it('should reset installed plugins to empty object', async () => {
        expect(store.state.plugin.installed).toEqual(dummy)
        await store.dispatch('plugin/reset')
        expect(store.state.plugin.installed).toEqual({})
      })
    })

    describe('loadPluginsForProfiles', () => {
      beforeAll(() => {
        store.replaceState(JSON.parse(JSON.stringify(initialState)))
      })

      it('should dispatch loadPluginsForProfile for every profile', async () => {
        const spy = jest.spyOn(store, 'dispatch')

        await store.dispatch('plugin/loadPluginsForProfiles')

        for (const profile of profiles) {
          expect(spy).toHaveBeenCalledWith('plugin/loadPluginsForProfile', profile)
        }

        spy.mockRestore()
      })
    })

    describe('loadPluginsForProfile', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  'plugin-not-installed': false,
                  [availablePlugins[0].config.id]: true,
                  [availablePlugins[1].config.id]: true,
                  [availablePlugins[2].config.id]: true
                }
              },
              installed: {
                [availablePlugins[1].config.id]: availablePlugins[1],
                [availablePlugins[2].config.id]: availablePlugins[2]
              },
              loaded: {
                [profile1.id]: {
                  [availablePlugins[2].config.id]: {
                    ...availablePlugins[0],
                    avatars: [],
                    menuItems: []
                  }
                }
              }
            }
          }
        ))
      })

      it('should return early if there are no enabled plugins for the given profile', async () => {
        expect(await store.dispatch('plugin/loadPluginsForProfile', profiles[1])).toBe(undefined)
      })

      it('should try to enable the plugins for the given profile', async () => {
        await store.dispatch('plugin/loadPluginsForProfile', profile1)

        expect(store._vm.$plugins.enablePlugin).toHaveBeenCalledTimes(1)
        expect(store._vm.$plugins.enablePlugin).toHaveBeenCalledWith(availablePlugins[1].config.id, profile1.id)
      })

      it('should log the error if enabling a plugin fails', async () => {
        const spy = jest.spyOn(store._vm.$plugins, 'enablePlugin').mockImplementation(() => {
          throw new Error('error')
        })

        await store.dispatch('plugin/loadPluginsForProfile', profile1)

        expect(store._vm.$logger.error).toHaveBeenCalledWith("Could not enable 'plugin-2' for profile 'Profile 1': error")

        spy.mockRestore()
      })
    })

    describe('setEnabled', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true,
                  [availablePlugins[1].config.id]: false
                }
              }
            }
          }
        ))
      })

      describe('when enabling a plugin', () => {
        it('should return early if the plugin is not disabled', async () => {
          expect(await store.dispatch('plugin/setEnabled', {
            enabled: true,
            pluginId: availablePlugins[0].config.id
          })).toBe(undefined)
        })

        it('should throw an error if it cannot enable the plugin', async () => {
          const spy = jest.spyOn(store._vm.$plugins, 'enablePlugin').mockImplementation(() => {
            throw new Error('error')
          })

          const commitSpy = jest.spyOn(store, 'commit')

          try {
            await store.dispatch('plugin/setEnabled', {
              enabled: true,
              pluginId: availablePlugins[1].config.id,
              profileId: profiles[1].id
            })
          } catch (e) {
            expect(e.message).toBe('error')
          }

          expect(commitSpy).toHaveBeenCalledTimes(2)

          spy.mockRestore()
          commitSpy.mockRestore()
        })
      })

      describe('when disabling a plugin', () => {
        it('should return early if the plugin is not enabled', async () => {
          expect(await store.dispatch('plugin/setEnabled', {
            enabled: false,
            pluginId: availablePlugins[1].config.id
          })).toBe(undefined)
        })

        it('should throw an error if it cannot disable the plugin', async () => {
          const spy = jest.spyOn(store._vm.$plugins, 'disablePlugin').mockImplementation(() => {
            throw new Error('error')
          })

          const commitSpy = jest.spyOn(store, 'commit')

          try {
            await store.dispatch('plugin/setEnabled', {
              enabled: false,
              pluginId: availablePlugins[0].config.id
            })
          } catch (e) {
            expect(e.message).toBe('error')
          }

          expect(commitSpy).toHaveBeenCalledTimes(2)

          spy.mockRestore()
          commitSpy.mockRestore()
        })
      })
    })

    describe('deletePlugin', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              installed: {
                [availablePlugins[0].config.id]: availablePlugins[0]
              }
            }
          }
        ))
      })

      it('should return early if plugin is not installed', async () => {
        expect(await store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[1].config.id })).toBe(undefined)
      })

      it.each(profiles)('should disable the plugin', async (profile) => {
        const spy = jest.spyOn(store, 'dispatch')

        await store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[0].config.id })

        expect(spy).toHaveBeenCalledWith('plugin/setEnabled', {
          enabled: false,
          pluginId: availablePlugins[0].config.id,
          profileId: profile.id
        })

        spy.mockRestore()
      })

      it.each(profiles)('should disable the plugin and delete its options', async (profile) => {
        const spy = jest.spyOn(store, 'dispatch')

        await store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[0].config.id, removeOptions: true })

        expect(spy).toHaveBeenCalledWith('plugin/setEnabled', {
          enabled: false,
          pluginId: availablePlugins[0].config.id,
          profileId: profile.id
        })
        expect(spy).toHaveBeenCalledWith('plugin/deletePluginOptionsForProfile', {
          pluginId: availablePlugins[0].config.id,
          profileId: profile.id
        })
        spy.mockRestore()
      })

      it('should try to delete the plugin for the given profile', async () => {
        const spy = jest.spyOn(store._vm.$plugins, 'deletePlugin')

        await store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[0].config.id })

        expect(spy).toHaveBeenCalledWith(availablePlugins[0].config.id)

        spy.mockRestore()
      })

      it('should log the error if deleting a plugin fails', async () => {
        const spy = jest.spyOn(store._vm.$plugins, 'deletePlugin').mockImplementation(() => {
          throw new Error('error')
        })

        await store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[0].config.id })

        expect(store._vm.$logger.error).toHaveBeenCalledWith("Could not delete 'plugin-1' plugin: error")

        spy.mockRestore()
      })
    })

    describe('deleteLoaded', () => {
      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {}
                }
              }
            }
          }
        ))
      })

      it('should return early if the plugin is not loaded', async () => {
        expect(await store.dispatch('plugin/deleteLoaded', {
          pluginId: availablePlugins[1].config.id
        })).toBe(undefined)
      })

      it.each([null, profile1.id])('should delete the loaded plugin', (profileId) => {
        expect(store.getters['plugin/loaded']).toEqual({
          [availablePlugins[0].config.id]: {}
        })

        store.dispatch('plugin/deleteLoaded', {
          pluginId: availablePlugins[0].config.id,
          profileId
        })

        expect(store.getters['plugin/loaded']).toEqual({})
      })
    })

    describe('deleteInstalled', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              installed: {
                [availablePlugins[0].config.id]: availablePlugins[0]
              }
            }
          }
        ))
      })

      it('should return early if the plugin is not installed', async () => {
        expect(await store.dispatch('plugin/deleteInstalled', availablePlugins[1].config.id)).toBe(undefined)
      })

      it('should delete the installed plugin', () => {
        expect(store.getters['plugin/installed']).toEqual([availablePlugins[0]])

        store.dispatch('plugin/deleteInstalled', availablePlugins[0].config.id)

        expect(store.getters['plugin/installed']).toEqual([])
      })
    })

    describe('setAvatars', () => {
      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true
                }
              },
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {
                    ...availablePlugins[0],
                    avatars: { 'avatar-1': 'avatar-1' }
                  }
                }
              }
            }
          }
        ))
      })

      it('should throw an error if the plugin is not enabled', () => {
        try {
          store.dispatch('plugin/setAvatars', {
            pluginId: availablePlugins[1].config.id,
            profileId: profile1.id
          })
        } catch (e) {
          expect(e.message).toBe('Plugin is not enabled')
        }
      })

      it.each([null, profile1.id])('should set the avatars if the plugin is enabled', (profileId) => {
        const spy = jest.spyOn(pluginManager, 'getAvatarComponents').mockImplementation(() => {
          return store.getters['plugin/loaded'][availablePlugins[0].config.id].avatars
        })

        expect(store.getters['plugin/avatars'](profile1.id)).toEqual([{
          component: 'avatar-1',
          name: 'avatar-1',
          pluginId: availablePlugins[0].config.id
        }])

        store.dispatch('plugin/setAvatars', {
          pluginId: availablePlugins[0].config.id,
          profileId,
          avatars: {
            'avatar-2': 'avatar-2'
          }
        })

        expect(store.getters['plugin/avatars'](profile1.id)).toEqual([{
          component: 'avatar-2',
          name: 'avatar-2',
          pluginId: availablePlugins[0].config.id
        }])

        spy.mockRestore()
      })
    })

    describe('setMenuItems', () => {
      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true
                }
              },
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {
                    menuItems: []
                  }
                }
              }
            }
          }
        ))
      })

      it('should throw an error if the plugin is not enabled', () => {
        try {
          store.dispatch('plugin/setMenuItems', {
            pluginId: availablePlugins[1].config.id,
            profileId: profile1.id
          })
        } catch (e) {
          expect(e.message).toBe('Plugin is not enabled')
        }
      })

      it.each([null, profile1.id])('should set the menu items if the plugin is enabled', (profileId) => {
        expect(store.getters['plugin/menuItems']).toEqual([])

        const menuItems = [
          { title: 'menu-item-1' },
          { title: 'menu-item-2' }
        ]

        store.dispatch('plugin/setMenuItems', {
          pluginId: availablePlugins[0].config.id,
          profileId,
          menuItems
        })

        expect(store.getters['plugin/menuItems']).toEqual(menuItems)
      })
    })

    describe('setThemes', () => {
      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true
                }
              },
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {
                    themes: {}
                  }
                }
              }
            }
          }
        ))
      })

      it('should throw an error if the plugin is not enabled', () => {
        try {
          store.dispatch('plugin/setThemes', {
            pluginId: availablePlugins[1].config.id,
            profileId: profile1.id
          })
        } catch (e) {
          expect(e.message).toBe('Plugin is not enabled')
        }
      })

      it.each([null, profile1.id])('should set the themes if the plugin is enabled', (profileId) => {
        expect(store.getters['plugin/themes']).toEqual({})

        store.dispatch('plugin/setThemes', {
          pluginId: availablePlugins[0].config.id,
          profileId,
          themes: {
            'theme-1': {}
          }
        })

        expect(store.getters['plugin/themes']).toEqual({ 'theme-1': {} })
      })
    })

    describe('setLanguages', () => {
      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true,
                  [availablePlugins[2].config.id]: true
                }
              },
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {
                    languages: {}
                  },
                  [availablePlugins[2].config.id]: {}
                }
              }
            }
          }
        ))
      })

      it('should throw an error if the plugin is not enabled', () => {
        try {
          store.dispatch('plugin/setLanguages', {
            pluginId: availablePlugins[1].config.id,
            profileId: profile1.id
          })
        } catch (e) {
          expect(e.message).toBe('Plugin is not enabled')
        }
      })

      it.each([null, profile1.id])('should set the languages if the plugin is enabled', (profileId) => {
        expect(store.getters['plugin/languages']).toEqual({})

        store.dispatch('plugin/setLanguages', {
          pluginId: availablePlugins[0].config.id,
          profileId,
          languages: {
            'language-1': {}
          }
        })

        expect(store.getters['plugin/languages']).toEqual({ 'language-1': {} })
      })
    })

    describe('setWalletTabs', () => {
      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true
                }
              },
              loaded: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: {}
                }
              }
            }
          }
        ))
      })

      it('should throw an error if the plugin is not enabled', async () => {
        try {
          await store.dispatch('plugin/setWalletTabs', {
            pluginId: availablePlugins[1].config.id,
            profileId: profile1.id
          })
        } catch (e) {
          expect(e.message).toBe('Plugin is not enabled')
        }
      })

      it.each([null, profile1.id])('should set the wallet tabs', (profileId) => {
        const spy = jest.spyOn(pluginManager, 'getWalletTabComponent').mockImplementation(() => 'tab-1-component')

        expect(store.getters['plugin/walletTabs']).toEqual([])

        store.dispatch('plugin/setWalletTabs', {
          pluginId: availablePlugins[0].config.id,
          profileId,
          walletTabs: [{
            name: 'tab-1',
            component: 'tab-1-component'
          }]
        })

        expect(store.getters['plugin/walletTabs']).toEqual([{
          name: 'tab-1',
          component: 'tab-1-component'
        }])

        spy.mockRestore()
      })
    })

    describe('setPluginOption', () => {
      beforeAll(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              enabled: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: true
                }
              }
            }
          }
        ))
      })

      it('should throw an error if the plugin is not enabled', async () => {
        try {
          await store.dispatch('plugin/setPluginOption', {
            pluginId: availablePlugins[1].config.id,
            profileId: profile1.id
          })
        } catch (e) {
          expect(e.message).toBe('Plugin is not enabled')
        }
      })

      it('should set the plugin option', async () => {
        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({})

        await store.dispatch('plugin/setPluginOption', {
          pluginId: availablePlugins[0].config.id,
          profileId: profile1.id,
          key: 'foo',
          value: 'bar'
        })

        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({ foo: 'bar' })

        await store.dispatch('plugin/setPluginOption', {
          pluginId: availablePlugins[0].config.id,
          profileId: profile1.id,
          key: 'bar',
          value: 'foo'
        })

        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({ foo: 'bar', bar: 'foo' })
      })

      it('should set a global plugin option', async () => {
        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, 'global')).toEqual({})

        await store.dispatch('plugin/setPluginOption', {
          pluginId: availablePlugins[0].config.id,
          profileId: 'global',
          key: 'foo',
          value: 'bar'
        })

        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, 'global')).toEqual({ foo: 'bar' })
      })
    })

    describe('deletePluginOptionsForProfile', () => {
      const options = { foo: 'bar' }

      beforeEach(() => {
        store.replaceState(merge(
          JSON.parse(JSON.stringify(initialState)),
          {
            plugin: {
              pluginOptions: {
                [profile1.id]: {
                  [availablePlugins[0].config.id]: options
                }
              }
            }
          }
        ))
      })

      it('should delete the plugin options when no profile id given', () => {
        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual(options)

        store.dispatch('plugin/deletePluginOptionsForProfile', {
          pluginId: availablePlugins[0].config.id
        })

        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({})
      })

      it('should delete the plugin options', () => {
        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual(options)

        store.dispatch('plugin/deletePluginOptionsForProfile', {
          pluginId: availablePlugins[0].config.id,
          profileId: profile1.id
        })

        expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({})
      })
    })
  })
})
