/**
 * Builds a sorting function for the given properties
 * @param {*} props
 * @param {*} locale
 * @param {*} options
 * @return {Function} Return the sorting function
 */
export default function sortByProps (props, locale = undefined, options = null) {
  locale = locale || undefined
  options = options || { sensitivity: 'base', numeric: 'true' }

  if (!Array.isArray(props)) {
    props = [props]
  }

  return (a, b) => {
    for (let i = 0; i < props.length; i++) {
      const order = a[props[i]].toString().localeCompare(b[props[i]].toString(), locale, options)

      if (order !== 0) {
        return order
      }
    }
  }
}
