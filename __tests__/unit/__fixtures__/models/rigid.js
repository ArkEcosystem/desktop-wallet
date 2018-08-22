import Model from '@/models/model'

export default class Rigid extends Model {
  get id () {
    return [this.__modelType, this.integer].join(Model.modelType.separator)
  }

  get schema () {
    return {
      type: 'object',
      properties: {
        integer: {
          type: 'integer'
        },
        date: {
          type: 'date'
        }
      },
      required: ['integer', 'date']
    }
  }
}
