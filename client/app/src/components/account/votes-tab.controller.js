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

    this.vote = (account_obj, delegate_to_unvote, remove) => {
      $mdDialog.show({
        templateUrl: './src/accounts/view/vote.html',
        controller: 'VoteModalController',
        controllerAs: '$dialog',
        clickOutsideToClose: false,
        resolve: {
          delegate_to_unvote: () => delegate_to_unvote,
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
          let vote_action_char = remove ? '-' : '+'
          let passphrases = accountService.getPassphrases(this.account.address)
          let transaction_obj = {
            ledger: this.account.ledger,
            publicKey: this.account.publicKey,
            fromAddress: this.account.address,
            publicKeys: `${vote_action_char}${payload.new_delegate.publicKey}`,
            masterpassphrase: payload.passphrases.first,
            secondpassphrase: payload.passphrases.second
          }

          console.log('create ', transaction_obj)
          accountService.createTransaction(TRANSACTION_TYPES.VOTE, transaction_obj).then((transaction) => {
              this.ul.showValidateTransaction(this.account, transaction, (completed_transaction) => {
                console.log('completed_transaction ', completed_transaction)
                if (remove) {
                  this.account.selectedVotes = []
                } else {
                  this.account.selectedVotes.push(payload.new_delegate)
                }
              })
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

  let VoteModalController = function VoteModalController ($mdDialog, accountService, toastService, delegate_to_unvote, selectedVotes, activeDelegates) {
    this.delegate_to_unvote = delegate_to_unvote
    this.selectedVotes = selectedVotes
    this.activeDelegates = activeDelegates
    this.delegate = {}
    this.passphrases = {
      first: '',
      second: ''
    }

    if (this.delegate_to_unvote && this.delegate_to_unvote.username) {
      this.delegate.name = this.delegate_to_unvote.username
    }

    this.delegateExists = (delegate_list = [], delegate_to_add) => {
      let found_delegate_index = delegate_list.findIndex(delegate => {
        return delegate.username === delegate_to_add.username
      })

      return (found_delegate_index >= 0)
    }

    this.removeDelegateVote = (selected_delegate) => {
      accountService.getDelegateByUsername(selected_delegate.name).then(delegate_obj => {
        $mdDialog.hide({ new_delegate: delegate_obj, passphrases: this.passphrases })
      })
    }
    this.addDelegateVote = (selected_delegate) => {
      accountService.getDelegateByUsername(selected_delegate.name).then(delegate_obj => {
        if (this.delegate_to_unvote || (this.selectedVotes.length < MAXIMUM_VOTE_CNT && !this.delegateExists(this.selectedVotes, delegate_obj))) {
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
