import got from 'got'

export default class PluginHttp {
  constructor (whitelist) {
    this.whitelist = []

    if (Array.isArray(whitelist)) {
      this.whitelist = whitelist.map(regex => {
        return new RegExp(regex)
      })

      console.log('whitelist', this.whitelist)
    }
  }

  validateUrl (url) {
    let valid = false
    for (const regex of this.whitelist) {
      console.log(regex, regex.test(url), url)
      if (regex.test(url)) {
        valid = true

        break
      }
    }

    if (!valid) {
      throw new Error(`URL "${url}" not allowed`)
    }
  }

  get (url, opts) {
    this.validateUrl(url)

    return got.get(url, opts)
  }

  post (url, opts) {
    this.validateUrl(url)

    return got.post(url, opts)
  }
}
