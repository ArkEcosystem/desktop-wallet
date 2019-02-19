export default (scope) => {
  it('should render', async () => {
    const welcomeElement = await scope.isExisting('.AppIntro')
    expect(welcomeElement).toBeTrue()
  })

  it('click on start button', async () => {
    const buttonText = await scope.getText('.AppIntro__1__start-button')
    expect(buttonText).toEqual('Start')

    await scope.click('.AppIntro__1__start-button').pause(200)
    const hasIntroScreen = await scope.isExisting('.AppIntroScreen')
    expect(hasIntroScreen).toBeTrue()
  })

  it('read intro screens', async () => {
    while (await scope.isExisting('.AppIntroScreen__container__right__next')) {
      await scope.click('.AppIntroScreen__container__right__next')
      await scope.app.client.waitUntilWindowLoaded()
    }

    const hasProfileNew = await scope.isExisting('.ProfileNew')
    expect(hasProfileNew).toBeTrue()
  })
}
