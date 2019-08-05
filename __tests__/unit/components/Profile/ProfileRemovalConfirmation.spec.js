import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { ProfileRemovalConfirmation } from '@/components/Profile'

const i18n = useI18nGlobally()
let wrapper

const profile = { id: 'my profile' }
const $store = {}
const $router = {}

const mountComponent = ({ profiles } = {}) => {
  $router.push = jest.fn()
  $store.dispatch = jest.fn()
  $store.getters = {
    'profile/all': profiles
  }

  return shallowMount(ProfileRemovalConfirmation, {
    i18n,
    propsData: {
      profile
    },
    mocks: {
      $router,
      $store
    }
  })
}

beforeEach(() => {
  wrapper = mountComponent()
})

describe('ProfileRemovalConfirmation', () => {
  it('should render modal', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('removeProfile', () => {
    describe('when there are several profiles', () => {
      const profile2 = { id: 'two' }

      beforeEach(() => {
        wrapper = mountComponent({
          profiles: [profile, profile2]
        })
      })

      it('should set other profile before removal', () => {
        wrapper.vm.removeProfile()

        expect($store.dispatch.mock.calls[0]).toEqual(['session/setProfileId', profile2.id])
      })

      it('should delete the profile', () => {
        wrapper.vm.removeProfile()

        expect($store.dispatch.mock.calls[1]).toEqual(['profile/delete', profile])
      })

      it('should emit the `removed` event', () => {
        wrapper.vm.removeProfile()

        expect(wrapper.emitted('removed'))
      })
    })

    describe('when there is only 1 profile', () => {
      beforeEach(() => {
        wrapper = mountComponent({
          profiles: [profile]
        })
      })

      it('should reset the session before removal', () => {
        wrapper.vm.removeProfile()

        expect($store.dispatch.mock.calls[0]).toEqual(['session/reset'])
      })

      it('should delete the profile', () => {
        wrapper.vm.removeProfile()

        expect($store.dispatch.mock.calls[1]).toEqual(['profile/delete', profile])
      })

      it('should redirect to the profile creation page', () => {
        wrapper.vm.removeProfile()

        expect($router.push).toHaveBeenCalledWith({ name: 'profile-new' })
      })

      it('should emit the `removed` event', () => {
        wrapper.vm.removeProfile()

        expect(wrapper.emitted('removed'))
      })
    })
  })
})
