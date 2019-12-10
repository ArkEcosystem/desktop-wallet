import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { InputText } from '@/components/Input'
import useI18nGlobally from '../../__utils__/i18n'

Vue.use(Vuelidate)

describe('InputText', () => {
  it('should render', () => {
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test'
      }
    })
    expect(wrapper.contains('.InputText')).toBeTruthy()
  })

  it('should render with v-model', () => {
    const value = 'testing'
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test',
        value
      }
    })
    expect(wrapper.vm.value).toBe(value)
    const input = wrapper.find('.InputText__input')
    expect(input.element.value).toBe(value)
  })

  it('should be disabled', () => {
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test',
        isDisabled: true
      }
    })
    const input = wrapper.find('.InputText__input')
    expect(input.attributes().disabled).toBe('disabled')
  })

  it('should be dirty', () => {
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test',
        value: 'testing'
      }
    })
    expect(wrapper.vm.isDirty).toBeTrue()
  })

  it('should show a helper text', () => {
    const helperText = 'testing'
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test',
        helperText
      }
    })
    const helper = wrapper.find('.InputField__helper')
    expect(helper.text()).toBe(helperText)
  })

  describe('when focus', () => {
    it('should focus the input', () => {
      const wrapper = mount(InputText, {
        propsData: {
          name: 'test',
          label: 'test'
        }
      })
      wrapper.vm.focus()
      expect(wrapper.vm.isFocused).toBeTrue()
    })

    it('should emit the `focus` event', () => {
      const wrapper = mount(InputText, {
        propsData: {
          name: 'test',
          label: 'test'
        }
      })
      wrapper.vm.focus()
      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })

  describe('when vendorfield contains a bip39 passphrase', () => {
    let wrapper

    const i18n = useI18nGlobally()
    const mocks = {
      session_profile: {
        bip39Language: 'english'
      }
    }

    beforeEach(() => {
      wrapper = mount(InputText, {
        propsData: {
          name: 'vendorField',
          label: 'vendorField',
          bip39Warning: true
        },
        i18n,
        mocks,
        sync: false
      })
    })

    it('should show a warning', async () => {
      wrapper.find('.InputText input').setValue('one video jaguar gap soldier ill hobby motor bundle couple trophy smoke')

      wrapper.vm.$v.$touch()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.warning).toBeTruthy()

      const helper = wrapper.find('.InputField__helper')
      expect(helper.text()).toMatch(/BIP39/)
    })

    it('should show a warning when it contains spaces at the end', async () => {
      wrapper.find('.InputText input').setValue('one video jaguar gap soldier ill hobby motor bundle couple trophy smoke   ')

      wrapper.vm.$v.$touch()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.warning).toBeTruthy()

      const helper = wrapper.find('.InputField__helper')
      expect(helper.text()).toMatch(/BIP39/)
    })

    it('should show a warning when it contains spaces at the front', async () => {
      wrapper.find('.InputText input').setValue('   one video jaguar gap soldier ill hobby motor bundle couple trophy smoke')

      wrapper.vm.$v.$touch()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.warning).toBeTruthy()

      const helper = wrapper.find('.InputField__helper')
      expect(helper.text()).toMatch(/BIP39/)
    })

    it('should show a warning when it contains additional spaces in between', async () => {
      wrapper.find('.InputText input').setValue('one video jaguar   gap soldier ill hobby   motor bundle couple trophy smoke')

      wrapper.vm.$v.$touch()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.warning).toBeTruthy()

      const helper = wrapper.find('.InputField__helper')
      expect(helper.text()).toMatch(/BIP39/)
    })
  })
})
