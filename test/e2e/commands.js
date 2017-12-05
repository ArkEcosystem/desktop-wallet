module.exports = function (app) {
  app.client.addCommand('getLocalStorage', function (key) {
    return this.localStorage('GET', key)
      .then(data => JSON.parse(data.value))
  })

  app.client.addCommand('setLocalStorage', function (key, value) {
    return this.localStorage('POST', { key: key, value: JSON.stringify(value) })
  })

  app.client.addCommand('openSettingsMenu', function (network) {
    return this.click('[aria-label="Settings"] button')
      .pause(500)
  })

  app.client.addCommand('createNetwork', function (network) {
    // Manage Networks
    // New
    // Name + Seed Server
    // return this.click('[aria-label="Switch Network"] button')
    //   .pause(500)
    //   .click("//button[contains(text(), '"+network+"')]")
    //   .pause(500)
  })
}
