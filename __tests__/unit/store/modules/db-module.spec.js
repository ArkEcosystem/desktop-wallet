import DbModule from '@/store/modules/db-module'

describe('Store > Modules > DbModule', () => {
  let dbModule

  beforeEach(() => {
    dbModule = new DbModule('example')
  })

  describe('getters', () => {
    describe('all', () => {
      it('returns all the models', () => {
        const state = {
          all: [{}]
        }

        dbModule.state = state

        expect(dbModule.getters.all(state)).toEqual(state.all)
      })
    })
  })
})
