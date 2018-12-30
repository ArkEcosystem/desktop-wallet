export default async synchronizer => {
  await synchronizer.$store.dispatch('network/fetchFees')
}
