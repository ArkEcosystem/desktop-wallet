import store from '@/store'
import { getMock, putMock, putIfNotExistsMock, removeMock } from 'pouchdb-browser'

let doc
getMock.mockImplementation(() => {
  return doc
})
putMock.mockImplementation(() => {
  return { ok: true, rev: 'revision-1' }
})
putIfNotExistsMock.mockImplementation(docToCreate => {
  return { updated: true, rev: 'revision-1' }
})
removeMock.mockImplementation(() => {
  return { ok: true }
})

beforeAll(async () => {
  await store.dispatch('session/ensure')
})
beforeEach(async () => {
  doc = {
    'current-profile': null,
    modelType: 'session',
    _id: 'session'
  }
  await store.dispatch('session/reset')
})

describe('session store modules', () => {
  it('should set the correct value in the store', async () => {
    expect(store.getters['session/get']('current-profile')).toEqual(null)

    await store.dispatch('session/set', {
      'current-profile': 'TEST'
    })

    expect(store.getters['session/get']('current-profile')).toEqual('TEST')
  })

  it('should not set an invalid value in the store', async () => {
    expect(store.getters['session/get']('current-profile')).toEqual(null)

    await store.dispatch('session/set', {
      'current-profile': false
    })

    expect(store.getters['session/get']('current-profile')).toEqual(null)
  })
})
