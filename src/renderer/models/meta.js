import Model from './model'

/**
 * This Model will be used to perform migrations
 */
export default class Meta extends Model {
  static get schema () {
    return {
      properties: {
        version: {
          type: 'string'
        }
      }
    }
  }

  constructor (data) {
    super(Object.assign(data, { modelType: 'meta' }))
  }

  get id () {
    return [this.modelType, this.version].join(Model.modelType.separator)
  }
}
