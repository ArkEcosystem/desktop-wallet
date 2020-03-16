import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { AppSidemenu } from '@/components/App'

jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn()
  }
}))

let wrapper

const push = jest.fn()
const mockData = {
  session_profile: {
    avatar: 'mock_avatar',
    name: 'Mock Name'
  },
  $store: {
    getters: {
      'announcements/unread': () => 0,
      'plugin/menuItems': () => [],
      'plugin/avatar': () => 'pluginAvatar',
      'updater/hasAvailableRelease': () => false
    }
  },
  $route: {
    name: 'mock_route'
  },
  $router: {
    push
  },
  $t: () => 'Mock Translation',
  $refs: {
    settings: {
      showSettings: jest.fn()
    }
  }
}

const stubs = { RouterLink: RouterLinkStub }

const createWrapper = (propsData = {}, mocks = mockData) => {
  wrapper = shallowMount(AppSidemenu, {
    propsData,
    mocks,
    stubs
  })
}

describe('AppSidemenu', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.contains('.AppSidemenu')).toBeTruthy()
  })

  it('should be vertical by default', () => {
    expect(wrapper.contains('.AppSidemenu--vertical')).toBeTruthy()
  })

  it('should be horizontal when isHorizontal is true', () => {
    createWrapper({
      isHorizontal: true
    })
    expect(wrapper.contains('.AppSidemenu--horizontal')).toBeTruthy()
  })

  it('should be vertical when isHorizontal is false', () => {
    createWrapper({
      isHorizontal: false
    })
    expect(wrapper.contains('.AppSidemenu--vertical')).toBeTruthy()
  })

  it('should detect standard avatar', () => {
    expect(wrapper.vm.hasStandardAvatar).toBeTruthy()
    expect(wrapper.vm.pluginAvatar).toBe(null)
  })

  it('should get plugin avatar if enabled', () => {
    createWrapper(undefined, {
      ...mockData,
      session_profile: {
        name: 'Mock Name',
        avatar: {
          pluginId: true
        }
      }
    })
    expect(wrapper.vm.hasStandardAvatar).toBe(false)
    expect(wrapper.vm.pluginAvatar).toBe('pluginAvatar')
  })

  it('should set active item', () => {
    const navName = 'newNavItem'
    wrapper.vm.setActive(navName)
    expect(wrapper.vm.activeItem).toBe(navName)
  })

  it('should do a redirect', () => {
    const name = 'redirectNavItem'
    wrapper.vm.redirect(name)
    expect(push).toHaveBeenCalledWith({ name })
    expect(wrapper.vm.activeItem).toBe(name)
  })

  it('should set important notification visible state', () => {
    expect(wrapper.vm.isImportantNotificationVisible).toBe(true)
    wrapper.vm.hideImportantNotification()
    expect(wrapper.vm.isImportantNotificationVisible).toBe(false)
  })

  describe('Plugin Menu', () => {
    it('should toggle & close plugin menu state', () => {
      expect(wrapper.vm.isPluginMenuVisible).toBe(false)
      wrapper.vm.toggleShowPluginMenu()
      expect(wrapper.vm.isPluginMenuVisible).toBe(true)
      wrapper.vm.closeShowPlugins()
      expect(wrapper.vm.isPluginMenuVisible).toBe(false)
    })

    it('should activate the plugin menu item when \'setActive\' is true', () => {
      expect(wrapper.vm.activeItem).toBe('mock_route')
      wrapper.vm.closeShowPlugins(true)
      expect(wrapper.vm.activeItem).toBe('plugin-pages')
    })
  })
})
