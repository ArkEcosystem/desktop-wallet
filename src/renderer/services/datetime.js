import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import utc from 'dayjs/plugin/utc'

dayjs.extend(advancedFormat)
dayjs.extend(localizedFormat)
dayjs.extend(quarterOfYear)

// todo: do we default to UTC or local time?
dayjs.extend(utc)

export { dayjs }
