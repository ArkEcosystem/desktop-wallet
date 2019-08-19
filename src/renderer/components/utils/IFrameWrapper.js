const { URL } = require('url')

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
    return allowedProtocols.includes(uri.protocol)
  } catch {
    console.error('[iframe]: Invalid protocol')
    return false
  }
}

export default {
  name: 'IFrameWrapper',
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

    return h('iframe', {
      attrs: {
        width: ctx.props.width,
        height: ctx.props.height,
        src: url,
        sandbox: 'allow-forms allow-scripts'
      }
    })
  }
}
