const legacySchemaRegex = new RegExp(/^(?:ark:)([AaDd]{1}[0-9a-zA-Z]{33})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/)

export default class URIHandler {
  constructor (url) {
    this.url = url
  }

  /**
   * Transforms a uri schema into a json object
   * @returns {Object}
   */
  deserialize () {
    if (!this.validate()) return

    let legacySchema = this.__formatSchema()

    const queryString = {}
    const regex = new RegExp('([^?=&]+)(=([^&]*))?', 'g')
    legacySchema[2].replace(regex, (_, $1, __, $3) => (queryString[$1] = $3))

    const legacyScheme = {
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

  // TODO: add deserialize for the new AIP-26 options
  // TODO: handle AIP-26 option accordingly in the wallet

  /**
   * Check if is a valid URI
   * @returns {Boolean}
   */
  validate () {
    return legacySchemaRegex.test(this.url)
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

  __formatSchema () {
    return legacySchemaRegex.exec(this.url)
  }
}
