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
      categories = difference(config.keywords, PLUGINS.keywords)
    }
  }

  if (categories && categories.length) {
    categories = intersection(categories, PLUGINS.categories)
  } else {
    categories = []
  }

  return categories.length ? categories : ['other']
}

const sanitizeMinVersion = config => {
  const minVersion = getOption(config, 'minVersion') || config.minVersion || null

  if (minVersion) {
    return semver.clean(minVersion)
  }

  return null
}

const sanitizeName = name => {
  const parts = name.split('/')
  const tmp = parts[parts.length ? 1 : 0]
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

const sanitizeRepository = (repository) => {
  let url

  if (repository && repository.type === 'git') {
    url = repository.url

    if (url.startsWith('git+')) {
      url = url.split('git+')[1]

      if (url.endsWith('.git')) {
        url = url.split('.git')[0]
      }
    }
  }

  return url
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
  sanitizeMinVersion,
  sanitizeName,
  sanitizePermissions,
  sanitizeRepository,
  sanitizeSize,
  sanitizeSource,
  sanitizeTitle,
  sanitizeUrls
}
