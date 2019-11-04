import uniq from 'lodash/uniq'

export class PluginConfiguration {
  constructor ({
    id,
    name,
    description,
    permissions,
    urls,
    version
  }) {
    this.id = id
    this.name = name
    this.description = description
    this.permissions = permissions
    this.urls = urls
    this.version = version
  }

  static sanitize (config) {
    return new PluginConfiguration({
      id: config.name,
      name: config.title,
      description: config.description,
      version: config.version,
      permissions: uniq(config.permissions).sort(),
      urls: config.urls || []
    })
  }

  validate () {
    if (!this.id) {
      throw new Error('Plugin ID not found')
    } else if (!/^[@/a-z-0-9-]+$/.test(this.id)) {
      throw new Error('Invalid Plugin ID')
    }
  }
}
