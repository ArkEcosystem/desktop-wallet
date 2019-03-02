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
      console.log('not a legacy uri, trying new one')
      if (!this.validate()) return

      let schema = this.__formatSchema()
      const queryString = {}
      schema[2].replace(paramRegex, (_, $1, __, $2) => (queryString[$1] = $2))

      // Handle AIP-26 options
      switch (schema[1]) {
        case 'add-network':
          const scheme = {
            type: schema[1],
            name: null,
            seedServer: null,
            description: null
          }

          for (let prop in scheme) {
            scheme[prop] = queryString[prop]
          }

          scheme.seedServer = this.__fullyDecode(scheme.seedServer)
          scheme.description = scheme.description ? this.__fullyDecode(scheme.description) : null

          return scheme
        case 'transfer':
        case 'vote':
        case 'register-delegate':
        case 'sign-message':
          console.log(queryString)
          break
      }
    } else {
      // Handle legacy (AIP-13)
      let legacySchema = this.__formatLegacySchema()
      console.log('aip-13')
      console.log(this.url)

      const queryString = {}
      legacySchema[2].replace(paramRegex, (_, $1, __, $3) => (queryString[$1] = $3))

      console.log(legacySchema)
      console.log(queryString)

      const legacyScheme = {
        type: 'legacy',
        address: null,
        amount: null,
        label: null,
        vendorField: null
      }

      for (let prop in legacyScheme) {
        legacyScheme[prop] = queryString[prop]
      }

      legacyScheme.address = legacySchema[1]
      legacyScheme.amount = legacyScheme.amount ? Number(legacyScheme.amount) : null
      legacyScheme.label = legacyScheme.label ? this.__fullyDecode(legacyScheme.label) : null
      legacyScheme.vendorField = legacyScheme.vendorField ? this.__fullyDecode(legacyScheme.vendorField) : null

      return legacyScheme
    }
  }

  // TODO: add deserialize for the new AIP-26 options
  // TODO: handle AIP-26 option accordingly in the wallet

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
