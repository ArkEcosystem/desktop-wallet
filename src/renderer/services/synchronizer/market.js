export default async synchronizer => {
  await synchronizer.$store.dispatch('market/refreshTicker')
}
