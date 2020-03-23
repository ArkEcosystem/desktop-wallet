export default async synchronizer => {
  await synchronizer.$store.dispatch('peer/updatePeerSystem')
}
