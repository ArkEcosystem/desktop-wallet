import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { InputGrid, InputGridItem, InputGridModal } from '@/components/Input/InputGrid'

const i18n = useI18nGlobally()

describe('InputGrid', () => {
  describe('InputGrid', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(InputGrid, {
        i18n,
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
        i18n,
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
        i18n,
        propsData: {
          items: [],
          itemKey: 'src'
        }
      })

      expect(wrapper.contains('.InputGridModal')).toBeTruthy()
    })
  })
})
