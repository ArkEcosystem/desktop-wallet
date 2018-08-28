import Model from './model'

export default class MarketData extends Model {
  static fromObject (token, data) {
    return new MarketData({token, ...data})
  }

  get id () {
    return [this.modelType, this.token, this.currency].join(Model.modelType.separator)
  }

  get schema () {
    return {
      required: ['token', 'price', 'marketCap', 'volume', 'date', 'change24h'],
      properties: {
        token: {
          type: 'string'
        },
        currency: {
          type: 'string'
        },
        price: {
          type: 'number'
        },
        marketCap: {
          type: 'number'
        },
        volume: {
          type: 'number'
        },
        date: {
          type: 'date-time'
        },
        change24h: {
          type: 'number'
        }
      }
    }
  }
}
