module.exports = function createProfile (vue, data = {}) {
  console.log('{createProfile}', data)

  const profile = Object.assign({
    id: 'e2e-fake-profile',
    avatar: 'avatars/1-male-blue.svg',
    background: 'textures/Isometropolis.jpg',
    currency: 'BTC',
    language: 'en-US',
    name: "I'm a scam",
    networkId: 'ark.devnet',
    theme: 'light'
  }, data)

  return vue.$store.dispatch('profile/create', profile)
}
