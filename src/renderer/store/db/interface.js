import PouchDB from 'pouchdb-browser'
import PouchUpsert from 'pouchdb-upsert'
import PouchFind from 'pouchdb-find'
import PouchLiveFind from 'pouchdb-live-find'

import Model from '@/models/model'

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
  static async create (name) {
    const db = new DbInterface(name)

    await db.createIndex('__modelType', ['__modelType'])

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
   * Finds a document by the id, and returns the associated Model.
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
   * @param {Model} model
   * @return {Model} the updated model (with the revision)
   */
  async store (model) {
    try {
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
   * @param {Model} model
   * @return {Model} the updated model (with the revision)
   */
  async update (model) {
    try {
      if (this.get(model.id)) {
        return this.store(model)
      }

      throw new Error(`The document \`${model.id}\` does not exist`)
    } catch (error) {
      console.error(`Error updating \`${model.id}\``, error)
      throw error
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
