import BaseModel from './base'

export default new BaseModel({
  type: 'object',
  properties: {
    id: {
      format: data => data.address
    },
    address: {
      type: 'string'
    },
    balance: {
      type: 'integer',
      minimum: 0,
      default: 0
    },
    transactions: {
      type: 'object',
      default: {
        checkedAt: 0
      },
      properties: {
        checkedAt: {
          type: 'integer',
          minimum: 0,
          default: 0
        }
      }
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 120
    },
    passphrase: {
      type: ['string', 'null']
    },
    profileId: {},
    publicKey: {
      type: ['string', 'null']
    },
    secondPublicKey: {
      type: ['string', 'null']
    },
    isContact: {
      type: ['boolean'],
      default: false
    },
    isDelegate: {
      type: 'boolean',
      default: false
    }
  },
  required: ['address', 'name', 'profileId']
})
