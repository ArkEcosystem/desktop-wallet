import setup from '@setup'
import ProfileAll from '@pages/ProfileAll'

xdescribe('New profiles > create', () => {
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

  xit('should display the add balance of each network', async () => {
    const $header = profiles.$header

    await expect(browser.isExisting($header)).resolves.toBeTrue()
  })
})
