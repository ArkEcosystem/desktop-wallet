'use strict'

const hooks = require('../hooks')

xdescribe('Select network', function () {
  hooks.createApp.bind(this)()

  before(function () {
    return hooks.beforeBlock.bind(this)()
  })

  after(function () {
    return hooks.afterBlock.bind(this)()
  })

  before(function () {
    return this.app.client.addCommand('selectNetwork', function (network) {
      return this.click('[aria-label="Switch Network"] button')
        .pause(500)
        .click("//button[contains(text(), '" + network + "')]")
        .pause(500)
    })
  })

  context('when selecting the same network', () => {
    beforeEach(function () {
      return this.app.client.selectNetwork('TESTNET (TESTARK)')
    })
  })

  context('when selecting a different network', () => {
    beforeEach(function () {
      return this.app.client.selectNetwork('MAINNET (ARK)')
    })

    describe('"My Accounts" ', () => {
      it('changes the currency symbol')
    })
  })
})
