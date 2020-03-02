import dayjs from 'dayjs'

// todo: do we default to UTC or local time?
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export { dayjs }
