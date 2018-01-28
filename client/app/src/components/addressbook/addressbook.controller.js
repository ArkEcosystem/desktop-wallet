;(function () {
  'use strict'

  angular
    .module('arkclient.components')
    .controller('AddressbookController', ['$scope', '$mdDialog', 'toastService', 'storageService', 'gettextCatalog', 'gettext', 'accountService', 'utilityService', AddressbookController])

  function AddressbookController ($scope, $mdDialog, toastService, storageService, gettextCatalog, gettext, accountService, utilityService) {
    const self = this
    // var contacts
    self.trim = function (str) {
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    }

    self.getContacts = function () {
      self.contacts = storageService.get('contacts')
      if (self.contacts == null || self.contacts === undefined) self.contacts = []
      return self.contacts
    }

    self.getContacts()

    self.getContactFromAddress = function (address) {
      return self.contacts.find((c) => { return c.address === address })
    }

    self.save = function () {
      storageService.set('contacts', self.contacts)
      self.getContacts()
    }

    self.isAddress = function (address) {
      return require(require('path').resolve(__dirname, '../node_modules/arkjs')).crypto.validateAddress(address)
    }

    function existsIn (haystack, needle) {
      return haystack.indexOf(needle) !== -1
    }

    self.addressExists = function (address) {
      return existsIn(self.contacts.map(c => c.address), address)
    }

    self.contactExists = function (name) {
      return existsIn(self.contacts.map(c => c.name), name)
    }

    self.showToast = function (message, variable, error, stringParams) {
      if (error) {
        toastService.error(
          gettextCatalog.getString(message, stringParams) + (variable ? ' - ' + variable : ''),
          null,
          true
        )
      } else {
        toastService.success(
          gettextCatalog.getString(message, stringParams) + (variable ? ' - ' + variable : ''),
          null,
          true
        )
      }
    }

    self.addAddressbookContact = function (successCallback) {
      $scope.addAddressbookContact = {
        add: add,
        cancel: cancel
      }

      function cancel () {
        $mdDialog.hide()
      }

      function add (name, address) {
        self.getContacts()
        if (self.trim(name) === '') {
          self.showToast(gettext('This contact name is not valid'), name, true)
          return
        }
        if (self.trim(address) === '' || !self.isAddress(address)) {
          self.showToast(gettext('The address of this contact is not valid'), address, true)
          return
        }

        const newContact = { name: name, address: address }
        if (self.addressExists(address)) {
          self.showToast(gettext('A contact with this address already exists'), address, true)
          return
        }
        if (self.contactExists(name)) {
          self.showToast(gettext('A contact with this name already exists'), name, true)
          return
        }

        const knownAccounts = accountService.loadAllAccounts().reduce((all, account) => {
          if (account.virtual) {
            all.push(account)
          }
          return all
        }, [])

        if (existsIn(knownAccounts.map(a => a.address), address)) {
          self.showToast(gettext('This address is already used by another contact or account'), address, true)
          return
        }
        if (existsIn(knownAccounts.map(a => a.username), name)) {
          self.showToast(gettext('This name is already used by another contact or account'), name, true)
          return
        }

        self.contacts.push(newContact)
        self.save()
        self.showToast(gettext('Contact \'{{ name }}\' with address \'{{ address }}\' added successfully'), null, false, {name: name, address: address})
        if (successCallback) {
          successCallback()
        }
        cancel()
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/components/addressbook/addContact.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      })
    }

    self.editAddressbookContact = function (address) {
      const contact = self.getContactFromAddress(address)
      if (!contact) {
        self.showToast(gettext('This address is not a contact'), address, true)
        return
      }
      const name = contact.name

      $scope.editAddressbookContact = {
        cancel: cancel,
        save: save,
        remove: remove,
        name: name,
        address: address
      }

      function cancel () {
        $mdDialog.hide()
      }

      function save (name, address) {
        if (self.trim(name) === '') {
          self.showToast(gettext('This contact name is not valid'), name, true)
          return
        }
        if (self.trim(address) === '') {
          self.showToast(gettext('The address of this contact is not valid'), address, true)
          return
        }
        self.getContacts()
        if (!self.contactExists(name)) {
          self.showToast(gettext('A contact with this name doesn\'t exist'), name, true)
          return
        }
        if (!self.isAddress(address)) {
          self.showToast(gettext('The address of this contact is not valid'), address, true)
          return
        }
        for (let i = 0; i < self.contacts.length; i++) {
          if (self.contacts[i].name === name) {
            self.contacts[i].address = address
          }
        }
        self.save()
        self.showToast(gettext('Contact \'{{ name }}\' with address \'{{ address }}\' saved successfully'), null, false, {name: name, address: address})
        cancel()
      }

      function remove (name) {
        self.getContacts()
        if (!self.contactExists(name)) {
          self.showToast(gettext('A contact with this name doesn\'t exist'), name, true)
          return
        }
        for (let i = 0; i < self.contacts.length; i++) {
          if (self.contacts[i].name === name) {
            delete self.contacts[i]
            self.contacts.splice(i, 1)
          }
        }
        self.save()
        self.showToast(gettext('Contact successfully removed'), name, false)
        cancel()
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/components/addressbook/editContact.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      })
    }

    self.openMenu = function ($mdOpenMenu, ev) {
      $mdOpenMenu(ev)
    }

    self.getStats = function (account, contact) {
      let stats = {
        income: {
          amount: 0,
          transactions: 0
        },
        expend: {
          amount: 0,
          transactions: 0
        }
      }

      const transactions = storageService.get('transactions-' + account)

      if (transactions) {
        const incomeTx = transactions.filter((el) => {
          return el.senderId === contact
        })

        const expendTx = transactions.filter((el) => {
          return el.recipientId === contact
        })

        stats.income.transactions = incomeTx.length
        stats.expend.transactions = expendTx.length

        if (incomeTx.length > 0) {
          const incomeAmount = incomeTx.map((tx) => {
            return tx.amount
          }).reduce((prev, el) => {
            return prev + el
          })

          stats.income.amount = utilityService.arktoshiToArk(incomeAmount, false, 2)
        }

        if (expendTx.length > 0) {
          const expendAmount = expendTx.map((tx) => {
            return tx.amount
          }).reduce((prev, el) => {
            return prev + el
          })

          stats.expend.amount = utilityService.arktoshiToArk(expendAmount, false, 2)
        }
      }

      return stats
    }
  }
})()
