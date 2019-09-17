import release from '@/services/release'

const releaseUrl = 'https://github.com/ArkEcosystem/desktop-wallet/releases/latest'

describe('Services > Release', () => {
  describe('latestReleaseUrl', () => {
    it('returns the URL of the latest release endpoint', () => {
      expect(release.latestReleaseUrl).toEqual(releaseUrl)
    })
  })
})
