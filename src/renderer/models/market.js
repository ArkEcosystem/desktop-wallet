import BaseModel from './base'

export const MarketTicker = new BaseModel({
  type: 'object',
  properties: {
    id: {
      format: (data) => `${data.token}/${data.currency}`
    },
    token: {},
    currency: {},
    price: {
      format: (data) => Number(data.price) || 0.0
    },
    marketCap: {
      format: (data) => Number(data.marketCap) || 0.0
    },
    volume: {
      format: (data) => Number(data.volume) || 0.0
    },
    date: {},
    change24h: {
      format: (data) => Number(data.change24h) || 0
    }
  }
})
