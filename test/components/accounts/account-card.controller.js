'use strict'

describe('AccountCardController', function () {
  const expect = chai.expect

  let ctrl

  const bindings = {
    accountCtrl: {},
    gettextCatalog: {
      setStrings () {}
    },
    toastService: {}
  }

  const accountServiceMock = {
    getUsername: sinon.stub(),
    setUsername: sinon.stub(),
    removeAccount: sinon.stub(),
    loadAllAccounts: sinon.stub()
  }

  const transactionBuilderServiceMock = {
    createSendTransaction: sinon.stub()
  }

  const mdDialogMock = {
    confirm: sinon.stub(),
    prompt: sinon.stub(),
    show: sinon.stub()
  }

  beforeEach(() => {
    module('arkclient.components', $provide => {
      $provide.value('accountService', accountServiceMock)
      $provide.value('transactionBuilderService', transactionBuilderServiceMock)
      $provide.value('$mdDialog', mdDialogMock)
      $provide.value('ARKTOSHI_UNIT', Math.pow(10, 8))
    })

    inject(_$componentController_ => {
      ctrl = _$componentController_('accountCard', null, bindings)
    })
  })

  describe('accountMenuItems()', () => {
    let items

    beforeEach(function () {
      items = ctrl.accountMenuItems({})
    })

    it('includes an "Open in explorer" action', function () {
      expect(items[0]).to.eql({ name: 'Open in explorer', icon: 'open_in_new' })
    })

    context("when the account doesn't use a Ledger", () => {
      it('includes a "Remove" action', function () {
        expect(items[1]).to.eql({ name: 'Remove', icon: 'clear' })

        items = ctrl.accountMenuItems({ ledger: true })
        expect(items.map(i => i.name)).to.not.include('Remove')
      })
    })

    context("when the account isn't a delegate", () => {
      it('includes a "Label" action', function () {
        expect(items[2]).to.eql({ name: 'Label', icon: 'local_offer' })

        items = ctrl.accountMenuItems({ delegate: true })
        expect(items.map(i => i.name)).to.not.include('Label')
      })
    })

    context("when the account doesn't use a Ledger and isn't a delegate", () => {
      it('includes a "Label" action', function () {
        expect(items[3]).to.eql({ name: 'Register Delegate', icon: 'perm_identity' })

        items = ctrl.accountMenuItems({ ledger: true })
        expect(items.map(i => i.name)).to.not.include('Register Delegate')
        items = ctrl.accountMenuItems({ delegate: true })
        expect(items.map(i => i.name)).to.not.include('Register Delegate')
      })
    })

    it('shows a "Timestamp Document" action', function () {
      it('includes a "Label" action', function () {
        expect(items[4]).to.eql({ name: 'Timestamp Document', icon: 'verified_user' })
      })
    })

    context("when the account doesn't have a second signagure and doesn't use a Ledger", () => {
      it('includes a "Label" action', function () {
        expect(items[5]).to.eql({ name: 'Second Passphrase', icon: 'lock' })

        items = ctrl.accountMenuItems({ ledger: true })
        expect(items.map(i => i.name)).to.not.include('Second Passphrase')
        items = ctrl.accountMenuItems({ secondSignature: true })
        expect(items.map(i => i.name)).to.not.include('Second Passphrase')
      })
    })
  })

  describe('confirmRemoval', () => {
    const account = { address: 'Axmp' }

    afterEach(function () {
      accountServiceMock.removeAccount.reset()
    })

    it('removes the account', function () {
      mdDialogMock.confirm.returns({})
      mdDialogMock.show.resolves()
      accountServiceMock.removeAccount.resolves()

      return ctrl.confirmRemoval(account).then(() => {
        expect(accountServiceMock.removeAccount.firstCall.args).to.eql([account])
      })
    })
  })

  describe('promtpLabel()', () => {
    const account = { address: 'Axmp' }

    afterEach(function () {
      mdDialogMock.show.reset()
      mdDialogMock.prompt.reset()
      accountServiceMock.setUsername.reset()
    })

    it('updates the label of the account', function () {
      mdDialogMock.show.resolves('New label')

      return ctrl.promptLabel(account).then(() => {
        expect(accountServiceMock.setUsername.firstCall.args).to.eql([account.address, 'New label'])
      })
    })

    it('uses the current label of the account as the initial value', function () {
      accountServiceMock.getUsername.withArgs(account.address).returns('Old label')
      // Fake that works to not fail when calling `then`
      mdDialogMock.show.resolves()

      ctrl.promptLabel(account)
      expect(mdDialogMock.prompt.firstCall.args[0].initialValue).to.eql('Old label')
    })
  })

  describe('submitTransaction()', () => {
    afterEach(function () {
      transactionBuilderServiceMock.createSendTransaction.reset()
    })

    context('when the form amount is a float', () => {
      it('uses the right amount to create the transaction', function () {
        transactionBuilderServiceMock.createSendTransaction.resolves({})
        const stub = transactionBuilderServiceMock.createSendTransaction

        // @see https://github.com/ArkEcosystem/ark-desktop/issues/385
        ctrl.submitTransaction({}, { amount: 1.0440473 })
        expect(stub.firstCall.args[0].amount).to.equal(104404730)

        ctrl.submitTransaction({}, { amount: 299.9 })
        expect(stub.secondCall.args[0].amount).to.equal(29990000000)
      })
    })
  })
})
