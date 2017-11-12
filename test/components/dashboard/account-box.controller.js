'use strict'

describe('AccountBoxController', function () {
  const expect = chai.expect

  let ctrl

  const UNIT = 100000000
  const accounts = [
    { balance: 10 * UNIT },
    { balance: 15 * UNIT },
    { balance: 5 * UNIT },
    {}
  ]

  const bindings = {
    accountCtrl: {
      getAllAccounts () { return accounts },
      currency: {
        name: 'btc'
      },
      connectedPeer: {
        market: {
          price: {
            btc: '0.1' // Next year price? lol
          }
        }
      }
    }
  }

  beforeEach(() => {
    module('arkclient.components')

    inject(_$componentController_ => {
      ctrl = _$componentController_('accountBox', null, bindings)
    })
  })

  describe('myAccountsBalance()', () => {
    it('sums the balance (in ARK, formatted) of all accounts', function () {
      expect(ctrl.myAccountsBalance()).to.equal('30.00')
    })
  })

  describe('myAccountsCurrencyBalance()', () => {
    context('when it is connected to a maket', () => {
      it('sums the balance (in the configured currency, formatted) of all accounts', function () {
        expect(ctrl.myAccountsCurrencyBalance()).to.equal(3)
      })
    })

    context("when it isn't connected to a maket", () => {
      beforeEach(function () {
        ctrl.accountCtrl.connectedPeer = {}
      })

      it('returns 0', function () {
        expect(ctrl.myAccountsCurrencyBalance()).to.equal(0)
      })
    })
  })

  describe('refreshAccountBalances()', () => {
    context('when the balance of an account changes', () => {
      it('updates the balance', function () {
        expect(ctrl.myAccountsBalance()).to.equal('30.00')
        sinon.stub(bindings.accountCtrl, 'getAllAccounts').returns([
          { balance: 1 * UNIT },
          { balance: 17 * UNIT },
          { balance: 1 * UNIT },
          { balance: 1 * UNIT }
        ])
        ctrl.refreshAccountBalances()
        expect(ctrl.myAccountsBalance()).to.equal('20.00')
      })
    })
  })
})
