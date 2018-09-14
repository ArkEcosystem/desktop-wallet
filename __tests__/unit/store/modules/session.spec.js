import store from '@/store'
import { I18N } from '@config'

describe('Session', () => {
  it('should reset session', () => {
    expect(store.getters['session/language']).toBeNull()
    store.dispatch('session/reset')
    expect(store.getters['session/language']).toBe(I18N.defaultLocale)
  })
})
