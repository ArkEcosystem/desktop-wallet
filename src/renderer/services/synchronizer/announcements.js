export default async synchronizer => {
  await synchronizer.$store.dispatch('announcements/fetch')
}
