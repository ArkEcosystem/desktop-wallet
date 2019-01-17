export default function truncate (value, limit = 10) {
  if (value && value.length <= limit) {
    return value
  }

  return value ? `${value.slice(0, limit)}…` : value
}
