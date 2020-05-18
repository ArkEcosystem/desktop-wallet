import { PLUGINS } from '@config'
import { chunk } from 'lodash'
import packageJson from 'package-json'
import { reqwest } from '@/utils/http'

const CHUNKSIZE = 50

class NpmAdapter {
  constructor () {
    this.baseUrl = 'https://registry.npmjs.com'
  }

  async all () {
    let packageData = []
    const plugins = []

    let from = 0
    let totalCount = 0
    const size = 250

    while (!totalCount || plugins.length < totalCount) {
      const pluginResponse = await this.fetchPlugins({
        from,
        size
      })

      plugins.push(...pluginResponse.plugins)

      totalCount = pluginResponse.totalCount
      from = from + size
    }

    for (const pluginChunk of chunk(plugins, CHUNKSIZE)) {
      const requests = []

      for (const plugin of pluginChunk) {
        requests.push(packageJson(plugin.name, { fullMetadata: true }))
      }

      const results = await Promise.all(requests)
      packageData = packageData.concat(results)
    }

    return packageData
  }

  async fetchPlugins (options = {}) {
    const keywords = PLUGINS.keywords.join(' ')

    const {
      body
    } = await reqwest('/-/v1/search', {
      query: {
        text: `keywords:${keywords}`,
        from: options.from || 0,
        size: options.size || 250,
        t: Date.now()
      },
      baseUrl: this.baseUrl,
      json: true,
      timeout: 3000
    })

    return {
      plugins: body.objects.map(plugin => plugin.package),
      totalCount: body.total
    }
  }
}

export default new NpmAdapter()
