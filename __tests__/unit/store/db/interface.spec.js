import _ from 'lodash'
import DbInterface from '@/store/db/interface'
import Model from '@/models/model'

import PouchDB from 'pouchdb-browser' // eslint-disable-line
import { allDocsMock, createIndexMock, getMock, infoMock, putMock, putIfNotExistsMock, removeMock } from 'pouchdb-browser' // eslint-disable-line
import TestModel from '@tests/unit/__fixtures__/models/test-model'
import errorCapturer from '@tests/unit/__utils__/error-capturer'
import mockConsole from '@tests/unit/__utils__/mock-console'

const ignoreCreateIndex = () => {
  createIndexMock.mockImplementationOnce(_index => ({ result: 'exists' }))
}

describe('Store > Db > DbInterface', () => {
  let db
  let model
  let doc

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

    ignoreCreateIndex()

    model = new TestModel({ example: 'model-id' })
    doc = { example: model.example, modelType: model.modelType, _id: model.id }

    db = new DbInterface('test')

    createIndexMock.mockReset()
  })

  describe('static create', () => {
    beforeEach(ignoreCreateIndex)

    it('should return a new DbInterface', async () => {
      db = await DbInterface.create('name')

      expect(db).toBeInstanceOf(DbInterface)
    })

    it('should name the PouchDB as the `name` parameter', async () => {
      const name = 'example-name'
      db = await DbInterface.create(name)

      expect(PouchDB).toHaveBeenCalledWith(name)
    })

    it('should create the `modelType` index', () => {
      const name = 'modelType'
      const fields = [name]

      db = DbInterface.create()

      expect(createIndexMock).toHaveBeenCalledWith({ index: { name, fields } })
    })
  })

  describe('constructor', () => {
    it('should create and return a new PouchDB database', () => {
      const name = 'test-db'

      const newDb = new DbInterface(name)

      expect(PouchDB).toHaveBeenCalledWith(name)
      expect(newDb).toBeInstanceOf(DbInterface)
    })
  })

  describe('createIndex', () => {
    it('should create an index', async () => {
      const name = 'example'
      const fields = ['field-a', 'field-b']
      const index = { name, fields }

      createIndexMock.mockImplementationOnce(({ index }) => {
        if (index.name === name && index.fields === fields) {
          return { result: 'created' }
        }
        return { result: 'exists' }
      })

      expect(await db.createIndex(name, fields)).toBeTruthy()
      expect(createIndexMock).toHaveBeenCalledWith({ index })
    })

    describe('when there is an error', () => {
      mockConsole('error')

      let error

      beforeEach(() => {
        error = new Error('fake')

        createIndexMock.mockImplementationOnce(_ => {
          throw error
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.createIndex())

        expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/index/i), error)
      })

      it('should throw the error', async () => {
        expect(await errorCapturer(db.createIndex())).toThrow(error)
      })
    })
  })

  describe('find', () => {
    it('should return a Model instance', async () => {
      getMock.mockImplementationOnce(id => id === model.id ? doc : null)

      const result = await db.find(model.id)
      expect(result).toBeInstanceOf(TestModel)
      expect(result).toEqual(model)
      expect(getMock).toHaveBeenCalledWith(model.id)
    })

    describe('when the Model does not exist', () => {
      it('should return `null`', async () => {
        const model = new TestModel({ example: 'not-save-doc' })
        expect(await db.find(model)).toBeNull()
      })
    })

    describe('when there is an error', () => {
      beforeEach(() => {
        getMock.mockImplementationOnce(_ => {
          throw new Error('fake')
        })
      })

      it('should return `null`', async () => {
        expect(await db.find('bad')).toBeNull()
      })
    })
  })

  describe('get', () => {
    it('should return a Model instance', async () => {
      getMock.mockImplementationOnce(id => id === model.id ? doc : null)

      const result = await db.get(model.id)
      expect(result).toBeInstanceOf(TestModel)
      expect(result).toEqual(model)
      expect(getMock).toHaveBeenCalledWith(model.id)
    })

    describe('when there is an error', () => {
      mockConsole('error')

      let error

      beforeEach(() => {
        error = new Error('fake')

        getMock.mockImplementationOnce(_ => {
          throw error
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.get('id'))

        expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/get.*id/i), error)
      })

      it('should throw the error', async () => {
        expect(await errorCapturer(db.get())).toThrow(error)
      })
    })
  })

  describe('getAllByType', () => {
    it('should return an Array of instances of the same Model subclass', async () => {
      const modelType = 'test-model'
      const models = [
        new TestModel({ example: 'example-1' }),
        new TestModel({ example: 'example-2' }),
        new TestModel({ example: 'example-3' })
      ]
      const rows = [
        { doc: models[0].doc },
        { doc: models[1].doc },
        { doc: models[2].doc }
      ]

      allDocsMock.mockImplementationOnce(options => {
        const endkey = `${modelType}\ufff0`
        if (options.include_docs && options.startkey === modelType && options.endkey === endkey) {
          return { rows }
        }
      })

      const result = await db.getAllByType(modelType)
      expect(result).toBeArray()
      expect(result).toHaveLength(models.length)
      expect(result).toEqual(models)
    })

    describe('when there is an error', () => {
      mockConsole('error')

      let error

      beforeEach(() => {
        error = new Error('fake')

        allDocsMock.mockImplementationOnce(_ => {
          throw error
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.getAllByType('wrongType'))

        expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/get.*all.*wrongType/i), error)
      })

      it('should throw the error', async () => {
        expect(await errorCapturer(db.getAllByType())).toThrow(error)
      })
    })
  })

  describe('query', () => {
  })

  describe('create', () => {
    it('should save the Model as a document and return it updated', async () => {
      const _rev = 'revision-1'

      putIfNotExistsMock.mockImplementationOnce(docToCreate => {
        if (_.isEqual(docToCreate, model.doc)) {
          return { updated: true, rev: _rev }
        }

        return { updated: false }
      })

      const result = await db.create(model)
      const updatedModel = new TestModel(Object.assign(model.doc, { _rev }))

      expect(result).toBeInstanceOf(TestModel)
      expect(result).toEqual(updatedModel)
      expect(putIfNotExistsMock).toHaveBeenCalledWith(model.doc)
    })

    describe('when the document already exists', () => {
      mockConsole('error')

      it('should throw an Error', async () => {
        putIfNotExistsMock.mockImplementationOnce(_ => {
          return { updated: false }
        })

        expect(await errorCapturer(db.create(model))).toThrow(/id.*exist/i)
      })
    })

    describe('when there is an error', () => {
      mockConsole('error')

      let error

      beforeEach(() => {
        error = new Error('fake')

        putIfNotExistsMock.mockImplementationOnce(_ => {
          throw error
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.create(model))

        expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/creat.*id/i), error)
      })

      it('should throw the error', async () => {
        expect(await errorCapturer(db.create(model))).toThrow(error)
      })
    })
  })

  describe('store', () => {
    it('should store the Model as a document and return it updated', async () => {
      const _rev = '1-rev'

      putMock.mockImplementationOnce(docToStore => {
        if (_.isEqual(docToStore, model.doc)) {
          return { ok: true, rev: _rev }
        }

        return { ok: false }
      })

      const result = await db.store(model)
      const updatedModel = new TestModel(Object.assign(model.doc, { _rev }))

      expect(result).toBeInstanceOf(TestModel)
      expect(result).toEqual(updatedModel)
      expect(putMock).toHaveBeenCalledWith(model.doc)
    })

    describe('when PouchDB does not confirm the operation', () => {
      mockConsole('error')

      beforeEach(() => {
        putMock.mockImplementationOnce(_ => {
          return { ok: false }
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.store(model))

        expect(console.error).toHaveBeenCalledWith(
          expect.stringMatching(/stor.*id/i),
          expect.any(Error)
        )
      })

      it('should throw the error', async () => {
        expect(await errorCapturer(db.store(model))).toThrow(/unknown.*pouchdb/i)
      })
    })

    describe('when there is other kind of error', () => {
      mockConsole('error')

      let error

      beforeEach(() => {
        error = new Error('fake')

        putMock.mockImplementationOnce(_ => {
          throw error
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.store(model))

        expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/stor.*id/i), error)
      })

      it('should throw the error', async () => {
        expect(await errorCapturer(db.store(model))).toThrow(error)
      })
    })
  })

  describe('update', () => {
    describe('when the document of the Model already exists', () => {
      it('should update the last revision and return the updated version', async () => {
        const updatedModel = new TestModel(Object.assign(model.doc, { _rev: 'new-rev' }))

        db.get = jest.fn(() => updatedModel)
        db.store = jest.fn(modelToStore => {
          if (_.isEqual(modelToStore, updatedModel)) {
            return updatedModel
          }
        })

        expect(await db.update(model)).toEqual(updatedModel)
      })
    })

    describe('when the document of the Model does not exist', () => {
      mockConsole('error')

      beforeEach(() => {
        getMock.mockImplementationOnce(id => {
          return null
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.update(model))

        expect(console.error).toHaveBeenCalledWith(
          expect.stringMatching(/updat.*inexistent.*id/i),
          expect.any(Error)
        )
      })

      it('should throw an Error', async () => {
        expect(await errorCapturer(db.update(model))).toThrow(/id.*not.*exist/i)
      })
    })

    describe('when there is an Error', () => {
      mockConsole('error')

      let error

      beforeEach(() => {
        error = new Error('fake')

        db.get = jest.fn(() => model)
        db.store = jest.fn(() => {
          throw error
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.update(model))

        expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/updat.*id/i), error)
      })

      it('should throw the error', async () => {
        expect(await errorCapturer(db.update(model))).toThrow(error)
      })
    })
  })

  describe('delete', () => {
    describe('when the Model exists', () => {
      it('should delete the Model as a document', async () => {
        const _rev = 'rev-last'
        const updatedDoc = Object.assign(doc, { _rev })

        getMock.mockImplementationOnce(id => {
          return id === model.id ? updatedDoc : null
        })

        removeMock.mockImplementationOnce(docToRemove => {
          return { ok: _.isEqual(docToRemove, updatedDoc) }
        })

        const result = await db.delete(model)
        expect(result).toBeTruthy()
        expect(getMock).toHaveBeenCalledWith(model.id)
        expect(removeMock).toHaveBeenCalledWith(doc)
      })
    })

    describe('when the Model does not exist', () => {
      mockConsole('error')

      beforeEach(() => {
        getMock.mockImplementationOnce(id => {
          return null
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.delete(model))

        expect(console.error).toHaveBeenCalledWith(
          expect.stringMatching(/delet.*inexistent.*id/i),
          expect.any(Error)
        )
      })

      it('should throw the error', async () => {
        expect(await errorCapturer(db.delete(model))).toThrow(/id.*not.*exist/)
      })
    })

    describe('when there is an Error', () => {
      mockConsole('error')

      let error

      beforeEach(() => {
        error = new Error('fake')

        getMock.mockImplementationOnce(id => {
          return id === model.id ? Object.assign(doc, { _rev: 'rev-x' }) : null
        })

        removeMock.mockImplementationOnce(_ => {
          throw error
        })
      })

      it('should log the error', async () => {
        await errorCapturer(db.delete(model))

        expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/delet.*id/i), error)
      })

      it('should throw the error', async () => {
        expect(await errorCapturer(db.delete(model))).toThrow(error)
      })
    })
  })
})
