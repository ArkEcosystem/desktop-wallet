import setup from '@setup'

xdescribe('Profiles > create new profiles', () => {
  let scope = {}

  beforeAll(async () => {
    await setup.startApp(scope)
    await scope.app.client.waitUntilWindowLoaded()
  })

  afterAll(() => setup.stopApp(scope))

  xit('shows the instructions section', async () => {
    const hasInstructions = await scope.isExisting('.ProfileNew__instructions')
    expect(hasInstructions).toBeTrue()
  })
})
