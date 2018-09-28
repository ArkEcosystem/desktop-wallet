import { shallowMount } from '@vue/test-utils'
import { InputGrid, InputGridItem, InputGridModal } from '@/components/Input/InputGrid'

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

  describe('InputGridModal', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(InputGridModal, {
        propsData: {
          items: [],
          itemKey: 'src'
        }
      })

      expect(wrapper.contains('.InputGridModal')).toBeTruthy()
    })
  })
})
