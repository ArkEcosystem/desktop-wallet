import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { PassphraseWords } from '@/components/Passphrase'

Vue.use(Vuelidate)

describe('PassphraseWords', () => {
  const passphraseWords = ['test', 'check', 'verify', 'true', 'false', 'validate', 'ignore', 'shoulder']
  let wrapper

  beforeEach(() => {
    wrapper = mount(PassphraseWords, {
      propsData: {
        passphraseWords
      }
    })
  })

  it('should render', () => {
    expect(wrapper.contains('.PassphraseWords')).toBeTruthy()
  })

  it('should display an `InputText` per word', () => {
    const inputs = wrapper.findAll('.InputText')
    expect(inputs).toHaveLength(passphraseWords.length)
  })
})
