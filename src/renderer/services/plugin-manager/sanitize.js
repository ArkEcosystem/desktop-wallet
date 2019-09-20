import { difference, intersection, uniq } from 'lodash'
import { PLUGINS } from '@config'
import du from 'du'
import parse from 'parse-author'

const sanitizeConfig = async (config, pluginPath = null) => {
  return {
    id: config.name,
    title: config.title || sanitizeName(config.name),
    isOfficial: isOfficial(config.name),
    author: sanitizeAuthor(config),
    categories: sanitizeCategories(config),
    description: config.description,
    version: config.version,
    permissions: sanitizePermissions(config),
    urls: sanitizeUrls(config),
    homepage: config.homepage,
    size: await sanitizeSize(config, pluginPath) || 0
  }
}

const sanitizeName = name => {
  const parts = name.split('/')
  return parts[parts.length ? 1 : 0]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const isOfficial = name => {
  const scopeRegex = new RegExp(`^@${PLUGINS.officialScope}/`)
  return scopeRegex.test(name)
}

const sanitizeAuthor = config => {
  if (isOfficial(config.name)) {
    return PLUGINS.officialAuthor
  }

  if (config.author) {
    if (typeof config.author === 'string') {
      return parse(config.author).name
    }
    return config.author.name
  }

  if (config.contributors && config.contributors.length) {
    if (typeof config.contributors[0].name === 'string') {
      return parse(config.contributors[0].name).name
    }
    return config.contributors[0].name
  }

  return 'unknown'
}

const sanitizeCategories = config => {
  let categories

  try {
    categories = config['desktop-wallet'].categories
  } catch (error) {
    if (config.categories && config.categories.length) {
      categories = config.categories
    } else {
      categories = difference(config.keywords, PLUGINS.requiredKeywords)
    }
  }

  categories = intersection(categories, PLUGINS.availableCategories)
  return categories.length ? categories : ['other']
}

const sanitizePermissions = config => {
  let permissions

  try {
    permissions = config['desktop-wallet'].permissions
  } catch (error) {
    permissions = config.permissions
  }

  return uniq(permissions).sort()
}

const sanitizeUrls = config => {
  let urls

  try {
    urls = config['desktop-wallet'].urls
  } catch (error) {
    urls = config.urls
  }

  return urls || []
}

const sanitizeSize = async (config, pluginPath) => {
  if (config.dist) {
    return config.dist.unpackedSize
  }

  return du(pluginPath)
}

export default sanitizeConfig
