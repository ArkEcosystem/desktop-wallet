export default (scope) => {
  it('should render', async () => {
    const welcomeElement = await scope.isExisting('.AppWelcome')
    expect(welcomeElement).toBeTrue()
  })

  it('click on start button', async () => {
    const buttonText = await scope.getText('.AppWelcome .blue-button')
    expect(buttonText).toEqual('Start')

    await scope.click('.AppWelcome .blue-button').pause(200)
    const hasIntroScreen = await scope.isExisting('.AppIntroScreen')
    expect(hasIntroScreen).toBeTrue()
  })

  it('read intro screens', async () => {
    while (await scope.isExisting('.AppIntroScreen__next')) {
      await scope.click('.AppIntroScreen__next')
      await scope.app.client.waitUntilWindowLoaded()
    }

    const finishButton = await scope.isExisting('.AppIntroScreen__finish')
    expect(finishButton).toBeTrue()

    await scope.click('.AppIntroScreen__finish').pause(200)

    const hasProfileNew = await scope.isExisting('.ProfileNew')
    expect(hasProfileNew).toBeTrue()
  })
}
