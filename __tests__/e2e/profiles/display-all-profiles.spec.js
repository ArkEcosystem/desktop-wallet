import setup from '@setup'
import ProfileAll from '@pages/ProfileAll'

describe('Profiles > display all profiles', () => {
  let scope = {}
  let browser
  let profiles

  beforeAll(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()

    const { actions } = scope
    browser = scope.browser
    profiles = new ProfileAll(browser)

    await actions.createProfile()
    await actions.setSessionProfile('e2e-fake-profile')
    await actions.skipIntroductionScreens()

    await scope.navigateTo('/profiles')
  })

  afterAll(() => setup.stopApp(scope))

  describe('add profile placeholder', () => {
    it('should be displayed', async () => {
      const $addProfile = profiles.$addProfile

      await expect(browser.isExisting($addProfile)).resolves.toBeTrue()
      await expect(browser.waitForVisible($addProfile, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the new profile section', async () => {
        // Using `browser.click` doesn't work in this case
        await browser.specialClick(profiles.$addProfile)

        await expect(browser.getUrl()).resolves.toMatch('#/profiles/new')
      })
    })
  })

  xit('should display all profiles', async () => {
  })
})
