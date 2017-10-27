'use strict'

const hooks = require('../hooks')

xdescribe('Create account', function () {
  hooks.createApp.bind(this)()

  before(function () {
    hooks.beforeBlock.bind(this)()
  })

  after(function () {
    return hooks.afterBlock.bind(this)()
  })

  before(function () {
    this.app.client.addCommand('createAccount', function (name) {
      return this
        .openSettingsMenu()
        .click('md-switch[aria-label="Play sound when receiving transactions?"]')
        .pause(4000)
    })
  })

  it('creates an account', function () {
    return this.app.client.createAccount()
  })
})
