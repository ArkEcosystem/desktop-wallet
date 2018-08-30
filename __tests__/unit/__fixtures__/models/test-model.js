import Model from '@/models/model'

export default class TestModel extends Model {
  static get schema () {
    return {
      type: 'object',
      properties: {
        example: {
          type: 'string'
        }
      }
    }
  }

  constructor (data = {}) {
    super(Object.assign({}, data, { modelType: 'test-model' }))
  }

  get id () {
    return [this.modelType, this.example].join(Model.modelType.separator)
  }
}
