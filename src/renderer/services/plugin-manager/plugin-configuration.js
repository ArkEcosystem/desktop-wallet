import {
  sanitizeAuthor,
  sanitizeCategories,
  sanitizeIsOfficial,
  sanitizeMinVersion,
  sanitizeName,
  sanitizePermissions,
  sanitizeSize,
  sanitizeSource,
  sanitizeUrls
} from './config-sanitizers'

export class PluginConfiguration {
  constructor ({
    id,
    author,
    categories,
    description,
    homepage,
    isOfficial,
    minVersion,
    permissions,
    size,
    source,
    title,
    urls,
    version
  }) {
    this.id = id
    this.author = author
    this.categories = categories
    this.description = description
    this.homepage = homepage
    this.isOfficial = isOfficial
    this.minVersion = minVersion
    this.permissions = permissions
    this.size = size
    this.source = source
    this.title = title
    this.urls = urls
    this.version = version
  }

  static async sanitize (config, pluginPath = null) {
    return new PluginConfiguration({
      id: config.name,
      author: sanitizeAuthor(config),
      categories: sanitizeCategories(config),
      description: config.description,
      homepage: config.homepage,
      isOfficial: sanitizeIsOfficial(config.name),
      minVersion: sanitizeMinVersion(config),
      permissions: sanitizePermissions(config),
      size: await sanitizeSize(config, pluginPath) || 0,
      source: sanitizeSource(config),
      title: config.title || sanitizeName(config.name),
      urls: sanitizeUrls(config),
      version: config.version
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
