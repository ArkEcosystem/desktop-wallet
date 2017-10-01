'use strict'

const electron = require('electron')

const hooks = require('../hooks')
const userData = require('../user_data')

describe('ARK Client', function() {

  hooks.createApp.bind(this)()

  after(function() {
    return hooks.afterBlock.bind(this)()
  })

  describe('settings', ()=> {
    before(function() {
      return hooks.beforeBlock.bind(this)({ useRealPath: true, ignoreDangerousWarning: true })
    })

    it('use the hardcoded real path for userData', function () {
      return this.app.client
        .execute( ()=> electron.remote.app.getPath('userData') )
        .then( result => result.value )
        .should.eventually.equal(userData.getRealPath())
    })
  })

  describe('main window', ()=> {
    before(function() {
      return hooks.beforeBlock.bind(this)()
    })
    
    it('title is "Ark Client"', function () {
      return this.app.client.getWindowCount().should.eventually.equal(1)
        .browserWindow.isMinimized().should.eventually.be.false
        .browserWindow.isDevToolsOpened().should.eventually.be.false
        .browserWindow.isVisible().should.eventually.be.true
        .browserWindow.isFocused().should.eventually.be.true
        .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
        .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
        .browserWindow.getTitle().should.eventually.equal('Ark Client')
    })
  })

})
