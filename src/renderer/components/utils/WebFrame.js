import { URL } from 'url'
import logger from 'electron-log'
import path from 'path'

const allowedProtocols = [
  'ark:',
  'http:',
  'https:'
]

const isValidURL = (input) => {
  if (!input) {
    return false
  }

  try {
    const uri = new URL(input)
    const isAllowed = allowedProtocols.includes(uri.protocol)
    if (!isAllowed) {
      logger.error('[webframe]: Protocol not allowed.')
    }
    return isAllowed
  } catch {
    logger.error(`[webframe]: Invalid url. Make sure to set the protocol (${allowedProtocols.join(',')}).`)
    return false
  }
}

export default {
  name: 'WebFrame',
  functional: true,

  props: {
    src: {
      type: String,
      required: false,
      default: null
    },
    width: {
      type: Number,
      required: false,
      default: null
    },
    height: {
      type: Number,
      required: false,
      default: null
    }
  },

  render (h, ctx) {
    const src = ctx.props.src
    const url = isValidURL(src) ? src : 'about:blank'

    return h('webview', {
      attrs: {
        width: ctx.props.width,
        height: ctx.props.height,
        class: ctx.data.staticClass,
        src: url,
        enableremotemodule: 'false',
        preload: `file:${path.resolve(__static, './webview-preload.js')}`
      },

      on: {
        'console-message': event => {
          const message = typeof event.message !== 'string' ? JSON.stringify(event.message) : event.message
          if (event.level === 2) {
            logger.error('[webframe log]:', message)
          } else {
            logger.log('[webframe log]:', message)
          }
        },

        'will-navigate': event => {
          if (!isValidURL(event.url)) {
            event.target.stop()
            event.target.location = 'about:blank'
          }
        },

        'ipc-message': event => {
          window.postMessage({
            action: event.channel,
            data: event.args.length ? event.args[0] : {}
          })
        }
      }
    })
  }
}
