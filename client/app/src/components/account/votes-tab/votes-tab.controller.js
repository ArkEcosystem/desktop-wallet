;(function () {
  'use strict'

  let VotesTabController = function VotesTabController ($scope, $mdDialog, accountService, transactionBuilderService, networkService, toastService, gettext, TRANSACTION_TYPES) {
    this.accountAddress = ''
    this.delegates = []
    this.network = networkService.getNetwork()
    this.voteModal = {}
    this.ul = {}

    this.$onInit = () => {
      this.ul = this.accountCtrl // TODO depricate
    }

    this.getDelegateList = (accountObj) => {
      let delegateList = []

      if (accountObj.selectedVotes) {
        delegateList = accountObj.selectedVotes.filter((item, index) => {
          return accountObj.selectedVotes.map(mapObj => mapObj.username).indexOf(item.username) === index
        })
      }

      return delegateList
    }

    this.vote = (accountObj, delegateToUnvote) => {
      this.voteModal = $mdDialog.show({
        templateUrl: './src/components/account/votes-tab/templates/vote.dialog.html',
        controller: 'VoteDialogController',
        controllerAs: '$dialog',
        clickOutsideToClose: false,
        resolve: {
          accountObj: () => accountObj,
          delegateToUnvote: () => delegateToUnvote,
          activeDelegates: () => {
            return accountService
              .getActiveDelegates()
              .then(delegates => delegates)
              .catch(() => {
                toastService.error(gettext('Could not fetch active delegates - please check your internet connection'))
              })
          },
          currentTheme: () => this.theme
        }
      })

      this.voteModal.then(payload => {
        if (payload.new_delegate) {
          let voteActionChar = delegateToUnvote ? '-' : '+'
          let transactionObj = {
            ledger: this.account.ledger,
            publicKey: this.account.publicKey,
            fromAddress: this.account.address,
            publicKeys: `${voteActionChar}${payload.new_delegate.publicKey}`,
            masterpassphrase: payload.passphrases.first,
            secondpassphrase: payload.passphrases.second
          }

          transactionBuilderService.createVoteTransaction(transactionObj).then((transaction) => {
            // TODO refactor this method to a service so we don't have to pass in the entire 'ul' ctrl. Callback in the interim
            this.ul.showValidateTransaction(this.account, transaction, (completedTransaction) => {
              if (delegateToUnvote) {
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

    this.openBlog = (uri) => {
      require('electron').shell.openExternal(`https://blog.ark.io${uri}`)
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
