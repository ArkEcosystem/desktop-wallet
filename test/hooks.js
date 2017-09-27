'use strict'

const Application = require('spectron').Application
const electron = require('electron')
const path = require('path')
const fs = require('fs')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const userData = require('./user_data')
const commands = require('./commands')

const timeout = process.env.CI ? 30000 : 10000

module.exports = function() {

  chai.should()
  chai.use(chaiAsPromised)

  this.timeout(timeout)

  before(function() {
    this.app = new Application({
      path: electron,
      args: [
        path.join(__dirname, '..')
      ],
      waitTimeout: timeout
    })
  })

  beforeEach(function() {
    userData.removeStoredPreferences()

    return this.app.start().then( app => {
      chaiAsPromised.transferPromiseness = app.transferPromiseness

      commands(app)

      return app.client.waitUntilWindowLoaded()
    })
  })

  afterEach(function() {
    if (this.app && this.app.isRunning())
      return this.app.stop()
  })

}
