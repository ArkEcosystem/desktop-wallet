export default async synchronizer => {
  await synchronizer.$store.dispatch('ledger/reloadWallets', { useCachedWallets: false })
}
