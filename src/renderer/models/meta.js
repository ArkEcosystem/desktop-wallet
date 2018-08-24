import Model from './model'

/**
 * This Model will be used to perform migrations
 */
export default class Meta extends Model {
  get id () {
    return [this.modelType, this.version].join(Model.modelType.separator)
  }

  get schema () {
    return {
      properties: {
        version: {
          type: 'string'
        }
      }
    }
  }
}
