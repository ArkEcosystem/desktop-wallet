import Model from '@/models/model'

export default class Rigid extends Model {
  static get schema () {
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

  constructor (data = {}) {
    super(Object.assign({}, data, { modelType: 'rigid' }))
  }

  get id () {
    return [this.modelType, this.integer].join(Model.modelType.separator)
  }
}
