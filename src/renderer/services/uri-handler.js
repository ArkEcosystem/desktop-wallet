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
      ...{
        type: 0,
        typeGroup: 0,
        address: null,
        amount: null,
        label: null,
        nethash: null,
        vendorField: null,
        wallet: null,
        business: null
      },
      ...querystring.parse(schema[2].substring(1))
    }

    scheme.type = Number(scheme.type)
    scheme.typeGroup = Number(scheme.typeGroup)

    scheme.address = schema[1]
    scheme.amount = scheme.amount ? Number(scheme.amount) : null
    scheme.label = this.__fullyDecode(scheme.label)
    scheme.nethash = this.__fullyDecode(scheme.nethash)
    scheme.vendorField = this.__fullyDecode(scheme.vendorField)
    scheme.wallet = this.__fullyDecode(scheme.wallet)

    // Business Registration
    if (scheme.type === 0 && scheme.typeGroup === 2) {
      scheme.business = {
        name: this.__fullyDecode(scheme.name),
        website: this.__fullyDecode(scheme.website),
        vat: this.__fullyDecode(scheme.vat),
        repository: this.__fullyDecode(scheme.repository)
      }
    }

    // Bridgechain Registration
    if (scheme.type === 3 && scheme.typeGroup === 2) {
      scheme.bridgechain = {
        name: this.__fullyDecode(scheme.name),
        genesisHash: this.__fullyDecode(scheme.genesisHash),
        bridgechainRepository: this.__fullyDecode(scheme.bridgechainRepository),
        bridgechainAssetRepository: this.__fullyDecode(scheme.bridgechainAssetRepository)
      }
    }

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
