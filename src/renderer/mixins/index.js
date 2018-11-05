import merge from 'lodash/merge'

const mixins = [
  require('./assets').default,
  require('./collections').default,
  require('./currency').default,
  require('./electron').default,
  require('./formatter').default,
  require('./network').default,
  require('./qr').default,
  require('./session').default,
  require('./wallet').default
]

export default merge(...mixins)
