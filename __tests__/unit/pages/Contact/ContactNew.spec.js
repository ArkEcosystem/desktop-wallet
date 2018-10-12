import { mount } from '@vue/test-utils'
import ContactNew from '@/pages/Contact/ContactNew'

describe('pages > ContactNew', () => {
  const mountPage = () => {
    return mount(ContactNew, {
      mocks: {
        schema: {
          address: '',
          name: ''
        },
        session_network: {
          version: 30
        },
        $v: {
          model: {},
          step1: {},
          step2: {},
          schema: {
            address: {},
            name: {}
          }
        }
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
