import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'

dayjs.extend(advancedFormat)
// todo: do we default to UTC or local time?
dayjs.extend(utc)

export { dayjs }
