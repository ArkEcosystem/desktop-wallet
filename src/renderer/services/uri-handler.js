const schemaRegex = new RegExp(/^(?:ark:)([0-9a-zA-Z]{34})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/)

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

    const schema = this.__formatSchema()

    const queryString = {}
    const regex = new RegExp('([^?=&]+)(=([^&]*))?', 'g')
    schema[2].replace(regex, (_, $1, __, $3) => (queryString[$1] = $3))

    const scheme = {
      address: null,
      amount: null,
      label: null,
      nethash: null,
      vendorField: null,
      wallet: null
    }

    for (const prop in scheme) {
      scheme[prop] = queryString[prop]
    }

    scheme.address = schema[1]
    scheme.amount = scheme.amount ? Number(scheme.amount) : null
    scheme.label = scheme.label ? this.__fullyDecode(scheme.label) : null
    scheme.nethash = scheme.nethash ? this.__fullyDecode(scheme.nethash) : null
    scheme.vendorField = scheme.vendorField ? this.__fullyDecode(scheme.vendorField) : null
    scheme.wallet = scheme.wallet ? this.__fullyDecode(scheme.wallet) : null

    return scheme
  }

  /**
   * Check if is a valid URI
   * @returns {Boolean}
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

  __formatSchema () {
    return schemaRegex.exec(this.url)
  }
}
