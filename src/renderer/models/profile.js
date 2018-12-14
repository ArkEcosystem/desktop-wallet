import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 16,
      maxLength: 16
    },
    avatar: {
      type: 'string',
      minLength: 1
    },
    background: {
      type: 'string',
      minLength: 1
    },
    currency: {
      type: 'string',
      minLength: 3,
      maxLength: 3
    },
    language: {
      type: 'string',
      minLength: 1
    },
    bip39Language: {
      type: ['string', 'null'],
      format: (data) => data.bip39Language || null
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 120
    },
    networkId: {},
    theme: {
      type: 'string',
      minLength: 1
    },
    backgroundUpdateLedger: {
      type: 'boolean',
      format: (data) => data.backgroundUpdateLedger !== undefined ? data.backgroundUpdateLedger : true
    },
    ledgerCache: {
      type: 'boolean',
      format: (data) => data.ledgerCache || false
    }
  },
  required: ['avatar', 'background', 'currency', 'language', 'name', 'networkId', 'theme']
})
