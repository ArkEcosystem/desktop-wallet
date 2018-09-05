import { mount } from '@vue/test-utils'
import { PassphraseWords } from '@/components/Passphrase'

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
