
// Returns a sort function for the given prop
export function sortByProp (prop) {
  return (a, b) => a[prop].localeCompare(b[prop])
}
