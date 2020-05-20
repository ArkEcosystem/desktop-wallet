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

  describe('when the password is shorter than the minimum', () => {
    it('should provide feedback about it', () => {
      const value = 'aaaa0000'
      mountData.propsData.value = value
      mountData.propsData.minLength = value.length + 1
      const wrapper = mount(InputPassword, mountData)

      expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.TOO_SHORT')
    })
  })

  describe('when the password does not include a lowercase character', () => {
    it('should provide feedback about it', () => {
      mountData.propsData.value = 'A123'
      mountData.propsData.minLength = 2
      const wrapper = mount(InputPassword, mountData)

      expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.LOWER_CASE')
    })
  })

  describe('when the password does not include an uppercase character', () => {
    it('should provide feedback about it', () => {
      mountData.propsData.value = 'a123'
      mountData.propsData.minLength = 2
      const wrapper = mount(InputPassword, mountData)

      expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.UPPER_CASE')
    })
  })

  describe('when the password does not include a number', () => {
    it('should provide feedback about it', () => {
      mountData.propsData.value = 'aB'
      mountData.propsData.minLength = 2
      const wrapper = mount(InputPassword, mountData)

      expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.NUMBERS')
    })
  })

  describe('when the password does not include a special character', () => {
    it('should provide feedback about it', () => {
      mountData.propsData.value = 'aB0'
      mountData.propsData.minLength = 2
      const wrapper = mount(InputPassword, mountData)

      expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.SPECIAL_CHARACTERS')
    })
  })

  describe('when the password follows all the constraints', () => {
    it('should not provide feedback', () => {
      const value = 'aB1+'
      mountData.propsData.value = value
      mountData.propsData.minLength = value.length
      const wrapper = mount(InputPassword, mountData)

      expect(wrapper.vm.passwordFeedback()).toEqual('')
    })
  })
})
