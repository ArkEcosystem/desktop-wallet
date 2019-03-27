// Returns a sort function for the given prop
export function sortByProps (props, locale = undefined, options = null) {
  locale = locale || undefined
  options = options || { sensitivity: 'base', numeric: 'true' }

  if (!Array.isArray(props)) {
    props = [props]
  }

  return (a, b) => {
    for (let i = 0; i < props.length; i++) {
      const order = a[props[i]]
        .toString()
        .localeCompare(b[props[i]].toString(), locale, options)

      if (order !== 0) {
        return order
      }
    }
  }
}
