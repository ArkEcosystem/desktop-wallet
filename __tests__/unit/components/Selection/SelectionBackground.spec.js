import { shallowMount } from '@vue/test-utils'
import { SelectionBackground } from '@/components/Selection'

describe('SelectionBackground', () => {
  describe('SelectionBackground', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(SelectionBackground)

      expect(wrapper.contains('.SelectionBackgroundGrid')).toBeTruthy()
    })
  })
})
