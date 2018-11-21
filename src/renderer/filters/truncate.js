export default function truncate (value, limit = 10) {
  if (value.length <= limit) {
    return value
  }

  return `${value.slice(0, limit)}…`
}
