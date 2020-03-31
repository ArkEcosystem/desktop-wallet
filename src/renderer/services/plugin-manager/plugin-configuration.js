import {
  sanitizeAuthor,
  sanitizeCategories,
  sanitizeId,
  sanitizeImages,
  sanitizeIsOfficial,
  sanitizeKeywords,
  sanitizeLogo,
  sanitizeMinimumVersion,
  sanitizePermissions,
  sanitizeSize,
  sanitizeSource,
  sanitizeTitle,
  sanitizeUrls,
  sanitizeVersion
} from './config-sanitizers'

export class PluginConfiguration {
  constructor ({
    id,
    author,
    categories,
    keywords,
    description,
    logo,
    images,
    homepage,
    isOfficial,
    minimumVersion,
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
    this.keywords = keywords
    this.description = description
    this.logo = logo
    this.images = images
    this.homepage = homepage
    this.isOfficial = isOfficial
    this.minimumVersion = minimumVersion
    this.permissions = permissions
    this.size = size
    this.source = source
    this.title = title
    this.urls = urls
    this.version = version
  }

  static async sanitize (config, pluginPath = null) {
    return new PluginConfiguration({
      id: sanitizeId(config.name),
      author: sanitizeAuthor(config),
      categories: sanitizeCategories(config),
      keywords: sanitizeKeywords(config.keywords),
      description: config.description,
      logo: sanitizeLogo(config),
      images: sanitizeImages(config),
      homepage: config.homepage,
      isOfficial: sanitizeIsOfficial(config.name),
      minimumVersion: sanitizeMinimumVersion(config),
      permissions: sanitizePermissions(config),
      size: await sanitizeSize(config, pluginPath) || 0,
      source: sanitizeSource(config),
      title: sanitizeTitle(config),
      urls: sanitizeUrls(config),
      version: sanitizeVersion(config.version)
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
