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

    await scope.navigateTo('/')
  })

  afterEach(() => setup.stopApp(scope))

  describe('Ark logo', () => {
    it('should be displayed', async () => {
      const $logo = navbar.$logo

      await expect(browser.isExisting($logo)).resolves.toBeTrue()
      await expect(browser.waitForVisible($logo, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the wallets section', async () => {
        await scope.navigateTo('/announcements')

        // Using `browser.click` doesn't work in this case
        await browser.specialClick(navbar.$logo)

        await expect(browser.getUrl()).resolves.toMatch(/index\.html#\/$/)
      })
    })
  })

  describe('wallets button', () => {
    it('should be displayed', async () => {
      const $wallets = navbar.$wallets

      await expect(browser.isExisting($wallets)).resolves.toBeTrue()
      await expect(browser.waitForVisible($wallets, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the wallets section', async () => {
        // Using `browser.click` doesn't work in this case
        await browser.specialClick(navbar.$wallets)

        await expect(browser.getUrl()).resolves.toMatch('#/wallet/all')
      })
    })
  })

  describe('contacts button', () => {
    it('should be displayed', async () => {
      const $contacts = navbar.$contacts

      await expect(browser.isExisting($contacts)).resolves.toBeTrue()
      await expect(browser.waitForVisible($contacts, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the contacts section', async () => {
        // Using `browser.click` doesn't work in this case
        await browser.specialClick(navbar.$contacts)

        await expect(browser.getUrl()).resolves.toMatch('#/contacts/all')
      })
    })
  })

  describe('announcements button', () => {
    it('should be displayed', async () => {
      const $announcements = navbar.$announcements

      await expect(browser.isExisting($announcements)).resolves.toBeTrue()
      await expect(browser.waitForVisible($announcements, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the announcements section', async () => {
        // Using `browser.click` doesn't work in this case
        await browser.specialClick(navbar.$announcements)

        await expect(browser.getUrl()).resolves.toMatch('#/announcements')
      })
    })
  })

  xdescribe('when there is not a new version of the app', () => {
    it('should not display the important notification button', async () => {
      expect(scope.isDisplayed(navbar.$importantNotifications)).toBeFalse()
    })
  })

  xdescribe('when there is a new version of the app', () => {
    it('should display the important notification button', async () => {
      expect(scope.isDisplayed(navbar.$importantNotifications)).toTrue()
    })
  })

  describe('profile avatar', () => {
    it('should be displayed', async () => {
      const $profile = navbar.$profile

      await expect(browser.isExisting($profile)).resolves.toBeTrue()
      await expect(browser.waitForVisible($profile, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the profiles section', async () => {
        // Using `browser.click` doesn't work in this case
        await browser.specialClick(navbar.$profile)

        await expect(browser.getUrl()).resolves.toMatch('#/profiles')
      })
    })
  })
})
