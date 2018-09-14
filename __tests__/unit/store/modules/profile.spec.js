import store from '@/store'

describe('ProfileModule', () => {
  it('should getter all profiles', () => {
    expect(store.getters['profile/all']).toBeEmpty()
  })

  it('should fail to create a new profile', () => {
    expect(
      () => store.dispatch('profile/create', { id: 'test' })
    ).toThrow()
  })
})
