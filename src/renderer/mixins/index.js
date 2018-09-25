import merge from 'lodash/merge'

const mixins = [
  require('./assets').default,
  require('./collections').default,
  require('./electron').default,
  require('./currency').default,
  require('./wallet').default
]

export default merge(...mixins)
