module.exports = {
  type: 'object',
  properties: {
    integer: {
      type: 'integer'
    },
    date: {
      type: 'date',
      format: (data) => new Date(data.timestamp)
    },
    timestamp: {
      type: 'number'
    }
  },
  required: ['integer', 'timestamp']
}
