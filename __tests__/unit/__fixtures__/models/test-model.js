import Model from '@/models/model'

export default class TestModel extends Model {
  get id () {
    return [this.__modelType, this.example].join(Model.modelType.separator)
  }

  get schema () {
    return {
      type: 'object',
      properties: {
        example: {
          type: 'string'
        }
      }
    }
  }
}
