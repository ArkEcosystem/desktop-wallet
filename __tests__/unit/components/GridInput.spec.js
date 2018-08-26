import { shallowMount } from '@vue/test-utils'
import { GridInput, GridInputItem, GridInputPopup } from '@/components/GridInput'

describe('GridInput', () => {
  const mocks = () => {
    return {
      $t: jest.fn(() => 'translation'),
      $i18n: {
        t: jest.fn(() => 'translation')
      }
    }
  }

  describe('GridInput', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(GridInput, {
        mocks: mocks(),
        propsData: {
          items: [],
          itemKey: 'src'
        }
      })

      expect(wrapper.contains('.GridInput')).toBeTruthy()
    })
  })

  describe('GridInputItem', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(GridInputItem, {
        mocks: mocks(),
        propsData: {
          isSelected: false,
          title: 'Example title'
        }
      })

      expect(wrapper.contains('.GridInputItem')).toBeTruthy()
    })
  })

  describe('GridInputPopup', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(GridInputPopup, {
        mocks: mocks(),
        propsData: {
          items: [],
          itemKey: 'src'
        }
      })

      expect(wrapper.contains('.GridInputPopup')).toBeTruthy()
    })
  })
})
