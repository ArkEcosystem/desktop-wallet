import Model from './model'

export default class Meta extends Model {
  constructor (data) {
    super(data)

    // TODO force schema

    this.version = data.version
  }

  get schema () {
  }

  get id () {
    return `${this.modelType}~${this.version}`
  }
}
