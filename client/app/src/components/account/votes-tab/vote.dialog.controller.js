;(function () {
  'use strict'

  const MAXIMUM_VOTE_CNT = 101
  let VoteModalController = function VoteModalController ($mdDialog, accountService, toastService, accountObj, delegateToUnvote, passphrasesArr, activeDelegates, currentTheme) {
    this.account = accountObj
    this.delegate_to_unvote = delegateToUnvote
    this.activeDelegates = activeDelegates
    this.delegate = {}
    this.theme = currentTheme
    this.passphrases = {
      first: passphrasesArr[0] ? passphrasesArr[0] : '',
      second: passphrasesArr[1] ? passphrasesArr[1] : ''
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
        if (this.delegate_to_unvote || (this.account.selectedVotes.length < MAXIMUM_VOTE_CNT && !this.delegateExists(this.account.selectedVotes, delegate_obj))) {
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
    .controller('VoteModalController', VoteModalController)
})()
