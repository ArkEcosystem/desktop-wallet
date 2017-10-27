'use strict'

const hooks = require('../hooks')

describe('Settings menu', function () {
  hooks.createApp.bind(this)()

  before(function () {
    return hooks.beforeBlock.bind(this)()
  })

  after(function () {
    return hooks.afterBlock.bind(this)()
  })

  describe('setting to play sound', function () {
    const playSoundSelector = 'md-switch[aria-label="Play sound when receiving transactions?"]'

    before(function () {
      this.app.client.addCommand('clickPlaySound', function () {
        return this
          .openSettingsMenu()
          .click(playSoundSelector)
          .pause(1000)
      })

      this.app.client.addCommand('getPlaySoundState', function () {
        return this.getAttribute(playSoundSelector, 'aria-checked')
      })
    })

    context('when is clicked', function () {
      let wasEnabled

      before(function () {
        return this.app.client.getLocalStorage('storage-mainnet')
          .then(storage => {
            wasEnabled = storage.playFundsReceivedSound
            return this.app.client.clickPlaySound()
          })
      })

      it('toggles the button', function () {
        const isEnabled = this.app.client.getPlaySoundState()
        if (wasEnabled) {
          return (isEnabled).should.not.be
        } else {
          return (isEnabled).should.equal('true')
        }
      })

      it('stores the new state inmediatly', function () {
        return this.app.client.getLocalStorage('storage-mainnet')
          .then(storage => {
            if (wasEnabled) {
              return (storage).should.not.have.key('playFundsReceivedSound')
            } else {
              return (storage.playFundsReceivedSound).should.be.true
            }
          })
      })
    })
  })
})
