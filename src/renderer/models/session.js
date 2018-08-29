import Model from './model'

export default class Session extends Model {
  /**
   * Create Session Model object from an Object.
   * @param  {Object}  object Object to store against the session
   * @return {Session}
   */
  static fromObject (data) {
    return new Session(data)
  }

  static get id () {
    return 'session'
  }

  get id () {
    return Session.id
  }

  get schema () {
    return {
      required: ['current-profile'],
      properties: {
        'current-profile': {
          type: ['null', 'string']
        }
      }
    }
  }
}
