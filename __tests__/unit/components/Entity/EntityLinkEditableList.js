import { createLocalVue, mount } from '@vue/test-utils'
import Vuelidate from 'vuelidate'
import installI18n from '../../__utils__/i18n'
import { EntityLinkEditableList } from '@/components/Entity'

const createWrapper = (options) => {
  const localVue = createLocalVue()
  localVue.use(Vuelidate)
  const i18n = installI18n(localVue)

  return mount(EntityLinkEditableList, {
    ...options,
    i18n,
    localVue
  })
}

describe('EntityLinkEditableList', () => {
  it('should render with source control options', () => {
    const wrapper = createWrapper({
      propsData: {
        type: 'sourceControl'
      }
    })
    wrapper.find('.MenuDropdownHandler').trigger('click')
    expect(wrapper.text()).toContain('GitHub')
    expect(wrapper.text()).toContain('BitBucket')
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should render with social media options', () => {
    const wrapper = createWrapper({
      propsData: {
        type: 'socialMedia'
      }
    })
    wrapper.find('.MenuDropdownHandler').trigger('click')
    expect(wrapper.text()).toContain('Instagram')
    expect(wrapper.text()).toContain('Facebook')
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should add only a valid link', async () => {
    const wrapper = createWrapper({
      propsData: {
        type: 'socialMedia'
      }
    })
    const linkInput = wrapper.find('.EntityLinkEditableList__input input')
    const addBtn = wrapper.find('.EntityLinkEditableList__add-link')

    expect(addBtn.attributes('disabled')).toBeTruthy()

    wrapper.find('.MenuDropdownHandler').trigger('click')

    const options = wrapper.findAll('.MenuDropdownItem__button')
    options.at(2).trigger('click')

    linkInput.setValue('https://instagram.com/ark')
    await wrapper.vm.$nextTick()

    expect(addBtn.attributes('disabled')).toBeFalsy()
  })

  it('should display static links', async () => {
    const wrapper = createWrapper({
      propsData: {
        type: 'sourceControl',
        links: [
          { type: 'github', value: 'https://github.com/ark' },
          { type: 'gitlab', value: 'https://gitlab.com/ark' }
        ]
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('https://github.com/ark')
    expect(wrapper.text()).toContain('https://gitlab.com/ark')
  })

  it('should remove links', async () => {
    const wrapper = createWrapper({
      propsData: {
        type: 'sourceControl',
        links: [
          { type: 'github', value: 'https://github.com/ark' },
          { type: 'gitlab', value: 'https://gitlab.com/ark' }
        ]
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('https://github.com/ark')

    wrapper.findAll('.EntityLinkEditableList__remove-button').at(0).trigger('click')

    expect(wrapper.text()).not.toContain('https://github.com/ark')
    expect(wrapper.text()).toContain('https://gitlab.com/ark')
  })
})
