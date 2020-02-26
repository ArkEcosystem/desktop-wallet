import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginInstallModal } from '@/components/PluginManager/PluginManagerModals'

jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
    removeListener: jest.fn()
  }
}))

const i18n = useI18nGlobally()
let wrapper

const plugin = {
  id: 'test',
  source: 'source'
}

const availablePlugin = {
  config: {
    id: 'test',
    source: 'store-source'
  }
}

const mocks = {
  $store: {
    getters: {
      'plugin/availableById': jest.fn(() => availablePlugin)
    }
  },
  formatter_bytes: jest.fn(bytes => bytes),
  formatter_percentage: jest.fn()
}

beforeEach(() => {
  wrapper = mount(PluginInstallModal, {
    i18n,
    mocks,
    propsData: {
      plugin
    },
    stubs: {
      Portal: '<div><slot /></div>'
    }
  })

  wrapper.setData({
    progress: {
      percent: 0.5,
      transferredBytes: 50,
      totalBytes: 100
    }
  })
})

afterEach(() => {
  wrapper.destroy()
})

describe('PluginInstallModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('Methods', () => {
    it('should emit install event', () => {
      wrapper.vm.emitInstall()
      expect(wrapper.emitted('install')).toBeTruthy()
    })

    describe('emitDownload', () => {
      it('should emit download event with plugin source', () => {
        wrapper.vm.emitDownload()
        expect(wrapper.emitted('download', plugin.source)).toBeTruthy()
      })

      it('should emit download event with available plugin source if update', () => {
        wrapper.setProps({ isUpdate: true })
        wrapper.vm.emitDownload()
        expect(wrapper.emitted('download', availablePlugin.config.source)).toBeTruthy()
      })
    })

    describe('emitClose', () => {
      it('should emit close event', () => {
        wrapper.vm.emitClose()
        expect(wrapper.emitted('close')).toBeTruthy()
      })

      it('should call cancel()', () => {
        jest.spyOn(wrapper.vm, 'cancel')
        wrapper.vm.emitClose()
        expect(wrapper.vm.cancel).toHaveBeenCalled()
      })

      it('should call cleanup() if download failed', () => {
        wrapper.setData({ isDownloadFailed: true })
        jest.spyOn(wrapper.vm, 'cleanup')
        wrapper.vm.emitClose()
        expect(wrapper.vm.cleanup).toHaveBeenCalled()
      })
    })
  })
})
