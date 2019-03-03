const legacySchemaRegex = new RegExp(/^(?:ark:)([AaDd]{1}[0-9a-zA-Z]{33})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/)
const schemaRegex = new RegExp(/^(?:ark:)(add-network|transfer|vote|register-delegate|sign-message)([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/)
const paramRegex = new RegExp('([^?=&]+)(=([^&]*))?', 'g')

export default class URIHandler {
  constructor (url) {
    this.url = url
  }

  /**
   * Transforms a uri schema into a json object
   * @returns {Object}
   */
  deserialize () {
    if (!this.validateLegacy()) {
      if (!this.validate()) return

      let schema = this.__formatSchema()
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
        username: null,
        message: null
      }

      for (let prop in scheme) {
        if (queryString[prop]) {
          scheme[prop] = queryString[prop]
        }
      }

      // Handle the props that should be decoded / numbers
      scheme.seedServer = scheme.seedServer ? this.__fullyDecode(scheme.seedServer) : null
      scheme.description = scheme.description ? this.__fullyDecode(scheme.description) : null
      scheme.amount = scheme.amount ? Number(scheme.amount) : null
      scheme.fee = scheme.fee ? Number(scheme.fee) : null
      scheme.vendorField = scheme.vendorField ? this.__fullyDecode(scheme.vendorField) : null
      scheme.relay = scheme.relay ? this.__fullyDecode(scheme.relay) : null
      scheme.label = scheme.label ? this.__fullyDecode(scheme.label) : null
      scheme.message = scheme.message ? this.__fullyDecode(scheme.message) : null

      return scheme
    } else {
      // Handle legacy (AIP-13)
      let legacySchema = this.__formatLegacySchema()

      const queryString = {}
      legacySchema[2].replace(paramRegex, (_, $1, __, $3) => (queryString[$1] = $3))

      const legacyScheme = {
        type: 'legacy',
        address: null,
        amount: null,
        label: null,
        vendorField: null
      }

      for (let prop in legacyScheme) {
        if (queryString[prop]) {
          legacyScheme[prop] = queryString[prop]
        }
      }

      legacyScheme.address = legacySchema[1]
      legacyScheme.amount = legacyScheme.amount ? Number(legacyScheme.amount) : null
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
