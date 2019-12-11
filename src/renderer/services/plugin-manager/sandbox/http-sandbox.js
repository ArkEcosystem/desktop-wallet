import got from 'got'

class PluginHttp {
  constructor (whitelist) {
    this.whitelist = []

    if (Array.isArray(whitelist)) {
      this.whitelist = whitelist.map(regex => {
        return new RegExp(regex)
      })
    }
  }

  validateUrl (url) {
    let valid = false
    for (const regex of this.whitelist) {
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

export function create (walletApi, plugin) {
  return () => {
    walletApi.http = new PluginHttp(plugin.config.urls)
  }
}
