import { hooks } from './hooks'
import { PLUGINS } from '@config'

export function validateComponent (plugin, rawComponent, logger) {
  const requiredKeys = ['template']
  const allowedKeys = [
    'data',
    'methods',
    'computed',
    'components',
    'props',
    ...hooks
  ]

  const missingKeys = []
  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(rawComponent, key)) {
      missingKeys.push(key)
    }
  }

  const componentError = (error, errorType) => {
    if (logger) {
      logger.error(`Plugin '${plugin.config.id}' component '${name}' ${errorType}: ${error}`)
    }
  }

  if (missingKeys.length) {
    componentError(missingKeys.join(', '), 'is missing')

    return false
  }

  const inlineErrors = []
  if (/v-html/i.test(rawComponent.template)) {
    inlineErrors.push('uses v-html')
  }
  if (/javascript:/i.test(rawComponent.template)) {
    inlineErrors.push('"javascript:"')
  }
  if (/<\s*webview/i.test(rawComponent.template)) {
    inlineErrors.push('uses webview tag')
  }
  if (/<\s*script/i.test(rawComponent.template)) {
    inlineErrors.push('uses script tag')
  } else if (/[^\w]+eval\(/i.test(rawComponent.template)) {
    inlineErrors.push('uses eval')
  }
  if (/<\s*iframe/i.test(rawComponent.template)) {
    inlineErrors.push('uses iframe tag')
  }
  if (/srcdoc/i.test(rawComponent.template)) {
    inlineErrors.push('uses srcdoc property')
  }
  const inlineEvents = []
  for (const event of PLUGINS.validation.events) {
    if ((new RegExp(`on${event}`, 'i')).test(rawComponent.template)) {
      inlineEvents.push(event)
    }
  }
  if (inlineEvents.length) {
    inlineErrors.push('events: ' + inlineEvents.join(', '))
  }

  if (inlineErrors.length) {
    componentError(inlineErrors.join('; '), 'has inline javascript')

    return false
  }

  const bannedKeys = []
  for (const key of Object.keys(rawComponent)) {
    if (![...requiredKeys, ...allowedKeys].includes(key)) {
      bannedKeys.push(key)
    }
  }

  if (bannedKeys.length) {
    componentError(bannedKeys.join(', '), 'has unpermitted keys')

    return false
  }

  return true
}
