import setup from '@setup'
import Navbar from '@pages/Navbar'

describe('Navbar > navigation', () => {
  let scope = {}
  let browser
  let navbar

  beforeEach(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()

    const { actions } = scope
    browser = scope.browser
    navbar = new Navbar(browser)

    await actions.createProfile()
    await actions.setSessionProfile('e2e-fake-profile')
    await actions.skipIntroductionScreens()
  })

  afterEach(() => setup.stopApp(scope))

  it('should show the Ark logo', async () => {
    const $logo = navbar.$logo

    await expect(browser.isExisting($logo)).resolves.toBeTrue()
    await expect(browser.waitForVisible($logo, 1)).resolves.toBeTrue()
  })

  it('should show the wallets button', async () => {
    const $wallets = navbar.$wallets

    await expect(browser.isExisting($wallets)).resolves.toBeTrue()
    await expect(browser.waitForVisible($wallets, 1)).resolves.toBeTrue()
  })

  it('should show the contacts button', async () => {
    const $contacts = navbar.$contacts

    await expect(browser.isExisting($contacts)).resolves.toBeTrue()
    await expect(browser.waitForVisible($contacts, 1)).resolves.toBeTrue()
  })

  it('should show the announcements button', async () => {
    const $announcements = navbar.$announcements

    await expect(browser.isExisting($announcements)).resolves.toBeTrue()
    await expect(browser.waitForVisible($announcements, 1)).resolves.toBeTrue()
  })

  xdescribe('when there is not a new version of the app', () => {
    it('should not show the important notification button', async () => {
      expect(scope.isDisplayed(navbar.$importantNotifications)).toBeFalse()
    })
  })

  xdescribe('when there is a new version of the app', () => {
    it('should show the important notification button', async () => {
      expect(scope.isDisplayed(navbar.$importantNotifications)).toTrue()
    })
  })

  it('should show the settings button', async () => {
    const $settings = navbar.$settings

    await expect(browser.isExisting($settings)).resolves.toBeTrue()
    await expect(browser.waitForVisible($settings, 1)).resolves.toBeTrue()
  })

  it('should show the networks button', async () => {
    const $networks = navbar.$networks

    await expect(browser.isExisting($networks)).resolves.toBeTrue()
    await expect(browser.waitForVisible($networks, 1)).resolves.toBeTrue()
  })

  it('should show the profile avatar', async () => {
    const $profile = navbar.$profile

    await expect(browser.isExisting($profile)).resolves.toBeTrue()
    await expect(browser.waitForVisible($profile, 1)).resolves.toBeTrue()
  })
})
