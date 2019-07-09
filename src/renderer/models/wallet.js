import BaseModel from './base'
import { toString } from 'lodash'

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
      type: 'string',
      default: '0',
      format: (data) => toString(data.balance)
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
      minLength: 0,
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
    },
    isWatchOnly: {
      type: 'boolean',
      default: false
    },
    vote: {
      type: ['string', 'null']
    }
  },
  required: ['address', 'profileId']
})
