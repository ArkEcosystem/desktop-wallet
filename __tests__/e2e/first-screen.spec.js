import setup from '@setup'

describe('First screen', () => {
  const scope = {}

  beforeEach(async () => setup.startApp(scope), 10000)
  afterEach(() => setup.stopApp(scope), 10000)

  xdescribe('when there is no profile', () => {
    it('redirects to the profile creation page', async () => {
      const profileNewPage = await scope.isExisting('.ProfileNew')
      expect(profileNewPage).toBeTruthy()
    })
  })

  describe('when there is a profile', () => {
    xit('routes to the dashboard', async () => {
      const dashboardPage = await scope.isExisting('.Dashboard')
      expect(dashboardPage).toBeTruthy()
    })
  })
})
