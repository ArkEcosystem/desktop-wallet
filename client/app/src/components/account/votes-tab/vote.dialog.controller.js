;(function () {
  'use strict'

  const MAXIMUM_VOTE_CNT = 101
  let VoteDialogController = function VoteDialogController ($mdDialog, accountService, toastService, accountObj, delegateToUnvote, passphrasesArr, activeDelegates, currentTheme) {
    this.account = accountObj
    this.delegateToUnvote = delegateToUnvote
    this.activeDelegates = activeDelegates
    this.delegate = {}
    this.theme = currentTheme
    this.hasSecondPassphrase = this.account.secondSignature
    this.passphrases = {
      first: passphrasesArr[0] ? passphrasesArr[0] : '',
      second: passphrasesArr[1] ? passphrasesArr[1] : ''
    }

    if (this.delegateToUnvote && this.delegateToUnvote.username) {
      this.delegate.name = this.delegateToUnvote.username
    }

    this.delegateExists = (delegateList = [], delegateToAdd) => {
      let foundDelegateIndex = delegateList.findIndex(delegate => {
        return delegate.username === delegateToAdd.username
      })

      return (foundDelegateIndex >= 0)
    }

    this.updateDelegateVote = (selectedDelegate) => {
      if (!angular.isArray(this.account.selectedVotes)) {
        this.account.selectedVotes = []
      }
      accountService.getDelegateByUsername(selectedDelegate.name).then(delegateObj => {
        if (this.delegateToUnvote || (this.account.selectedVotes.length < MAXIMUM_VOTE_CNT && !this.delegateExists(this.account.selectedVotes, delegateObj))) {
          $mdDialog.hide({ new_delegate: delegateObj, passphrases: this.passphrases })
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
    .controller('VoteDialogController', VoteDialogController)
})()
