import { shallowMount } from '@vue/test-utils'
import { InputGrid, InputGridItem, InputGridPopup } from '@/components/InputGrid'

describe('InputGrid', () => {
  describe('InputGrid', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(InputGrid, {
        propsData: {
          items: [],
          itemKey: 'src'
        }
      })

      expect(wrapper.contains('.InputGrid')).toBeTruthy()
    })
  })

  describe('InputGridItem', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(InputGridItem, {
        propsData: {
          isSelected: false,
          title: 'Example title'
        }
      })

      expect(wrapper.contains('.InputGridItem')).toBeTruthy()
    })
  })

  describe('InputGridPopup', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(InputGridPopup, {
        propsData: {
          items: [],
          itemKey: 'src'
        }
      })

      expect(wrapper.contains('.InputGridPopup')).toBeTruthy()
    })
  })
})
