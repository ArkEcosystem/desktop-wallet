import trunc from 'trunc-html'
import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    guid: {},
    date: {
      format: (data) => data.isoDate
    },
    title: {},
    summary: {
      type: ['string', 'null'],
      format: data => trunc(data['content:encoded'], 300).text
    },
    url: {
      format: data => data.link
    },
    isRead: {
      format: () => false
    }
  }
})
