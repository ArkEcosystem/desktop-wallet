export const type = 'object'
export const properties = {
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
}
export const required = ['integer', 'timestamp']
