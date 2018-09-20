export default function truncateMiddle (value, limit = 10) {
  if (value.length <= limit) {
    return value
  }

  const lengthTruncation = Math.floor(limit / 2)
  const leftData = value.slice(0, lengthTruncation)
  const rightData = value.slice(value.length - lengthTruncation)

  return `${leftData}…${rightData}`
}
