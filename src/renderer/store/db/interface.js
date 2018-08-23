import PouchDB from 'pouchdb-browser'
import PouchDebug from 'pouchdb-debug'
import PouchUpsert from 'pouchdb-upsert'
import PouchFind from 'pouchdb-find'
import PouchLiveFind from 'pouchdb-live-find'

import Model from '@/models/model'

PouchDB.plugin(PouchDebug)

if (!process.env.IS_WEB) {
  PouchDB.debug.enable('*')
} else {
  PouchDB.debug.disable()
}

PouchDB.plugin(PouchUpsert)
PouchDB.plugin(PouchFind)
PouchDB.plugin(PouchLiveFind)

/**
 * This class wraps the PouchDB interface to provide some methods that deal with
 * the revisions (`_rev`) automatically.
 */
class DbInterface {
  /**
   * Creates an instance of DbInterface and the main index
   * @param {String} name
   * @return {DbInterface}
   */
  static create (name) {
    const db = new DbInterface(name)

    db.createIndex('modelType', ['modelType'])

    return db
  }

  /**
   * @param {String} name
   */
  constructor (name) {
    this.__db = new PouchDB(name)
  }

  /**
   * @param {String} name
   * @param {Array} fields
   * @return {Boolean} if the index was created of already exists
   */
  async createIndex (name, fields) {
    try {
      const { result } = await this.__db.createIndex({
        index: { name, fields }
      })
      return result === 'created'
    } catch (error) {
      console.error(`Error creating the index \`${name}\``, error)
      throw error
    }
  }

  /**
   * Finds a document by the id, and returns the associated Model. If the document
   * does not exist, it return `null`
   * @param {String} id
   * @return {(Model|null)}
   */
  async find (id) {
    try {
      const doc = await this.__db.get(id)
      return Model.fromDoc(doc)
    } catch (error) {
      return null
    }
  }

  /**
   * Gets a document by the id, and returns the associated Model. If the document
   * does not exist, it throws an Error.
   * @param {String} id
   * @return {Model}
   */
  async get (id) {
    try {
      const doc = await this.__db.get(id)
      return Model.fromDoc(doc)
    } catch (error) {
      console.error(`Error getting \`${id}\``, error)
      throw error
    }
  }

  /**
   * Returns all the documents of a specific type.
   *
   * Under the hood uses `pouch.allDocs`, which is the recommended way to get several
   * documents.
   * @see {@link https://pouchdb.com/guides/queries.html#avoiding-map-reduce}
   *
   * @param {String} modelType
   * @return {Object}
   */
  async getAll (modelType) {
    try {
      const { rows } = await this.__db.allDocs({ startkey: modelType, include_docs: true })
      return rows.map(row => Model.fromDoc(row.doc))
    } catch (error) {
      console.error(`Error getting all documents of \`${modelType}\` type `, error)
      throw error
    }
  }

  /**
   * Perform a query on the db.
   *
   * Currently uses `pouch.allDocs`, although `find` would admit more complex queries.
   * The usage of this method is discouraged. Usually `getAll` is enough.
   * @see {@link https://pouchdb.com/api.html#batch_fetch}
   *
   * @param {Object} query
   * @param {Boolean} query.models - by default this method would return models
   * @return {Object}
   */
  async query (query) {
    try {
      const options = Object.assign({ include_docs: true }, query)
      const result = await this.__db.allDocs(options)
      return result.rows.map(row => Model.fromDoc(row.doc))
    } catch (error) {
      console.error(`Error quering the db with \`${query}\``, error)
      throw error
    }
  }

  /**
   * This method creates a new document on the db.
   * @param {Model} model
   * @return {Model} the updated model (with the revision)
   */
  async create (model) {
    try {
      const { updated, rev } = await this.__db.putIfNotExists(model.doc)

      if (updated) {
        return Model.fromDoc(Object.assign(model.doc, { _rev: rev }))
      }

      throw new Error(`The document \`${model.id}\` already exists`)
    } catch (error) {
      console.error(`Error creating \`${model.id}\``, error)
      throw error
    }
  }

  /**
   * This method replaces a document on the db if it exists or creates a new one.
   * It does not check the revision, so it could add a new revision.
   * @param {Model} model
   * @return {Model} the updated model (with the revision)
   */
  async store (model) {
    try {
      // Store the document, even creating a new revision
      const { ok, rev } = await this.__db.put(model.doc)

      if (ok) {
        return Model.fromDoc(Object.assign(model.doc, { _rev: rev }))
      }

      throw new Error(`Unknown PouchDB error`)
    } catch (error) {
      console.error(`Error storing \`${model.id}\``, error)
      throw error
    }
  }

  /**
   * This method updates a document on the db.
   * It ensures that replacing the document with the last revision.
   * @param {Model} model
   * @return {Model} the updated model (with the revision)
   */
  async update (model) {
    try {
      // Get the last revision to replace that document
      const { _id, _rev } = await this.get(model.id)

      if (_id) {
        const updatedModel = Model.fromDoc(Object.assign(model.doc, { _rev }))
        return this.store(updatedModel)
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        console.error(`Error updating inexistent \`${model.id}\``, error)
        throw new Error(`The document \`${model.id}\` does not exist`)
      } else {
        console.error(`Error updating \`${model.id}\``, error)
        throw error
      }
    }
  }

  /**
   * This method removes a document from the db.
   * @param {Model} model
   * @return {Boolean}
   */
  async delete (model) {
    try {
      // The `remove` method needs the `_id` and the `_rev`, retrieving the model
      // from the db is the best way to be sure that the `_rev` is up-to-date
      const updatedModel = await this.get(model.id)

      if (updatedModel) {
        const { ok } = this.__db.remove(updatedModel.doc)
        return ok
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        console.error(`Error deleting inexistent \`${model.id}\``, error)
        throw new Error(`The document \`${model.id}\` does not exist`)
      } else {
        console.error(`Error deleting \`${model.id}\``, error)
        throw error
      }
    }
  }
}

export default DbInterface
