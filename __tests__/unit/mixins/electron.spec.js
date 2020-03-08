import { createLocalVue, shallowMount } from '@vue/test-utils'
import useI18n from '../__utils__/i18n'
import ElectronMixin from '@/mixins/electron'
import electron from 'electron'

jest.mock('electron', () => ({
  remote: {
    dialog: {
      showOpenDialog: jest.fn(),
      showSaveDialog: jest.fn()
    }
  }
}))

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  readFileSync: jest.fn()
}))

describe('Mixins > Electron', () => {
  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue()
    const i18n = useI18n(localVue)

    const TestComponent = {
      name: 'TestComponent',
      template: '<div/>'
    }

    wrapper = shallowMount(TestComponent, {
      localVue,
      i18n,
      mixins: [ElectronMixin]
    })
  })

  describe('electron_writeFile', () => {
    let showSaveDialogMock

    beforeEach(() => {
      showSaveDialogMock = jest.spyOn(electron.remote.dialog, 'showSaveDialog').mockImplementation(() => ({
        filePath: 'filePath'
      }))
    })

    afterEach(() => {
      showSaveDialogMock.mockRestore()
    })

    it('should return early when the obtained filePath is falsy', async () => {
      showSaveDialogMock = jest.spyOn(electron.remote.dialog, 'showSaveDialog').mockImplementation(() => ({
        filePath: undefined
      }))

      await expect(wrapper.vm.electron_writeFile()).resolves.toEqual(undefined)
    })

    describe('when passing filters', () => {
      const defaultFilters = [
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]

      it('should not modify a FileFilter array', async () => {
        const filters = [{
          name: 'FOOBAR', extensions: ['foobar']
        }]

        await wrapper.vm.electron_writeFile('raw', 'path', { filters })

        expect(showSaveDialogMock).toHaveBeenCalledWith({
          defaultPath: 'path',
          filters
        })
      })

      it('should parse a single string correctly', async () => {
        const filters = [{
          name: 'FOOBAR', extensions: ['foobar']
        }]

        await wrapper.vm.electron_writeFile('raw', 'path', { filters: 'foobar' })

        expect(showSaveDialogMock).toHaveBeenCalledWith({
          defaultPath: 'path',
          filters
        })
      })

      it('should parse an array of strings correctly', async () => {
        const filters = [
          { name: 'FOO', extensions: ['foo'] },
          { name: 'BAR', extensions: ['bar'] }
        ]

        await wrapper.vm.electron_writeFile('raw', 'path', { filters: ['foo', 'bar'] })

        expect(showSaveDialogMock).toHaveBeenCalledWith({
          defaultPath: 'path',
          filters
        })
      })

      it.each([null, undefined])('should fallback to the default filters when filters is falsy', async (filters) => {
        await wrapper.vm.electron_writeFile('raw', 'path', { filters })

        expect(showSaveDialogMock).toHaveBeenCalledWith({
          defaultPath: 'path',
          filters: defaultFilters
        })
      })
    })

    describe('when restricting the file path', () => {
      it('should not throw an error if the given filepath is valid', async () => {
        showSaveDialogMock = jest.spyOn(electron.remote.dialog, 'showSaveDialog').mockImplementation(() => ({
          filePath: '/home/foo/bar'
        }))

        await expect(wrapper.vm.electron_writeFile(null, null, { restrictToPath: '/home/foo' })).resolves.not.toThrow()
      })

      it('should throw an error if the given filepath is invalid', async () => {
        showSaveDialogMock = jest.spyOn(electron.remote.dialog, 'showSaveDialog').mockImplementation(() => ({
          filePath: '/home/bar/foo'
        }))

        await expect(wrapper.vm.electron_writeFile(null, null, { restrictToPath: '/home/foo' })).rejects.toThrow()
      })
    })
  })

  describe('electron_readFile', () => {
    let showOpenDialogMock

    beforeEach(() => {
      showOpenDialogMock = jest.spyOn(electron.remote.dialog, 'showOpenDialog').mockImplementation(() => ({
        filePaths: ['filePath']
      }))
    })

    afterEach(() => {
      showOpenDialogMock.mockRestore()
    })

    it('should return early when the obtained filePaths is falsy', async () => {
      showOpenDialogMock = jest.spyOn(electron.remote.dialog, 'showOpenDialog').mockImplementation(() => ({
        filePaths: undefined
      }))

      await expect(wrapper.vm.electron_readFile()).resolves.toEqual(undefined)
    })

    describe('when restricting the file path', () => {
      it('should not throw an error if the given filepath is valid', async () => {
        showOpenDialogMock = jest.spyOn(electron.remote.dialog, 'showOpenDialog').mockImplementation(() => ({
          filePaths: ['/home/foo/bar']
        }))

        await expect(wrapper.vm.electron_readFile(null, { restrictToPath: '/home/foo' })).resolves.not.toThrow()
      })

      it('should throw an error if the given filepath is invalid', async () => {
        showOpenDialogMock = jest.spyOn(electron.remote.dialog, 'showOpenDialog').mockImplementation(() => ({
          filePaths: ['/home/bar/foo']
        }))

        await expect(wrapper.vm.electron_readFile(null, { restrictToPath: '/home/foo' })).rejects.toThrow()
      })
    })
  })
})
