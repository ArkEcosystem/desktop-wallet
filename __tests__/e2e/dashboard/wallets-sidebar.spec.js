import setup from '@setup'
import Dashboard from '@pages/Dashboard'

describe('Dashboard > wallets sidebar', () => {
  let scope = {}
  let browser
  let dashboard

  beforeEach(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()

    const { actions } = scope
    browser = scope.browser
    dashboard = new Dashboard(browser)

    await actions.createProfile()
    await actions.setSessionProfile('e2e-fake-profile')
    await actions.skipIntroductionScreens()

    await scope.navigateTo('/')
  })

  afterEach(() => setup.stopApp(scope))

  describe('create wallet button', () => {
    it('should be displayed', async () => {
      const $createWallet = dashboard.$createWallet

      await expect(browser.isExisting($createWallet)).resolves.toBeTrue()
      await expect(browser.waitForVisible($createWallet, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the new wallet page', async () => {
        await browser.click(dashboard.$createWallet)
        await expect(browser.getUrl()).resolves.toMatch('#/wallets/new')
      })
    })
  })

  describe('import wallet button', () => {
    it('should be displayed', async () => {
      const $importWallet = dashboard.$importWallet

      await expect(browser.isExisting($importWallet)).resolves.toBeTrue()
      await expect(browser.waitForVisible($importWallet, 1)).resolves.toBeTrue()
    })

    describe('clicking on it', () => {
      it('should navigate to the import wallet page', async () => {
        await browser.click(dashboard.$importWallet)
        await expect(browser.getUrl()).resolves.toMatch('#/wallets/import')
      })
    })
  })

  xdescribe('wallet list', () => {
    it('should display all the wallets of the profile', async () => {
      const $wallets = dashboard.$wallets

      await expect(browser.isExisting($wallets)).resolves.toBeTrue()
      await expect(browser.waitForVisible($wallets, 1)).resolves.toBeTrue()
    })

    describe('clicking on a wallet', () => {
      it('should navigate to that wallet page', async () => {
        await browser.click(dashboard.$wallets)
        await expect(browser.getUrl()).resolves.toMatch('#/wallets/import')
      })
    })
  })
})
