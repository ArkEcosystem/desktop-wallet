;(function () {
  'use strict'

  // TODO refactor into central config file
  const TRANSACTION_TYPES = {
    'SEND_ARK': 0,
    'CREATE_SECOND_PASSPHRASE': 1,
    'CREATE_DELEGATE': 2,
    'VOTE': 3,
  }
  const MAXIMUM_VOTE_CNT = 101

  let VotesTabController = function VotesTabController ($scope, $mdDialog, accountService, networkService, toastService) {
    this.accountAddress = ''
    this.delegates = []
    this.network = networkService.getNetwork()

    this.$onInit = () => {
      this.ul = this.accountCtrl // TODO depricate
    }

    this.getDelegateList = (account_obj) => {
      let delegate_list = account_obj.delegates

      if (account_obj.selectedVotes) {
        delegate_list = account_obj.selectedVotes.filter((vote, index, arr) => {
          return arr.indexOf(vote) == index
        })
      }

      return delegate_list
    }

    this.vote = (account_obj) => {
      $mdDialog.show({
        templateUrl: './src/accounts/view/vote.html',
        controller: 'VoteModalController',
        controllerAs: '$dialog',
        clickOutsideToClose: false,
        resolve: {
          selectedVotes: () => this.account.selectedVotes,
          activeDelegates: () => {
            return accountService
              .getActiveDelegates()
              .then(delegates => delegates)
              .catch(err => toastService.error('Could not fetch active delegates - please check your internet connection'))
          }
        }
      }).then(payload => {
        if (payload.new_delegate) {
          // this.account.selectedVotes.push(new_delegate)
          let passphrases = accountService.getPassphrases(this.account.address)
          accountService.createTransaction(TRANSACTION_TYPES.VOTE, {
            ledger: this.account.ledger,
            publicKey: this.account.publicKey,
            fromAddress: this.account.address,
            publicKeys: `+${payload.new_delegate.publicKey}`,
            masterpassphrase: payload.passphrases.first,
            secondpassphrase: payload.passphrases.second
          }).then(
            function (transaction) {
              // showValidateTransaction(this.account, transaction)
          }).catch(err => {
            toastService.error(err, 5000, true)
          })
        }
      })
    }

    this.openExplorer = (uri) => {
      require('electron').shell.openExternal(this.network.explorer + uri)
    }
  }

  let VoteModalController = function VoteModalController ($mdDialog, accountService, toastService, selectedVotes, activeDelegates) {
    this.selectedVotes = selectedVotes
    this.activeDelegates = activeDelegates
    this.delegate = {}
    this.passphrases = {
      first: '',
      second: ''
    }

    this.delegateExists = (delegate_list = [], delegate_to_add) => {
      let found_delegate_index = delegate_list.findIndex(delegate => {
        return delegate.username === delegate_to_add.username
      })

      return (found_delegate_index >= 0)
    }

    this.addDelegateVote = (selected_delegate) => {
      accountService.getDelegateByUsername(selected_delegate.name).then(delegate_obj => {
        if (this.selectedVotes.length < MAXIMUM_VOTE_CNT && !this.delegateExists(this.selectedVotes, delegate_obj)) {
          $mdDialog.hide({ new_delegate: delegate_obj, passphrases: this.passphrases })
        } else {
          toastService.error('List full or delegate already voted.')
        }
      }).catch(err => {
        // TODO refactor formatErrorMessage into service
        toastService.error(err, 5000, true)
      })
    }

    this.cancel = () => {
      $mdDialog.hide()
    }
  }

  angular
    .module('arkclient.components')
    .component('votesTab', {
      templateUrl: 'src/components/account/templates/votes-tab.html',
      bindings: {
        account: '=',
        accountCtrl: '=' // TODO depricate
      },
      controller: VotesTabController
    })
    .controller('VoteModalController', VoteModalController)
})()
