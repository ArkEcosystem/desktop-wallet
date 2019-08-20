import { URL } from 'url'
import logger from 'electron-log'

const allowedProtocols = [
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
      default: 300
    },
    height: {
      type: Number,
      required: false,
      default: 150
    }
  },

  render (h, ctx) {
    const src = ctx.props.src
    const url = isValidURL(src) ? src : 'about:blank'

    return h('div', [
      h('iframe', {
        attrs: {
          width: ctx.props.width,
          height: ctx.props.height,
          src: url,
          sandbox: 'allow-forms allow-scripts'
        }
      })
    ])
  }
}
