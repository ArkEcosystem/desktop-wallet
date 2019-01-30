
// Returns a sort function for the given prop
export function sortByProps (props, locale = undefined, options = null) {
  locale = locale || undefined
  options = options || { sensitivity: 'base', numeric: 'true' }

  return (a, b) => {
    if (!Array.isArray(props)) {
      props = [props]
    }

    for (let i = 0; i < props.length; i++) {
      const order = a[props[i]].localeCompare(b[props[i]], locale, options)

      if (order !== 0) {
        return order
      }
    }
  }
}
