import URIHandler from '@/services/uri-handler'

export default {
  methods: {
    // Tries to retrieve an address from a given string
    // Note that no checks are done on the return value and might be undefined or an incorrect address
    qr_getAddress (value) {
      // Possible options:
      // 1. uri
      const uri = new URIHandler(value)

      if (uri.validate()) {
        const schema = uri.deserialize()
        return schema.address
      }

      try {
        // 2. Object { a: address } or { address: address }
        const addressObj = JSON.parse(value)
        return addressObj.a || addressObj.address
      } catch (error) {
        // 3. Plain string, assume it's an address
        return value
      }
    },

    // Tries to retrieve a passphrase from a given string
    // Note that no checks are done on the return value and might be undefined or an incorrect passphrase
    qr_getPassphrase (value) {
      // Possible options:
      // 1. Object { passphrase: "passphrase words" }
      try {
        const passphraseObj = JSON.parse(value)
        return passphraseObj.passphrase
      } catch (error) {
        // 2. Plain string, assume it's a passphrase
        return value
      }
    }
  }
}
