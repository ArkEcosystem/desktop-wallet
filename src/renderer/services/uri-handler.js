const schemaRegex = new RegExp(
  /^(?:ark:)([AaDd]{1}[0-9a-zA-Z]{33})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/
)

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

    let schema = this.__formatSchema()

    const queryString = {}
    const regex = new RegExp('([^?=&]+)(=([^&]*))?', 'g')
    schema[2].replace(regex, (_, $1, __, $3) => (queryString[$1] = $3))

    const scheme = {
      address: null,
      amount: null,
      label: null,
      vendorField: null
    }

    for (let prop in scheme) {
      scheme[prop] = queryString[prop]
    }

    scheme.address = schema[1]
    scheme.amount = scheme.amount ? Number(scheme.amount) : null
    scheme.label = scheme.label ? this.__fullyDecode(scheme.label) : null
    scheme.vendorField = scheme.vendorField
      ? this.__fullyDecode(scheme.vendorField)
      : null

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
    const isEncoded = str => str !== decodeURIComponent(str)

    while (isEncoded(param)) param = decodeURIComponent(param)

    return param
  }

  __formatSchema () {
    return schemaRegex.exec(this.url)
  }
}
