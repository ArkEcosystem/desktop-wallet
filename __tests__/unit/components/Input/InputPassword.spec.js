import { mount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { InputPassword } from '@/components/Input'

const i18n = useI18nGlobally()
let mountData

beforeEach(() => {
  mountData = {
    i18n,
    propsData: {
      name: 'test',
      label: 'test'
    },
    mocks: {
      $v: {
        model: {}
      }
    }
  }
})

describe('InputPassword', () => {
  it('should render', () => {
    const wrapper = mount(InputPassword, mountData)
    expect(wrapper.contains('.InputPassword')).toBeTruthy()
  })

  it('should render with v-model', () => {
    const value = 'testing'
    mountData.propsData.value = value
    const wrapper = mount(InputPassword, mountData)
    expect(wrapper.vm.value).toBe(value)
    const input = wrapper.find('.InputPassword__input')
    expect(input.element.value).toBe(value)
  })

  it('should be disabled', () => {
    mountData.propsData.isDisabled = true
    const wrapper = mount(InputPassword, mountData)
    const input = wrapper.find('.InputPassword__input')
    expect(input.attributes().disabled).toBe('disabled')
  })

  it('should show a helper text', () => {
    const helperText = 'testing'
    mountData.propsData.helperText = helperText
    const wrapper = mount(InputPassword, mountData)
    const helper = wrapper.find('.InputField__helper')
    expect(helper.text()).toBe(helperText)
  })

  describe('when focus', () => {
    it('should focus the input', async () => {
      const wrapper = mount(InputPassword, mountData)
      await wrapper.vm.focus()
      expect(wrapper.vm.isFocused).toBeTrue()
    })

    it('should emit the `focus` event', async () => {
      const wrapper = mount(InputPassword, mountData)
      await wrapper.vm.focus()
      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })
})
