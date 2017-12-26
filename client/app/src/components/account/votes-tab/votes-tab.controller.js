;(function () {
  'use strict'

  // TODO refactor into central config file
  const TRANSACTION_TYPES = {
    'SEND_ARK': 0,
    'CREATE_SECOND_PASSPHRASE': 1,
    'CREATE_DELEGATE': 2,
    'VOTE': 3,
  }

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

    this.vote = (account_obj, delegate_to_unvote) => {
      let voteModal = $mdDialog.show({
        templateUrl: './src/components/account/votes-tab/templates/vote.dialog.html',
        controller: 'VoteModalController',
        controllerAs: '$dialog',
        clickOutsideToClose: false,
        resolve: {
          accountObj: () =>  account_obj,
          delegateToUnvote: () => delegate_to_unvote,
          passphrasesArr: () => accountService.getPassphrases(this.account.address),
          activeDelegates: () => {
            return accountService
              .getActiveDelegates()
              .then(delegates => delegates)
              .catch(err => toastService.error('Could not fetch active delegates - please check your internet connection'))
          },
          currentTheme: () => this.theme
        }
      })

      voteModal.then(payload => {
        if (payload.new_delegate) {
          let vote_action_char = delegate_to_unvote ? '-' : '+'
          let transaction_obj = {
            ledger: this.account.ledger,
            publicKey: this.account.publicKey,
            fromAddress: this.account.address,
            publicKeys: `${vote_action_char}${payload.new_delegate.publicKey}`,
            masterpassphrase: payload.passphrases.first,
            secondpassphrase: payload.passphrases.second
          }
          accountService.createTransaction(TRANSACTION_TYPES.VOTE, transaction_obj).then((transaction) => {

            // TODO refactor this method to a service so we don't have to pass in the entire 'ul' ctrl
            this.ul.showValidateTransaction(this.account, transaction, (completed_transaction) => {
              if (delegate_to_unvote) {
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

  angular
    .module('arkclient.components')
    .component('votesTab', {
      templateUrl: 'src/components/account/votes-tab/templates/votes-tab.html',
      bindings: {
        account: '=',
        accountCtrl: '=', // TODO depricate
        theme: '<'
      },
      controller: VotesTabController
    })
})()
