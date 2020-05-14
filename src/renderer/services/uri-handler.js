import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'

import querystring from 'querystring'

const schemaRegex = new RegExp(/^(?:ark:)([-0-9a-zA-Z]{1,34})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/)

const URIActions = {
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

export default class URIHandler {
  constructor (url) {
    this.url = url
  }

  /**
   * Transforms a uri schema into a json object
   * @returns {Object}
   */
  deserialize () {
    const schema = this.validate()

    if (!schema) return

    let address, action

    // 'address' is used only in legacy URIs, all other URIs have an 'action'
    if (schema[1].length === 34) {
      address = schema[1]
    } else {
      action = schema[1]
    }

    const scheme = {
      ...querystring.parse(schema[2].substring(1))
    }

    scheme.type = Number(scheme.type) || TRANSACTION_TYPES.GROUP_1.TRANSFER
    scheme.typeGroup = Number(scheme.typeGroup) || TRANSACTION_GROUPS.STANDARD

    if (!Number.isInteger(scheme.type) || !Number.isInteger(scheme.typeGroup)) return

    scheme.amount = scheme.amount ? scheme.amount : ''
    scheme.label = this.__fullyDecode(scheme.label)
    scheme.nethash = this.__fullyDecode(scheme.nethash)
    scheme.vendorField = this.__fullyDecode(scheme.vendorField) || ''
    scheme.wallet = this.__fullyDecode(scheme.wallet)
    scheme.recipientId = address || scheme.recipientId || ''

    this.__inferTypesFromAction(scheme, action)

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

      if (schema[1].length === 34 || this.__actionExists(schema[1])) {
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

  __formatSchema () {
    return schemaRegex.exec(this.url)
  }

  __inferTypesFromAction (scheme, action) {
    if (!this.__actionExists(action)) {
      return
    }

    for (const [typeGroup, types] of Object.entries(URIActions)) {
      if (Object.values(types).includes(action)) {
        scheme.typeGroup = Number(typeGroup)
      }
    }

    for (const [key, value] of Object.entries(URIActions[scheme.typeGroup])) {
      if (value === action) {
        scheme.type = Number(TRANSACTION_TYPES[`GROUP_${scheme.typeGroup}`][key])
      }
    }
  }

  __actionExists (action) {
    for (const actionGroup of Object.values(URIActions)) {
      if (Object.values(actionGroup).includes(action)) {
        return true
      }
    }

    return false
  }
}
