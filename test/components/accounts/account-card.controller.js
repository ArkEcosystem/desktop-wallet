'use strict'

describe('AccountCardController', function () {
  const expect = chai.expect

  let ctrl

  const bindings = {
    accountCtrl: {},
    gettextCatalog: {
      setStrings() {}
    },
    toastService: {
    }
  }

  const accountServiceMock = {
    createTransaction: sinon.stub()
  }

  beforeEach(() => {
    module('arkclient.components', ($provide) => {
      $provide.value('accountService', accountServiceMock)
    })

    inject( (_$componentController_) => {
      ctrl = _$componentController_('accountCard', null, bindings)
    })
  })

  describe('submitTransaction()', ()=> {

    context('when the form amount is a float', ()=> {
      it('uses the right amount to create the transaction', function() {
        accountServiceMock.createTransaction.resolves({})
        const stub = accountServiceMock.createTransaction

        // @see https://github.com/ArkEcosystem/ark-desktop/issues/385
        ctrl.submitTransaction({}, { amount: 1.0440473 })
        expect(stub.firstCall.args[1].amount).to.equal(104404730)

        ctrl.submitTransaction({}, { amount: 299.9 })
        expect(stub.secondCall.args[1].amount).to.equal(29990000000)
      })
    })
  })
})
