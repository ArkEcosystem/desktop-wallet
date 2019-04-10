import { mount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { MenuStep, MenuStepItem } from '@/components/Menu'

const i18n = useI18nGlobally()

describe('MenuStep', () => {
  it('should render', () => {
    const wrapper = mount(MenuStep, {
      propsData: {
        step: 1
      },
      mocks: {
        collections_filterChildren: jest.fn()
      }
    })
    expect(wrapper.contains('.MenuStep')).toBeTruthy()
  })
})

describe('MenuStepItem', () => {
  const mountItem = propsData => {
    return mount(MenuStepItem, {
      i18n,
      propsData
    })
  }

  it('should render', () => {
    const wrapper = mountItem({
      title: 'Test',
      step: 1
    })

    expect(wrapper.contains('.MenuStepItem')).toBeTruthy()
    expect(wrapper.vm.$refs.collapse).toBeTruthy()
  })

  it('should trigger the handler', () => {
    const wrapper = mountItem({
      title: 'Test',
      step: 1
    })
    const handler = wrapper.find('.MenuStepItem__header')
    handler.trigger('click')
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('should emit the `back` event', async () => {
    const wrapper = mountItem({
      title: 'Test',
      step: 1
    })

    wrapper.vm.$refs.collapse.toggle()
    const back = wrapper.find('.MenuStepItem__footer__back-button')
    back.trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })

  describe('emitNext', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mountItem({
        title: 'Test',
        step: 1,
        isNextEnabled: true
      })
    })

    describe('when is the last item', () => {
      beforeEach(() => {
        wrapper.vm.isLastItem = true
      })

      describe('when the last item was not clicked', () => {
        it('should mark it as clicked', () => {
          expect(wrapper.vm.isLastItemClicked).toBeFalse()

          wrapper.vm.$refs.collapse.toggle()
          const next = wrapper.find('.MenuStepItem__footer__next-button')
          next.trigger('click')

          expect(wrapper.vm.isLastItemClicked).toBeTrue()
        })

        it('should emit the `next` event', async () => {
          wrapper.vm.$refs.collapse.toggle()
          const next = wrapper.find('.MenuStepItem__footer__next-button')
          next.trigger('click')

          expect(wrapper.emitted('next')).toBeTruthy()
        })
      })
    })

    describe('when the last item was clicked', () => {
      it('should not emit the `next` event', async () => {
        wrapper.vm.$refs.collapse.toggle()
        const next = wrapper.find('.MenuStepItem__footer__next-button')
        next.trigger('click')

        expect(wrapper.emitted('next')).toEqual([[]])
      })
    })
  })
})
