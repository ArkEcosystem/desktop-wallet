'use strict'

const hooks = require(require('path').resolve(__dirname, '../hooks'))

xdescribe('Create network', function () {
  hooks.createApp.bind(this)()

  before(function () {
    return hooks.beforeBlock.bind(this)()
  })

  after(function () {
    return hooks.afterBlock.bind(this)()
  })

  context('after creating the network', () => {
    before(function () {
      return this.app.client.createNetwork('E2ENET')
    })

    it('appears on the "Switch Network" dropdown')
  })
})
