import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import installI18n from '../../__utils__/i18n'
import { InputPublicKey } from '@/components/Input'
import transaction from '../../__fixtures__/models/transaction'

const localVue = createLocalVue()
const i18n = installI18n(localVue)
localVue.use(Vuelidate)

let wrapper
const createWrapper = (component, propsData) => {
  component = component || InputPublicKey
  propsData = propsData || {
    value: ''
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    propsData,
    sync: false
  })
}

describe('InputPublicKey', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.InputPublicKey')).toBe(true)
  })

  it('should update model if value property is updated', async () => {
    expect(wrapper.vm.inputValue).toBe('')

    wrapper.setProps({
      value: 'test'
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$v.model.$model).toEqual('test')
    expect(wrapper.vm.inputValue).toBe('test')
  })

  it('should return an error if invalid input', () => {
    wrapper.vm.$v.model.$model = 'test'

    expect(wrapper.vm.error).toBeTruthy()
  })

  it('should reset the value', async () => {
    wrapper.vm.$v.model.$model = 'test'

    expect(wrapper.vm.model).toBe('test')

    wrapper.vm.reset()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.model).toBe('')
    expect(wrapper.vm.error).toBeFalsy()
  })

  describe('validation', () => {
    it('should check if valid public key is entered', () => {
      const spy = jest.spyOn(Identities.Address, 'fromPublicKey')

      wrapper.vm.model = 'test'

      expect(wrapper.vm.$v.model.isValid).toBe(false)

      wrapper.vm.model = transaction.senderPublicKey

      expect(wrapper.vm.$v.model.isValid).toBe(true)
      expect(spy).toHaveBeenCalledTimes(2)

      spy.mockRestore()
    })

    it('should not check if not required and empty', () => {
      wrapper.setProps({
        isRequired: false
      })

      const spy = jest.spyOn(Identities.Address, 'fromPublicKey')

      wrapper.vm.model = ''

      expect(wrapper.vm.$v.model.isValid).toBe(true)
      expect(spy).not.toHaveBeenCalled()

      wrapper.vm.model = 'test'

      expect(wrapper.vm.$v.model.isValid).toBe(false)
      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })
  })
})
