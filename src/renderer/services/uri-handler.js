import querystring from 'querystring'

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

    const scheme = {
      ...querystring.parse(schema[2].substring(1))
    }

    return {
      address: schema[1],
      label: this.__fullyDecode(scheme.label),
      amount: (Number(scheme.amount) || '').toString(),
      nethash: this.__fullyDecode(scheme.nethash),
      vendorField: this.__fullyDecode(scheme.vendorField) || '',
      wallet: this.__fullyDecode(scheme.wallet),
      ...(scheme.fee && { fee: scheme.fee })
    }
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
}
