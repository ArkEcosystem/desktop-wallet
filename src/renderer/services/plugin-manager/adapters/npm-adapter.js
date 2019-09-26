import chunk from 'lodash/chunk'
import got from 'got'
import packageJson from 'package-json'
import pacote from 'pacote'
import { PLUGINS } from '@config'

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
    const keywords = PLUGINS.requiredKeywords.join(' ')

    const { body } = await got('/-/v1/search', {
      query: {
        text: `keywords:${keywords}`,
        from: options.from || 0,
        size: options.size || 250
      },
      baseUrl: this.baseUrl,
      json: true
    })

    return {
      plugins: body.objects.map(plugin => plugin.package),
      totalCount: body.total
    }
  }

  async download (packageName, destPath) {
    const pluginPath = `${destPath}/${packageName}`

    try {
      await pacote.extract(packageName, pluginPath)
    } catch (error) {
      // TODO cleanup
      console.log('needs cleanup')
      throw error
    }
  }
}

export default NpmAdapter
