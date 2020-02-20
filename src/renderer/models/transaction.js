import BaseModel from './base'
import { toString } from 'lodash'

export default new BaseModel({
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    profileId: {
      type: 'string',
      minLength: 16,
      maxLength: 16
    },
    type: {
      type: 'integer'
    },
    typeGroup: {
      type: 'integer'
    },
    recipient: {
      type: 'string'
    },
    sender: {
      type: 'string'
    },
    // As arktoshi
    amount: {
      type: 'string',
      format: (data) => toString(data.amount || 0)
    },
    // As arktoshi
    fee: {
      type: 'string',
      format: (data) => toString(data.fee || 0)
    },
    confirmations: {
      type: 'integer',
      minimum: 0,
      default: 0
    },
    // Unix timestamp, as milliseconds
    timestamp: {
      type: 'integer',
      minimum: 0,
      default: 0
    },
    vendorField: {
      type: 'string'
    },
    asset: {
      type: 'object'
    },
    raw: {
      type: 'object'
    },
    isExpired: {
      type: 'boolean',
      format: (data) => (data.isExpired || false)
    }
  }
})
