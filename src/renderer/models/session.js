import Model from './model'
import Profile from './profile'

export default class Session extends Model {
  /**
   * Create Session Model object from an Object.
   * @param  {Object}  object Object to store against the session
   * @return {Session}
   */
  static fromObject (data) {
    return new Session(data)
  }

  static get schema () {
    // The session has all the properties of the profile, except the `name`
    const properties = Object.assign({}, Profile.schema.properties, {
      profileId: {
        type: ['null', 'string'] // `null` when there isn't any profile yet
      }
    })
    delete properties.name

    return {
      required: ['profileId'],
      properties
    }
  }

  constructor (data = {}) {
    super(Object.assign({}, data, { modelType: 'session' }))
  }

  /**
   * Currently we only have 1 session, but in the future this could change, like
   * 1 session per profile.
   * @return {String}
   */
  get id () {
    return [this.modelType, 'current'].join(Model.modelType.separator)
  }
}
