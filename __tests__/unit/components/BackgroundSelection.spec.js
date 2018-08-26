import { shallowMount } from '@vue/test-utils'
import { BackgroundSelection } from '@/components/BackgroundSelection'

describe('BackgroundSelection', () => {
  const mocks = () => {
    return {
      $t: jest.fn(),
      $i18n: {
        t: jest.fn()
      }
    }
  }

  describe('BackgroundSelection', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(BackgroundSelection, {
        mocks: mocks()
      })

      expect(wrapper.contains('.BackgroundSelection')).toBeTruthy()
    })
  })
})
