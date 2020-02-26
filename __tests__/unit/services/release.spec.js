import releaseService from '@/services/release'
import packageJson from '@package.json'

const releaseUrl = 'https://github.com/ArkEcosystem/desktop-wallet/releases/latest'

describe('Services > Release', () => {
  describe('currentVersion', () => {
    it('should return the current version', () => {
      expect(releaseService.currentVersion).toEqual(packageJson.version)
    })
  })

  describe('latestReleaseUrl', () => {
    it('should return the URL of the latest release endpoint', () => {
      expect(releaseService.latestReleaseUrl).toEqual(releaseUrl)
    })
  })
})
