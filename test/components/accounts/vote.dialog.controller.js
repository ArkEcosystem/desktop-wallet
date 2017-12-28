'use strict'

describe('VotesTabController', function () {
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
  const MOCK_DELEGATES = [MOCK_DELEGATE]
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
  const dialogResolves = {
    accountObj: MOCK_ACCOUNT_OBJ,
    delegateToUnvote: null,
    passphrasesArr: [],
    activeDelegates: MOCK_DELEGATES,
    currentTheme: {}
  }
 
  let $scope,
    ctrl,
    accountServiceMock,
    mdDialogMock,
    toastServiceMock

  beforeEach(() => {
    accountServiceMock = {
      createTransaction: angular.noop,
      getActiveDelegates: angular.noop,
      getDelegateByUsername: angular.noop,
      getActiveDelegates: angular.noop
    }
    mdDialogMock = {
      show: angular.noop,
      hide: angular.noop
    }
    toastServiceMock = {
      error: angular.noop
    }
    module('arkclient.components', $provide => {
      $provide.value('accountService', accountServiceMock)
      $provide.value('$mdDialog', mdDialogMock)
      $provide.value('toastService', toastServiceMock)
    })

    inject((_$rootScope_, _$controller_) => {
      $scope = _$rootScope_.$new()
      ctrl = _$controller_('VoteModalController', Object.assign({ $scope }, dialogResolves))
    })
  })

  let getDelegateStub,
      mdDialogHideStub,
      toastServiceErrStub
  beforeEach(() => {
    getDelegateStub = sinon.stub(accountServiceMock, 'getDelegateByUsername').resolves(MOCK_DELEGATE)
    mdDialogHideStub = sinon.stub(mdDialogMock, 'hide')
    toastServiceErrStub = sinon.stub(toastServiceMock, 'error')
  })

  afterEach(() => {
    ctrl.delegateToUnvote = null
    ctrl.passphrases = {
      first: '',
      second: ''
    }
    ctrl.account.selectedVotes = null
  })

  describe('delegateExists()', () => {
    context('when a valid list of delegates is passed in', () => {
      it('should return a truthy value if the delegate in the list', () => {
        let foundDelegate = ctrl.delegateExists(MOCK_DELEGATES, MOCK_DELEGATE)
        expect(foundDelegate).to.be.ok
      })
      it('should return a falsy value if the delegate is not in the list', () => {
        let foundDelegate = ctrl.delegateExists(MOCK_DELEGATES, {username: 'foo'})
        expect(foundDelegate).to.not.be.ok
      })
    })
  })

  describe('updateDelegateVote()', () => {
    context('delegateToUnvote exists', () => {
      it('should fetch the delegate to be removed and close the dialog', (done) => {
        ctrl.delegateToUnvote = angular.copy(MOCK_DELEGATE)
        ctrl.passphrases = {
          first: 'pass1',
          second: 'pass2'
        }
        ctrl.updateDelegateVote({name: MOCK_DELEGATE.delegatename})

        getDelegateStub().then(() => {
          sinon.assert.calledWith(getDelegateStub, MOCK_DELEGATE.delegatename)
          sinon.assert.calledWith(mdDialogHideStub, sinon.match({
            new_delegate: MOCK_DELEGATE,
            passphrases: ctrl.passphrases
          }))

          done()
        }).catch(done)
      })
    })
    context('delegateToUnvote does not exist', () => {
      it('should fetch the delegate to be added', (done) => {
        ctrl.updateDelegateVote({name: MOCK_DELEGATE.delegatename})

        getDelegateStub().then(() => {
          sinon.assert.calledWith(getDelegateStub, MOCK_DELEGATE.delegatename)
          done()
        }).catch(done)
      })

      it('should close the dialog with the delegate information and passphrases', (done) => {
        ctrl.updateDelegateVote({name: MOCK_DELEGATE.delegatename})

        getDelegateStub().then(() => {
          sinon.assert.calledWith(mdDialogHideStub, sinon.match({
            new_delegate: MOCK_DELEGATE,
            passphrases: ctrl.passphrases
          }))
          done()
        }).catch(done)
      })

      it('should show a toast message if the selected delegate is already active', (done) => {
        ctrl.account.selectedVotes = [MOCK_DELEGATE]
        ctrl.updateDelegateVote({name: MOCK_DELEGATE.delegatename})

        getDelegateStub().then(() => {
          sinon.assert.calledOnce(toastServiceErrStub)

          done()
        }).catch(done)
      })

      it('should show a toast message if too many votes exist', (done) => {
        ctrl.account.selectedVotes = new Array(102)
        ctrl.updateDelegateVote({name: MOCK_DELEGATE.delegatename})

        getDelegateStub().then(() => {
          sinon.assert.calledOnce(toastServiceErrStub)

          done()
        }).catch(done)
      })
    })
  })
})
