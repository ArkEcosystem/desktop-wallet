import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import { capitalize } from '@/utils'

import querystring from 'querystring'

const schemaRegex = new RegExp(/^(?:ark:)([-0-9a-zA-Z]{1,34})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/)

const URIActions = {
  transaction: {
    [TRANSACTION_GROUPS.STANDARD]: {
      TRANSFER: 'transfer'
    //   VOTE: 'vote',
    //   DELEGATE_REGISTRATION: 'register-delegate',
    //   DELEGATE_RESIGNATION: 'resign-delegate'
    // },
    // [TRANSACTION_GROUPS.MAGISTRATE]: {
    //   BUSINESS_REGISTRATION: 'register-business',
    //   BUSINESS_RESIGNATION: 'resign-business',
    //   BUSINESS_UPDATE: 'update-business',
    //   BRIDGECHAIN_REGISTRATION: 'register-bridgechain',
    //   BRIDGECHAIN_RESIGNATION: 'resign-bridgechain',
    //   BRIDGECHAIN_UPDATE: 'update-bridgechain'
    }
  }
}

export default class URIHandler {
  constructor (url) {
    this.url = url
    this.uriType = null
  }

  /**
   * Transforms a uri schema into a json object
   * @returns {Object}
   */
  deserialize () {
    const schema = this.validate()

    if (!schema) return

    const addressOrAction = schema[1]

    const scheme = {
      ...querystring.parse(schema[2].substring(1))
    }

    this.uriType = addressOrAction.length === 34 ? 'transaction' : this.__getActionType(addressOrAction)

    return this[`build${capitalize(this.uriType)}Scheme`](scheme, addressOrAction)
  }

  buildTransactionScheme (scheme, addressOrAction) {
    scheme.type = Number(scheme.type) || TRANSACTION_TYPES.GROUP_1.TRANSFER
    scheme.typeGroup = Number(scheme.typeGroup) || TRANSACTION_GROUPS.STANDARD

    if (!Number.isInteger(scheme.type) || !Number.isInteger(scheme.typeGroup)) return

    scheme.amount = scheme.amount ? scheme.amount : ''
    scheme.label = this.__fullyDecode(scheme.label)
    scheme.nethash = this.__fullyDecode(scheme.nethash)
    scheme.vendorField = this.__fullyDecode(scheme.vendorField) || ''
    scheme.wallet = this.__fullyDecode(scheme.wallet)
    scheme.recipientId = addressOrAction.length === 34 ? addressOrAction : (scheme.recipientId || '')

    scheme.recipients = this.__parseRecipients(scheme.recipients) || []

    this.__inferTransactionTypes(scheme, addressOrAction)

    const baseSchema = {
      type: scheme.type,
      typeGroup: scheme.typeGroup,
      wallet: scheme.wallet,
      nethash: scheme.nethash
    }

    if (scheme.fee) {
      baseSchema.fee = scheme.fee
    }

    // Standard Transactions
    if (scheme.typeGroup === TRANSACTION_GROUPS.STANDARD) {
      if (scheme.type === TRANSACTION_TYPES.GROUP_1.TRANSFER) {
        return {
          ...baseSchema,
          amount: scheme.amount,
          recipientId: scheme.recipientId,
          recipients: scheme.recipients,
          vendorField: scheme.vendorField
        }
      }

      if (scheme.type === TRANSACTION_TYPES.GROUP_1.VOTE) {
        return {
          ...baseSchema,
          vote: scheme.delegate
        }
      }

      if (scheme.type === TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION) {
        return {
          ...baseSchema,
          username: scheme.delegate
        }
      }

      if (scheme.type === TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION) {
        return {
          ...baseSchema
        }
      }
    }

    // Magistrate Transactions
    if (scheme.typeGroup === TRANSACTION_GROUPS.MAGISTRATE) {
      if (scheme.type === TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION) {
        return {
          ...baseSchema,
          business: {
            name: this.__fullyDecode(scheme.name),
            website: this.__fullyDecode(scheme.website),
            vat: this.__fullyDecode(scheme.vat),
            repository: this.__fullyDecode(scheme.repository)
          }
        }
      }

      if (scheme.type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION) {
        return {
          ...baseSchema,
          bridgechain: {
            name: this.__fullyDecode(scheme.name),
            genesisHash: this.__fullyDecode(scheme.genesisHash),
            bridgechainRepository: this.__fullyDecode(scheme.bridgechainRepository),
            bridgechainAssetRepository: this.__fullyDecode(scheme.bridgechainAssetRepository)
          }
        }
      }
    }
  }

  /**
   * Check if is a valid URI
   * @returns {Boolean}
   */
  validate () {
    if (schemaRegex.test(this.url)) {
      const schema = this.__formatSchema()

      if (schema[1].length === 34 || !!this.__getActionType(schema[1])) {
        return schema
      }
    }

    return false
  }

  /**
   * Checks whether the parameter is encoded
   * @param {String} param
   * @returns {String}
   */
  __fullyDecode (param) {
    if (!param) {
      return null
    }

    const isEncoded = (str) => str !== decodeURIComponent(str)

    while (isEncoded(param)) param = decodeURIComponent(param)

    return param
  }

  __parseRecipients (param) {
    const parts = (this.__fullyDecode(param) || '').split(',')

    if (parts.length % 2) return

    const recipients = []

    for (let i = 0; i <= parts.length - 2; i = i + 2) {
      recipients.push({
        address: parts[i],
        amount: parts[i + 1]
      })
    }

    return recipients
  }

  __formatSchema () {
    return schemaRegex.exec(this.url)
  }

  __inferTransactionTypes (scheme, actionName) {
    if (!this.__getActionType(actionName)) {
      return
    }

    const actions = URIActions.transaction

    for (const [typeGroup, types] of Object.entries(actions)) {
      if (Object.values(types).includes(actionName)) {
        scheme.typeGroup = Number(typeGroup)
      }
    }

    for (const [key, curr] of Object.entries(actions[scheme.typeGroup])) {
      if (curr === actionName) {
        scheme.type = Number(TRANSACTION_TYPES[`GROUP_${scheme.typeGroup}`][key])
      }
    }
  }

  __getActionType (actionName, actions = URIActions) {
    for (const [key, curr] of Object.entries(actions)) {
      if (typeof curr === 'string') {
        if (curr === actionName) {
          return key
        }
      } else {
        if (this.__getActionType(actionName, curr)) return key
      }
    }

    return undefined
  }
}
