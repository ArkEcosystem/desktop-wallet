import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { ModalConfirmation } from '@/components/Modal'

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = shallowMount(ModalConfirmation, {
    i18n
  })
})
describe('ModalConfirmation', () => {
  it('should render modal', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should render buttons', () => {
    expect(wrapper.findAll('button')).toHaveLength(2)
    expect(wrapper.find('.ModalConfirmation__cancel-button').isVisible())
    expect(wrapper.find('.ModalConfirmation__continue-button').isVisible())
  })

  it('should be possible to hide the cancel button', () => {
    wrapper = shallowMount(ModalConfirmation, {
      i18n,
      propsData: {
        showCancelButton: false
      }
    })
    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(wrapper.find('.ModalConfirmation__cancel-button').exists()).toBe(false)
    expect(wrapper.find('.ModalConfirmation__continue-button').isVisible())
  })

  it('should default portal target to "modal"', () => {
    expect(wrapper.props('portalTarget')).toBe('modal')
  })

  it('should change portal target', () => {
    wrapper = shallowMount(ModalConfirmation, {
      i18n,
      propsData: {
        portalTarget: 'test'
      }
    })
    expect(wrapper.props('portalTarget')).toBe('test')
  })
})
