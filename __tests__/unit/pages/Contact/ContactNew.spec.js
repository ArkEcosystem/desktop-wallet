import { mount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import ContactNew from '@/pages/Contact/ContactNew'

const i18n = useI18nGlobally()

describe('pages > ContactNew', () => {
  const mountPage = () => {
    return mount(ContactNew, {
      i18n,
      mocks: {
        schema: {
          address: '',
          name: ''
        },
        session_network: {
          version: 30
        },
        $store: {
        },
        $v: {
          model: {},
          schema: {
            address: {},
            name: {}
          }
        },
        wallet_name: value => value
      }
    })
  }

  it('should have the right name', () => {
    const wrapper = mountPage()
    expect(wrapper.name()).toEqual('ContactNew')
  })

  it('should render component', () => {
    const wrapper = mountPage()
    expect(wrapper.contains('.ContactNew')).toBeTruthy()
  })
})
