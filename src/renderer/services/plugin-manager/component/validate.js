import { hooks } from './hooks'
import { PLUGINS } from '@config'

export function validateComponent ({ plugin, component, name, logger }) {
  const requiredKeys = ['template']
  const allowedKeys = [
    'data',
    'methods',
    'watch',
    'computed',
    'components',
    'props',
    ...hooks
  ]

  const missingKeys = []
  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(component, key)) {
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
  if (/v-html/i.test(component.template)) {
    inlineErrors.push('uses v-html')
  }
  if (/javascript:/i.test(component.template)) {
    inlineErrors.push('"javascript:"')
  }
  if (/<\s*webview/i.test(component.template)) {
    inlineErrors.push('uses webview tag')
  }
  if (/<\s*script/i.test(component.template)) {
    inlineErrors.push('uses script tag')
  } else if (/[^\w]+eval\(/i.test(component.template)) {
    inlineErrors.push('uses eval')
  }
  if (/<\s*iframe/i.test(component.template)) {
    inlineErrors.push('uses iframe tag')
  }
  if (/srcdoc/i.test(component.template)) {
    inlineErrors.push('uses srcdoc property')
  }
  const inlineEvents = []
  for (const event of PLUGINS.validation.events) {
    if ((new RegExp(`(^|\\s)+on${event}`, 'i')).test(component.template)) {
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
  for (const key of Object.keys(component)) {
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
