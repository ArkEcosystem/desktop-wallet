import { shallowMount } from '@vue/test-utils'
import { SelectionBackground } from '@/components/Selection'

describe('SelectionBackground', () => {
  const mocks = () => {
    return {
      $t: jest.fn(),
      $i18n: {
        t: jest.fn()
      },
      assets_loadImage: jest.fn()
    }
  }

  describe('SelectionBackground', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(SelectionBackground, {
        mocks: mocks()
      })

      expect(wrapper.contains('.SelectionBackground')).toBeTruthy()
    })
  })
})
