import merge from 'lodash/merge'

const mixins = [
  require('./assets').default,
  require('./collections').default,
  require('./electron').default
]

export default merge(...mixins)
