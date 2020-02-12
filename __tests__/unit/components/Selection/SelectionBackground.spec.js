import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { SelectionBackground } from '@/components/Selection'
import StringsMixin from '@/mixins/strings'

const i18n = useI18nGlobally()

describe('SelectionBackground', () => {
  describe('SelectionBackground', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(SelectionBackground, {
        i18n,
        mixins: [StringsMixin]
      })

      expect(wrapper.contains('.SelectionBackgroundGrid')).toBeTruthy()
    })
  })
})
