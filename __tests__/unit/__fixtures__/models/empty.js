import Model from '@/models/model'

export default class Empty extends Model {
  static get schema () {
    return {
      type: 'object',
      properties: {}
    }
  }

  constructor (data = {}) {
    super(Object.assign({}, data, { modelType: 'empty' }))
  }
}
