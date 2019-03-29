import setup from '@setup'

xdescribe('Profiles > display all profiles', () => {
  let scope = {}

  beforeAll(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()
  })

  afterAll(() => setup.stopApp(scope))

  xit('shows the add profile placeholder', async () => {
  })

  xit('shows all profiles', async () => {
  })
})
