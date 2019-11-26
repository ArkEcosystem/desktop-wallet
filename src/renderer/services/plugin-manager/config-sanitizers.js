import { difference, intersection, uniq } from 'lodash'
import { PLUGINS } from '@config'
import * as validPermissions from './plugin-permission'
import du from 'du'
import parse from 'parse-author'
import semver from 'semver'
import titlecase from 'titlecase'

const getOption = (config, option) => {
  try {
    return config['desktop-wallet'][option]
  } catch (error) {
    return null
  }
}

const isOfficial = name => {
  const scopeRegex = new RegExp(`^@${PLUGINS.officialScope}/`)
  return scopeRegex.test(name)
}

const sanitizeIsOfficial = name => {
  return isOfficial(name)
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
  let categories = getOption(config, 'categories')

  if (!categories) {
    if (config.categories && config.categories.length) {
      categories = config.categories
    } else if (config.keywords && config.keywords.length) {
      categories = sanitizeKeywords(config.keywords)
    }
  }

  if (categories && categories.length) {
    categories = intersection(categories, PLUGINS.categories)
  } else {
    categories = []
  }

  return categories.length ? categories : ['other']
}

const sanitizeKeywords = keywords => {
  return difference(uniq(keywords), PLUGINS.keywords).map(keyword => titlecase(keyword))
}

const sanitizeMinVersion = config => {
  const minVersion = getOption(config, 'minVersion') || config.minVersion || null

  if (minVersion) {
    return semver.clean(minVersion)
  }

  return null
}

const sanitizeLogo = config => {
  const logo = getOption(config, 'logo') || config.logo
  if (logo && /^https?:\/\/raw.githubusercontent.com[A-Za-z0-9/_.-]+logo.png$/.test(logo)) {
    return logo
  }
}

const sanitizeName = name => {
  const parts = name.split('/')
  const tmp = parts[parts.length > 1 ? 1 : 0]
    .split('-')
    .join(' ')
  return titlecase(tmp)
}

const sanitizePermissions = config => {
  const permissions = getOption(config, 'permissions') || config.permissions || []

  return intersection(uniq(permissions).sort().map(permission => {
    return permission.toUpperCase()
  }), Object.keys(validPermissions))
}

const sanitizeSize = async (config, pluginPath) => {
  if (config.dist) {
    return config.dist.unpackedSize
  }

  let size = 0

  if (pluginPath) {
    try {
      size = du(pluginPath)
    } catch (error) {
      //
    }
  }

  return size
}

const sanitizeSource = config => {
  if (config.dist) {
    return config.dist.tarball
  }

  return null
}

const sanitizeTitle = config => {
  return config.title ? titlecase(config.title) : sanitizeName(config.name)
}

const sanitizeUrls = config => {
  return getOption(config, 'urls') || config.urls || []
}

export {
  sanitizeAuthor,
  sanitizeCategories,
  sanitizeIsOfficial,
  sanitizeKeywords,
  sanitizeLogo,
  sanitizeMinVersion,
  sanitizeName,
  sanitizePermissions,
  sanitizeSize,
  sanitizeSource,
  sanitizeTitle,
  sanitizeUrls
}
