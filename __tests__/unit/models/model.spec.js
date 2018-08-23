import Model from '@/models/model'
import { ValidatorResult } from 'jsonschema'

import TestModel from '@tests/unit/__fixtures__/models/test-model'
import Empty from '@tests/unit/__fixtures__/models/empty'
import Rigid from '@tests/unit/__fixtures__/models/rigid'

describe('Models > Model', () => {
  let emptyModel
  let testModel

  beforeEach(() => {
    Object.defineProperty(Model, 'modelType', {
      get () {
        return {
          requireContext: require.context('../__fixtures__/models', true, /\.js$/),
          separator: '~'
        }
      }
    })

    emptyModel = new Empty()
    testModel = new TestModel()
  })

  describe('static fromDoc', () => {
    it('should return a new instance of a children class of Model based on the `modelType` property', () => {
      const emptyDoc = { modelType: 'empty' }
      const emptyModel = Model.fromDoc(emptyDoc)
      expect(emptyModel).toBeInstanceOf(Empty)

      const testDoc = { modelType: 'test-model', example: 'example-value' }
      const testModel = Model.fromDoc(testDoc)
      expect(testModel).toBeInstanceOf(TestModel)
      expect(testModel.example).toEqual('example-value')
    })
  })

  describe('constructor', () => {
    describe('when the `schema` property is not implemented', () => {
      it('should throw an Error', () => {
        expect(() => new Model()).toThrow(/schema.*implemented/i)
      })
    })

    describe('when validating that the data adheres to the schema', () => {
      it('should throw an Error if it does not', () => {
        expect(() => new Rigid({ integer: '1.2' })).toThrow(/error.*integer/i)
      })

      it('should ignore the required properties', () => {
        expect(() => new Rigid({ integer: '1.2' })).not.toThrow(/date/i)
      })
    })

    describe('when the data adheres to the `schema`', () => {
      it('should establish the `_rev` property', () => {
        const _rev = 'rev-1'
        const model = new Empty({ _rev })
        expect(model._rev).toEqual(_rev)
      })

      it('should freeze the `_rev` property of the instace', () => {
        expect(testModel._rev).toBeFrozen()
      })

      it('should establish the `modelType` property', () => {
        expect(emptyModel.modelType).toEqual('empty')
        expect(testModel.modelType).toEqual('test-model')
      })

      it('should freeze the `modelType` property of the instace', () => {
        expect(testModel.modelType).toBeFrozen()
      })

      it('should seal the `__data` property of the instance', () => {
        expect(testModel.modelType).toBeSealed()
      })

      it('should define getters that returns the data', () => {
        const model = new Rigid({ integer: 1 })
        expect(model.integer).toEqual(1)
      })

      it('should define getters that returns `undefined`', () => {
        const model = new Rigid({ integer: 1 })
        expect(model.date).toBeUndefined()
      })

      it('should define setters that fail', () => {
        expect(() => (testModel.example = 'something')).toThrow(/example.*read-only/i)
      })
    })
  })

  describe('get _id', () => {
    it('should return the value of the `id` property', () => {
      testModel = new TestModel({ example: 'example-value' })

      expect(testModel._id).toEqual('test-model~example-value')
      expect(testModel._id).toEqual(testModel.id)

      testModel.__data.example = 'tampered'
      expect(testModel._id).toEqual('test-model~tampered')
      expect(testModel._id).toEqual(testModel.id)
    })
  })

  describe('get _id', () => {
    describe('when it is not overridden', () => {
      it('should throw an Error', () => {
        expect(() => emptyModel._id).toThrow(/id.*implemented/i)
      })
    })
  })

  describe('get data', () => {
    it('should return all properties', () => {
      const model = new Rigid({ integer: 1 })
      expect(model.data).toEqual({
        integer: 1,
        date: undefined
      })
    })
  })

  describe('get doc', () => {
    describe('when it is valid', () => {
      it('should throw an Error', () => {
        const model = new Rigid({ integer: 12 })
        expect(() => model.doc).toThrow(/rigid~12.*date/i)
      })
    })

    it('should return all properties that should be stored on the db', () => {
      const example = 'one example'
      const model = new TestModel({ example })
      expect(model.doc).toEqual({
        modelType: 'test-model',
        _id: 'test-model~one example',
        _rev: undefined,
        example
      })
    })

    it('should convert the dates to ISO Strings', () => {
      const date = new Date('2018-09-24')
      const model = new Rigid({ integer: 1, date })
      expect(model.doc).toEqual({
        modelType: 'rigid',
        _id: 'rigid~1',
        _rev: undefined,
        integer: 1,
        date: date.toISOString()
      })
    })
  })

  describe('get schema', () => {
    describe('when it is not overridden', () => {
      it('should not allow instantiating a Model', () => {
        expect(() => new Model()).toThrow(/schema.*implemented/i)
      })
    })
  })

  describe('validate', () => {
    it('should validate that the instance adheres to the `schema` property', () => {
      const model = new Rigid({ integer: 1 })
      expect(model.validate()).toBeInstanceOf(ValidatorResult)
    })
  })

  describe('Model.modelType', () => {
    it('should use "~" as the default separator', () => {
      expect(Model.modelType.separator).toEqual('~')
    })
  })
})
