;(function () {
  'use strict'

  const MAXIMUM_VOTE_CNT = 101

  let VotesTabController = function VotesTabController ($scope, $mdDialog, accountService, networkService, toastService) {
    this.accountAddress = ''
    this.delegates = []
    this.network = networkService.getNetwork()

    this.getDelegateList = (account_obj) => {
      let delegate_list = account_obj.delegates

      if (account_obj.selectedVotes) {
        delegate_list = account_obj.selectedVotes.filter((vote, index, arr) => {
          return arr.indexOf(vote) == index
        })
      }

      return delegate_list
    }

    this.addDelegate = (account_obj) => {
      $mdDialog.show({
        templateUrl: './src/accounts/view/addDelegate.html',
        controller: 'AddDelegateModalController',
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
      }).then(new_delegate => {
        if (new_delegate) {
          this.account.selectedVotes.push(new_delegate)
        }
      })
    }

    this.openExplorer = (uri) => {
      require('electron').shell.openExternal(this.network.explorer + uri)
    }
  }

  let AddDelegateModalController = function AddDelegateModalController ($mdDialog, accountService, toastService, selectedVotes, activeDelegates) {
    this.selectedVotes = selectedVotes
    this.activeDelegates = activeDelegates
    this.delegate = {}

    this.delegateExists = (delegate_list = [], delegate_to_add) => {
      let found_delegate_index = delegate_list.findIndex(delegate => {
        return delegate.username === delegate_to_add.username
      })

      return (found_delegate_index >= 0)
    }

    this.addDelegate = (selected_delegate) => {
      accountService.getDelegateByUsername(selected_delegate.name).then(delegate_obj => {
        if (this.selectedVotes.length < MAXIMUM_VOTE_CNT && !this.delegateExists(this.selectedVotes, delegate_obj)) {
          $mdDialog.hide(delegate_obj)
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
        accountCtrl: '='
      },
      controller: VotesTabController
    })
    .controller('AddDelegateModalController', AddDelegateModalController)
})()
