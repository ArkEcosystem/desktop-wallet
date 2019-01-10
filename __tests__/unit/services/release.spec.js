import release from '@/services/release'

const githubApiBase = 'https://api.github.com'
const releaseApiUrl = '/repos/ArkEcosystem/desktop-wallet/releases/latest'
const releaseUrl = 'https://github.com/ArkEcosystem/desktop-wallet/releases/latest'

describe('Services > Release', () => {
  describe('latestReleaseApiUrl', () => {
    it('returns the URL of the latest release API endpoint', () => {
      expect(release.latestReleaseApiUrl).toEqual(`${githubApiBase}${releaseApiUrl}`)
    })
  })

  describe('latestReleaseUrl', () => {
    it('returns the URL of the latest release endpoint', () => {
      expect(release.latestReleaseUrl).toEqual(releaseUrl)
    })
  })
})
