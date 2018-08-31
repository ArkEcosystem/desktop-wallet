import DbModule from '@/store/modules/db-module'

import db from '@/store/db/instance'
import Model from '@/models/model'
import TestModel from '@tests/unit/__fixtures__/models/test-model'
import RigidModel from '@tests/unit/__fixtures__/models/rigid'

describe('Store > Modules > DbModule', () => {
  const model1 = { id: 'model1' }
  const model2 = { id: 'model2' }

  let dbModule
  let testModel
  let rigidModel

  beforeEach(() => {
    Object.defineProperty(Model, 'modelType', {
      enumerable: true,
      get () {
        return {
          requireContext: '@tests/unit/__fixtures__/models',
          separator: '~'
        }
      }
    })

    testModel = new TestModel({ example: 'store-example' })
    rigidModel = new RigidModel({ integer: 1 })

    dbModule = new DbModule('example')
  })

  describe('getters . all', () => {
    it('returns all the models', () => {
      const state = dbModule.state = {
        all: [{}]
      }

      expect(dbModule.getters.all(state)).toEqual(state.all)
    })
  })

  describe('getters . byId', () => {
    it('returns all the models', () => {
      const state = dbModule.state = {
        all: [model1, testModel, model2]
      }

      expect(dbModule.getters.byId(state)(testModel.id)).toEqual(testModel)
    })
  })

  describe('mutations . CREATE', () => {
    it('should update the Model on the store', () => {
      const state = dbModule.state = {
        all: [model1, model2]
      }

      dbModule.mutations.CREATE(state, testModel)

      expect(state.all).toIncludeSameMembers([model1, testModel, model2])
    })

    describe('when the Model already exists in the store', () => {
      it('should throw an Error', () => {
        const state = dbModule.state = {
          all: [model1, testModel, model2]
        }

        expect(() => dbModule.mutations.CREATE(state, testModel)).toThrow(/creat.*exist/)
      })
    })
  })

  describe('mutations . DELETE', () => {
    it('should remove the Model from the store', () => {
      const state = dbModule.state = {
        all: [model1, testModel, model2]
      }

      dbModule.mutations.DELETE(state, testModel)

      expect(state.all).toEqual([model1, model2])
    })

    describe('when the Model does not exist in the store', () => {
      it('should throw an Error', () => {
        const state = dbModule.state = {
          all: [model1, model2]
        }

        expect(() => dbModule.mutations.DELETE(state, testModel)).toThrow(/delete.*exist/)
      })
    })
  })

  describe('mutations . STORE', () => {
    describe('when the Model exists on the store', () => {
      it('should update it', () => {
        const state = dbModule.state = {
          all: [model1, rigidModel, model2]
        }
        const updatedModel = new RigidModel({ integer: rigidModel.integer, date: new Date() })

        dbModule.mutations.STORE(state, updatedModel)

        expect(state.all).toIncludeSameMembers([model1, updatedModel, model2])
      })
    })

    describe('when the Model does not exist on the store', () => {
      it('should add it', () => {
        const state = dbModule.state = {
          all: [model1, model2]
        }
        dbModule.mutations.STORE(state, testModel)

        expect(state.all).toIncludeSameMembers([model1, testModel, model2])
      })
    })
  })

  describe('mutations . UPDATE', () => {
    it('should update the Model on the store', () => {
      const state = dbModule.state = {
        all: [model1, rigidModel, model2]
      }
      const updatedModel = new RigidModel({ integer: rigidModel.integer, date: new Date() })

      dbModule.mutations.UPDATE(state, updatedModel)

      expect(state.all).toIncludeSameMembers([model1, updatedModel, model2])
    })

    describe('when the Model does not exist in the store', () => {
      it('should throw an Error', () => {
        const state = dbModule.state = {
          all: [model1, model2]
        }

        expect(() => dbModule.mutations.UPDATE(state, testModel)).toThrow(/update.*exist/)
      })
    })
  })

  describe('actions . create', () => {
    it('should update the Model from the db', async () => {
      db.create = jest.fn()

      const commit = jest.fn()
      await dbModule.actions.create({ commit }, testModel)

      expect(db.create).toHaveBeenCalledWith(testModel)
    })

    it('should apply the CREATE mutation to the Model', async () => {
      const commit = jest.fn()
      await dbModule.actions.create({ commit }, testModel)
      expect(commit).toHaveBeenCalledWith('CREATE', testModel)
    })
  })

  describe('actions . delete', () => {
    it('should delete the Model from the db', async () => {
      db.delete = jest.fn()

      const commit = jest.fn()
      await dbModule.actions.delete({ commit }, testModel)

      expect(db.delete).toHaveBeenCalledWith(testModel)
    })

    it('should apply the DELETE mutation to the Model', async () => {
      const commit = jest.fn()
      await dbModule.actions.delete({ commit }, testModel)
      expect(commit).toHaveBeenCalledWith('DELETE', testModel)
    })
  })

  describe('actions . store', () => {
    it('should update the Model from the db', async () => {
      db.store = jest.fn()

      const commit = jest.fn()
      await dbModule.actions.store({ commit }, testModel)

      expect(db.store).toHaveBeenCalledWith(testModel)
    })

    it('should apply the STORE mutation to the Model', async () => {
      const commit = jest.fn()
      await dbModule.actions.store({ commit }, testModel)
      expect(commit).toHaveBeenCalledWith('STORE', testModel)
    })
  })

  describe('actions . update', () => {
    it('should update the Model from the db', async () => {
      db.update = jest.fn()

      const commit = jest.fn()
      await dbModule.actions.update({ commit }, testModel)

      expect(db.update).toHaveBeenCalledWith(testModel)
    })

    it('should apply the UPDATE mutation to the Model', async () => {
      const commit = jest.fn()
      await dbModule.actions.update({ commit }, testModel)
      expect(commit).toHaveBeenCalledWith('UPDATE', testModel)
    })
  })
})
