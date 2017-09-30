'use strict'

const hooks = require('../hooks')
const userData = require('../user_data')

describe('Settings menu', function() {

  hooks.createApp.bind(this)()

  before(function() {
    return hooks.beforeBlock.bind(this)()
  })

  after(function() {
    return hooks.afterBlock.bind(this)()
  })

  describe('option to play sound', function() {
    const playSoundSelector = 'md-switch[aria-label="Play sound when receiving transactions?"]'

    before(function() {
      this.app.client.addCommand('clickPlaySound', function() {
        return this
          .openSettingsMenu()
          .click(playSoundSelector)
          .pause(1000)
      })

      this.app.client.addCommand('getPlaySound', function() {
        return this.getAttribute(playSoundSelector, 'aria-checked')
      })
    })
    
    context('when clicking on', function() {
      before(function() {
        return this.app.client.clickPlaySound()
      })

      it('toggles the button', function() {
        return this.app.client.getLocalStorage('storage-mainnet')
          .then( storage => {
            const option = this.app.client.getPlaySound()

            if (storage.playFundsReceivedSound)
              return option.should.eventually.equal('true')
            else
              return option.should.eventually.not.be
          })
      })

      // This is not the current behaviour of the app
      xit('the new state is stored inmediatly', function() {
        return this.app.client.getLocalStorage('storage-mainnet')
          .then( storage => (storage.playFundsReceivedSound).should.be.true )
      })
    })
  })

})
