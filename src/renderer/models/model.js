import _ from 'lodash'
import { validate } from 'jsonschema'

/**
 * This class provides a way to interact with the PouchDB through the DbInterface
 * class.
 *
 * The idea is working with objects that cannot be mutated with wrong data by
 * accident, or in that case, warn the programmer soon:
 *  - When trying to create a new Model with wrong data (although,  it admits incomplete data)
 *  - When trying to add, delete or modify a property that has not been authorized
 *  - When trying to store the data on the db
 *
 * Apart from that, this class, along with the DbInterface, abstract away the
 * document revisions (the `_rev` property) and transform the data to the format
 * that PouchDB expects, to make things easier.
 *
 * About the nomenclature:
 *  - Properties that start with 1 underscore ("_") are reserved by PouchDB.
 *  - PouchDB does not accept any property that starts with underscore ("_").
 *  - Properties that start with 2 underscore ("__") are part of the private interface
 * of this class.
 */
export default class Model {
  /**
   * Configuration of the models
   * @return {Object}
   */
  static get modelType () {
    return {
      requireContext: require.context('@/models', true, /\.js$/),
      separator: '~'
    }
  }

  /**
   * This method uses the `modelType` property to instantiate and return
   * a new Model subclass
   * @param {Object} doc
   * @return {Model}
   */
  static fromDoc (doc) {
    if (!doc.modelType) {
      throw new Error('To create a Model from a document is necessary a `modelType`')
    }

    const context = Model.modelType.requireContext
    const ModelType = context(`./${doc.modelType}.js`).default
    return new ModelType(doc)
  }

  /**
   * This constructor performs all the required steps to set up the instances of
   * the Model subclasses:
   *  - Establish the `_rev` of the internal document. This is the only way to set it.
   *  - Validates that the received data follows the defined `schema` or throws an Error.
   *    It ignores the `required` properties that are missing yet.
   *  - Stores all the data in a "private" property (`__data`). That property is
   *    sealed to avoid unintended side effects and make it harder that, somehow
   *    the data is corrupted.
   *  - Uses the `schema` to define getters around that `__data` property.
   *    The usage of setters is discouraged, but it is possible by overriding them.
   */
  constructor (data = {}) {
    // It is necessary to avoid any side effect
    const internalData = _.cloneDeep(data)

    this._rev = internalData._rev
    Object.freeze(this._rev)
    delete internalData._rev

    // TODO as static ?
    const schema = _.cloneDeep(this.schema)
    delete schema.required
    const validation = validate(internalData, schema)

    if (!validation.valid) {
      const errors = validation.errors.map(error => error.stack).join(', ')
      throw new Error(`\`${this.constructor.name}\` cannot be instantiated due errors: ${errors}`)
    }

    // This property cannot change by any reason
    this.modelType = _.kebabCase(this.constructor.name)
    Object.freeze(this.modelType)

    this.__data = {}

    // All possible properties could be accessed, although they might return `undefined`
    const properties = Object.keys(this.schema.properties).reduce((all, propertyName) => {
      this.__data[propertyName] = internalData[propertyName]

      all[propertyName] = {
        enumerable: true,
        get () {
          return this.__data[propertyName]
        }
      }

      // Detect if there is a setter on the class, to use it, or throw the Error TODO update tests
      const proto = Object.getPrototypeOf(this)
      const descriptor = Object.getOwnPropertyDescriptor(proto, propertyName)

      all[propertyName].set = function (newValue) {
        if (descriptor && descriptor.set) {
          descriptor.set.call(this, newValue)
        } else {
          throw new Error(`The property \`${propertyName}\` is read-only. To change that, override this setter on the model`)
        }
      }

      return all
    }, {})

    Object.defineProperties(this, properties)
    Object.seal(this.__data)
  }

  /**
   * This property is an alias of the `id` property. This one is used by PouchDB
   * as the internal ID of the document.
   * @return {String}
   */
  get _id () {
    return this.id
  }

  /**
   * This property defines the unique ID of the model. It is used to index all
   * the documents on the database.
   * It should be composed using this pattern `<modelType><separator><modelID>`
   * where `<separator>` is defined by `Model.modelType.separator` and `<modelID>`
   * could be any String that it is different for each model, such as a hash, a
   * combination of attributes, etc.
   * @return {String}
   */
  get id () {
    throw new Error('THE `id` PROPERTY SHOULD BE IMPLEMENTED')
  }

  /**
   * The `data` property exposes the public data of each model.
   * @return {Object}
   */
  get data () {
    return this.__data
  }

  /**
   * The `doc` property returns the data that would be stored on the db. That
   * includes the `_id`, `_rev` and `modelType` properties.
   * Some kind of properties, such as `Date` objects are converted to Strings to
   * keep a consistent behaviour (https://pouchdb.com/errors.html#could_not_be_cloned).
   * It validates the data before to ensure that the data adheres to the schema.
   * @return {Object}
   */
  get doc () {
    const validation = this.validate()

    if (!validation.valid) {
      const errors = validation.errors.map(error => error.stack).join(', ')
      throw new Error(`The instance \`${this.id}\` of \`${this.constructor.name}\` contains errors: ${errors}`)
    }

    const data = _.transform(this.data, (result, value, key) => {
      if (_.isDate(value)) {
        result[key] = value.toISOString()
      } else {
        result[key] = value
      }
    }, {})

    return Object.assign(data, {
      modelType: this.modelType,
      _rev: this._rev,
      _id: this._id
    })
  }

  /**
   * @see https://json-schema.org
   * @return {Object}
   */
  get schema () {
    throw new Error('THE `schema` PROPERTY SHOULD BE IMPLEMENTED')
  }

  /**
   * Validate the current instance
   * @return {ValidatorResult}
   */
  validate () {
    return validate(this.data, this.schema)
  }
}
