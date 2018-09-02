import store from '@/store'
import Profile from '@/models/profile'
import Session from '@/models/session'
import sessionStore from '@/store/modules/session'

describe('Store > Modules > Session', () => {
  describe('getters . current', () => {
    it('should return the current session', () => {
      const current = new Session()
      const state = {
        all: [current]
      }

      expect(sessionStore.getters.current(state)).toEqual(current)
    })
  })

  describe('getters . currentProfile', () => {
    it('should return the current profile', () => {
      const currentProfile = new Profile({ name: 'myProfile' })
      const current = new Session({ profileId: currentProfile.id })

      const state = {
        all: [current]
      }
      const { getters } = sessionStore
      getters.current = current
      const rootGetters = {
        'profiles/byId': jest.fn(id => currentProfile)
      }

      expect(getters.currentProfile(state, getters, null, rootGetters)).toEqual(currentProfile)
      expect(rootGetters['profiles/byId']).toHaveBeenCalledWith(currentProfile.id)
    })
  })

  describe.each([
    ['avatar', 'avatar.png'],
    ['background', 'background.png'],
    ['currency', 'EUR'],
    ['language', 'en-US'],
    ['network', 'ark.mainnet'],
    ['theme', 'light']
  ])(
    'getters . %s', (property, value) => {
      describe(`when the ${property} has value on the session`, () => {
        it('should return the property value', () => {
          const current = new Session({ [property]: value })
          const state = { all: [current] }
          const getters = { current, currentProfile: {} }

          expect(sessionStore.getters[property](state, getters)).toEqual(value)
        })
      })

      describe(`when the ${property} does not have value on the session`, () => {
        it('should return the value from the current profile', () => {
          const currentProfile = new Profile({ [property]: value })
          const current = new Session()
          const state = { all: [current] }
          const getters = { current, currentProfile }

          expect(sessionStore.getters[property](state, getters)).toEqual(value)
        })
      })
    })

  describe('actions . ensure', () => {
  })

  describe('actions . set', () => {
    describe('when the session exists', () => {
      xit('should update it', () => {
      })
    })

    describe('when the session does not exist', () => {
      xit('should create it', () => {
      })
    })
  })

  describe('actions . reset', () => {
    describe('when there is a session', () => {
      it('should delete everything but the `profileId`', async () => {
        const currentProfile = new Profile({ name: 'first' })
        const current = new Session({ profileId: currentProfile.id, language: 'es-ES' })
        const resetSession = Session.fromObject({ profileId: current.profileId })

        const spy = jest.spyOn(store, 'dispatch')

        await store.dispatch('session/create', current)
        await store.dispatch('session/reset')

        expect(spy).toHaveBeenLastCalledWith('session/update', resetSession)
      })
    })
    describe('when there is not any session', () => {
      xit('shoud create one', () => {
      })
    })
  })
})
