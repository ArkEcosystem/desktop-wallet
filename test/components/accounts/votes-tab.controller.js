'use strict'

describe('VotesTabController', () => {
  const MOCK_DELEGATE = {
    address: 'mockDelegateArkAddress',
    approval: 89.09,
    missedblocks: 9760,
    producedblocks: 35226,
    productivity: 78.3,
    publicKey: 'mockDelegatePublicKey',
    rate: 1,
    username: 'mock_delegate',
    vote: '11512779451283196'
  }
  const MOCK_ACCOUNT_OBJ = {
    address: 'mockArkAddress',
    balance: '50000000000',
    delegate: null,
    ledger: null,
    publicKey: 'mockPublicKey',
    secondSignature: 0,
    selectedVotes: null,
    transactions: [],
    virtual: {
      getFolders: angular.noop,
      uservalue: angular.noop
    }
  }
  const expect = chai.expect
  const bindings = {
    account: angular.copy(MOCK_ACCOUNT_OBJ),
    accountCtrl: {
      showValidateTransaction: angular.noop
    },
    theme: {}
  }

  let ctrl,
    accountServiceMock,
    transactionBuilderServiceMock,
    mdDialogMock,
    toastServiceMock

  beforeEach(() => {
    accountServiceMock = {
      getActiveDelegates: angular.noop,
      getDelegateByUsername: angular.noop
    }
    transactionBuilderServiceMock = {
      createVoteTransaction: angular.noop
    }
    mdDialogMock = {
      show: angular.noop,
      hide: angular.noop
    }
    module('arkclient.components', $provide => {
      $provide.value('accountService', accountServiceMock)
      $provide.value('transactionBuilderService', transactionBuilderServiceMock)
      $provide.value('$mdDialog', mdDialogMock)
      $provide.value('toastService', toastServiceMock)
      $provide.value('ARKTOSHI_UNIT', Math.pow(10, 8))
      $provide.value('ARK_LAUNCH_DATE', new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0)))
      $provide.value('TRANSACTION_TYPES', {
        'SEND_ARK': 0,
        'CREATE_SECOND_PASSPHRASE': 1,
        'CREATE_DELEGATE': 2,
        'VOTE': 3
      })
    })

    inject((_$rootScope_, _$componentController_) => {
      ctrl = _$componentController_('votesTab', null, bindings)
    })
  })

  let mdDialogShowStub,
    createTransactionStub

  beforeEach(() => {
    createTransactionStub = sinon.stub(transactionBuilderServiceMock, 'createVoteTransaction').resolves({})
    mdDialogShowStub = sinon.stub(mdDialogMock, 'show').returns(new Promise((resolve, reject) => resolve({
      new_delegate: MOCK_DELEGATE,
      passphrases: {
        first: 'pass1',
        second: 'pass2'
      }
    })))
  })

  describe('getDelegateList()', () => {
    context('when the account is a valid account object', () => {
      it('should return a filtered list of selected votes if they exist', () => {
        let acctObj = angular.copy(ctrl.account)
        acctObj.selectedVotes = [{ username: 'foo' }, { username: 'bar' }, { username: 'baz' }, { username: 'baz' }]
        let delegateList = ctrl.getDelegateList(acctObj)
        expect(delegateList.length).to.equal(3)
      })
    })
  })
  describe('vote()', () => {
    afterEach(() => {
      ctrl.account.selectedVotes = []
    })
    context('when no delegateToRemove object is passed in', () => {
      it('should open the vote dialog', () => {
        ctrl.vote(ctrl.account)

        sinon.assert.calledOnce(mdDialogShowStub)
      })
      it('should create a transaction with a valid object when the dialog is closed with a new delegate payload', (done) => {
        ctrl.vote(ctrl.account)

        mdDialogShowStub().then(payload => {
          sinon.assert.calledWith(createTransactionStub, {
            ledger: ctrl.account.ledger,
            publicKey: ctrl.account.publicKey,
            fromAddress: ctrl.account.address,
            publicKeys: `+${payload.new_delegate.publicKey}`,
            masterpassphrase: payload.passphrases.first,
            secondpassphrase: payload.passphrases.second
          })

          done()
        }).catch(done)
      })
      it('should show the valid transaction dialog and receive a callback adding the delegate to the list', (done) => {
        ctrl.account.selectedVotes = []
        ctrl.ul.showValidateTransaction = (acct, trans, cb) => {
          const callbackObj = {}
          cb(callbackObj)
          expect(ctrl.account.selectedVotes.length).to.equal(1)
          done()
        }
        ctrl.vote(ctrl.account)
      })
    })
    context('when a delegateToRemove object is passed in', () => {
      it('should open the vote dialog', () => {
        ctrl.vote(ctrl.account, MOCK_DELEGATE)

        sinon.assert.calledOnce(mdDialogShowStub)
      })
      it('should create a transaction with a valid removal object when the dialog is closed an their is a delegate payload', (done) => {
        ctrl.vote(ctrl.account, MOCK_DELEGATE)

        mdDialogShowStub().then(payload => {
          sinon.assert.calledWith(createTransactionStub, {
            ledger: ctrl.account.ledger,
            publicKey: ctrl.account.publicKey,
            fromAddress: ctrl.account.address,
            publicKeys: `-${payload.new_delegate.publicKey}`,
            masterpassphrase: payload.passphrases.first,
            secondpassphrase: payload.passphrases.second
          })

          done()
        }).catch(done)
      })
      it('should show the valid transaction dialog and receive a callback removing the delegate to the list', (done) => {
        ctrl.account.selectedVotes = [angular.copy(MOCK_DELEGATE)]
        ctrl.ul.showValidateTransaction = (acct, trans, cb) => {
          const callbackObj = {}
          cb(callbackObj)
          expect(ctrl.account.selectedVotes.length).to.equal(0)
          done()
        }
        ctrl.vote(ctrl.account, MOCK_DELEGATE)
      })
    })
  })
})
