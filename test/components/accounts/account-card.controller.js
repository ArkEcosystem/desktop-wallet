'use strict'

describe('AccountCardController', () => {
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

  beforeEach(module('arkclient.constants'))

  beforeEach(() => {
    module('arkclient.components', $provide => {
      $provide.value('accountService', accountServiceMock)
      $provide.value('transactionBuilderService', transactionBuilderServiceMock)
      $provide.value('$mdDialog', mdDialogMock)
    })

    inject(_$componentController_ => {
      ctrl = _$componentController_('accountCard', null, bindings)
    })
  })

  describe('accountMenuItems()', () => {
    let items

    beforeEach(() => {
      items = ctrl.accountMenuItems({})
    })

    it('includes an "Open in explorer" action', () => {
      expect(items[0]).to.eql({ name: 'Open in explorer', icon: 'open_in_new' })
    })

    context("when the account doesn't use a Ledger", () => {
      it('includes a "Remove" action', () => {
        expect(items[1]).to.eql({ name: 'Remove', icon: 'delete' })

        items = ctrl.accountMenuItems({ ledger: true })
        expect(items.map(i => i.name)).to.not.include('Remove')
      })
    })

    context("when the account isn't a delegate", () => {
      it('includes a "Label" action', () => {
        expect(items[2]).to.eql({ name: 'Label', icon: 'local_offer' })

        items = ctrl.accountMenuItems({ delegate: true })
        expect(items.map(i => i.name)).to.not.include('Label')
      })
    })

    context("when the account doesn't use a Ledger and isn't a delegate", () => {
      it('includes a "Label" action', () => {
        expect(items[3]).to.eql({ name: 'Register Delegate', icon: 'perm_identity' })

        items = ctrl.accountMenuItems({ ledger: true })
        expect(items.map(i => i.name)).to.not.include('Register Delegate')
        items = ctrl.accountMenuItems({ delegate: true })
        expect(items.map(i => i.name)).to.not.include('Register Delegate')
      })
    })

    it('shows a "Timestamp Document" action', () => {
      it('includes a "Label" action', () => {
        expect(items[4]).to.eql({ name: 'Timestamp Document', icon: 'verified_user' })
      })
    })

    context("when the account doesn't have a second signagure and doesn't use a Ledger", () => {
      it('includes a "Label" action', () => {
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

    afterEach(() => {
      accountServiceMock.removeAccount.reset()
    })

    it('removes the account', () => {
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

    afterEach(() => {
      mdDialogMock.show.reset()
      mdDialogMock.prompt.reset()
      accountServiceMock.setUsername.reset()
    })

    it('updates the label of the account', () => {
      mdDialogMock.show.resolves('New label')

      return ctrl.promptLabel(account).then(() => {
        expect(accountServiceMock.setUsername.firstCall.args).to.eql([account.address, 'New label'])
      })
    })

    it('uses the current label of the account as the initial value', () => {
      accountServiceMock.getUsername.withArgs(account.address).returns('Old label')
      // Fake that works to not fail when calling `then`
      mdDialogMock.show.resolves()

      ctrl.promptLabel(account)
      expect(mdDialogMock.prompt.firstCall.args[0].initialValue).to.eql('Old label')
    })
  })
})
