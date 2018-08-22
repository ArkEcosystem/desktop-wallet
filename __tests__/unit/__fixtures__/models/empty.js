import Model from '@/models/model'

export default class Empty extends Model {
  get schema () {
    return {
      type: 'object',
      properties: {}
    }
  }
}
