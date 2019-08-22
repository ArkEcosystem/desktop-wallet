import i18n from '@/i18n'

const legacySchemaRegex = new RegExp(/^(?:ark:)([0-9a-zA-Z]{34})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/)
const schemaRegex = new RegExp(/^(?:ark:)(transfer|vote|register-delegate|sign-message)([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/)
const paramRegex = new RegExp('([^?=&]+)(=([^&]*))?', 'g')

export default class URIHandler {
  constructor (url, isQR = false) {
    this.url = url
    this.isQR = isQR
  }

  /**
   * Transforms a uri schema into a json object
   * @returns {Object}
   */
  deserialize () {
    if (!this.validateLegacy()) {
      if (!this.validate()) throw new Error(i18n.t('VALIDATION.INVALID_URI'))

      const schema = this.__formatSchema()
      const queryString = {}
      schema[2].replace(paramRegex, (_, $1, __, $2) => (queryString[$1] = $2))

      // All AIP-26 options combined, as they have a lot of overlap
      const scheme = {
        type: schema[1],
        name: null,
        seedServer: null,
        description: null,
        recipient: null,
        amount: null,
        fee: null,
        vendorField: null,
        relay: null,
        nethash: null,
        label: null,
        delegate: null,
        message: null
      }

      for (const prop in scheme) {
        if (queryString[prop]) {
          scheme[prop] = queryString[prop]
        }
      }

      // Validate values we received
      switch (scheme.type) {
        case 'transfer':
          if (!scheme.recipient) throw new Error(i18n.t('VALIDATION.URI.MISSING_ADDRESS'))
          if (!scheme.amount) throw new Error(i18n.t('VALIDATION.URI.MISSING_AMOUNT'))
          break
        case 'vote':
          if (!scheme.delegate) throw new Error(i18n.t('VALIDATION.URI.MISSING_DELEGATE'))
          break
        case 'register-delegate':
          if (!scheme.delegate) throw new Error(i18n.t('VALIDATION.URI.MISSING_USERNAME'))
          break
        case 'sign-message':
          if (!scheme.message) throw new Error(i18n.t('VALIDATION.URI.MISSING_MESSAGE'))
          break
        default:
          throw new Error(i18n.t('VALIDATION.URI.MISSING_CASE'))
      }

      // General validation
      if (scheme.fee) {
        if (Number(scheme.fee) === 0) {
          throw new Error(i18n.t('VALIDATION.URI.FEE_ZERO'))
        } else if (Number(scheme.fee) < 0) {
          throw new Error(i18n.t('VALIDATION.URI.FEE_NEGATIVE'))
        } else if (Number(scheme.fee) < 1e-8) {
          throw new Error(i18n.t('VALIDATION.URI.FEE_TOO_LOW'))
        }
      }
      if (scheme.vendorField && scheme.vendorField.length > 255) {
        throw new Error(i18n.t('VALIDATION.URI.VENDORFIELD_TOO_LARGE'))
      }

      // Handle the props that should be decoded / numbers
      scheme.seedServer = scheme.seedServer ? this.__fullyDecode(scheme.seedServer) : null
      scheme.description = scheme.description ? this.__fullyDecode(scheme.description) : null
      scheme.amount = scheme.amount ? scheme.amount : null
      scheme.fee = scheme.fee ? scheme.fee : null
      scheme.vendorField = scheme.vendorField ? this.__fullyDecode(scheme.vendorField) : null
      scheme.relay = scheme.relay ? this.__fullyDecode(scheme.relay) : null
      scheme.label = scheme.label ? this.__fullyDecode(scheme.label) : null
      scheme.message = scheme.message ? this.__fullyDecode(scheme.message) : null

      return scheme
    } else {
      // Handle legacy (AIP-13)
      const legacySchema = this.__formatLegacySchema()

      const queryString = {}
      legacySchema[2].replace(paramRegex, (_, $1, __, $3) => (queryString[$1] = $3))

      const legacyScheme = {
        type: 'legacy',
        address: null,
        amount: null,
        label: null,
        vendorField: null
      }

      for (const prop in legacyScheme) {
        if (queryString[prop]) {
          legacyScheme[prop] = queryString[prop]
        }
      }

      legacyScheme.address = legacySchema[1]

      // Validation
      if (!legacyScheme.address) throw new Error(i18n.t('VALIDATION.URI.MISSING_ADDRESS'))
      if (!this.isQR && !legacyScheme.amount) throw new Error(i18n.t('VALIDATION.URI.MISSING_AMOUNT'))

      legacyScheme.amount = legacyScheme.amount ? legacyScheme.amount : null
      legacyScheme.label = legacyScheme.label ? this.__fullyDecode(legacyScheme.label) : null
      legacyScheme.vendorField = legacyScheme.vendorField ? this.__fullyDecode(legacyScheme.vendorField) : null

      return legacyScheme
    }
  }

  /**
   * Check if it's a valid AIP-13 URI
   * @returns {Boolean}
   */
  validateLegacy () {
    return legacySchemaRegex.test(this.url)
  }

  /**
   * Check if it's a valid AIP-26 URI
   */
  validate () {
    return schemaRegex.test(this.url)
  }

  /**
   * Checks whether the parameter is encoded
   * @param {String} param
   * @returns {String}
   */
  __fullyDecode (param) {
    const isEncoded = (str) => str !== decodeURIComponent(str)

    while (isEncoded(param)) param = decodeURIComponent(param)

    return param
  }

  __formatLegacySchema () {
    return legacySchemaRegex.exec(this.url)
  }

  __formatSchema () {
    return schemaRegex.exec(this.url)
  }
}
