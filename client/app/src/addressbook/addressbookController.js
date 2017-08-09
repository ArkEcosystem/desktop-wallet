const ark = require('arkjs');

function addressbookController($scope, $mdDialog, $mdToast, storageService, gettextCatalog) {
  const self = this;
  let contacts;
  self.trim = function (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };

  self.getContacts = function () {
    self.contacts = storageService.get('contacts');
    if (self.contacts === null || self.contacts === undefined) self.contacts = [];
  };

  self.getContacts();

  self.save = function () {
    storageService.set('contacts', self.contacts);
    $scope.$apply();
  };

  self.isAddress = function (address) {
    return ark.crypto.validateAddress(address);
  };

  self.contactExists = function (name) {
    let i;
    for (i = 0; i < self.contacts.length; i++) {
      if (self.contacts[i].name === name) {
        return true;
      }
    }
    return false;
  };

  self.showToast = function (message, variable, error) {
    if (error) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(gettextCatalog.getString(message) + variable)
          .hideDelay(5000)
          .theme('error'));
    } else {
      $mdToast.show(
        $mdToast.simple()
          .textContent(gettextCatalog.getString(message) + variable)
          .hideDelay(5000));
    }
  };

  self.addAddressbookContact = function () {
    function cancel() {
      $mdDialog.hide();
    }

    function add(contactname, contactaddress) {
      self.getContacts();
      if (self.trim(contactname) === '') {
        self.showToast('this Contact-Name is not valid', contactname, true);
        return;
      }
      if (self.trim(contactaddress) === '') {
        self.showToast('this Contact-Address is not valid', contactaddress, true);
        return;
      }
      const newcontact = { name: contactname, address: contactaddress };
      if (self.contactExists(contactname)) {
        self.showToast('this Contact-Name is already taken, please choose another one: ', contactname, true);
        return;
      }
      if (!self.isAddress(contactaddress)) {
        self.showToast('this seems to be not a valid Address: ', contactaddress, true);
        return;
      }
      self.contacts.push(newcontact);
      self.save();
      self.showToast('Contact successfully added: ', contactname, false);
      cancel();
    }

    $scope.addAddressbookContact = {
      add,
      cancel
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'src/addressbook/view/addAddressbookContact.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
      fullscreen: true
    });
  };

  self.editAddressbookContact = function (name, address) {
    function cancel() {
      $mdDialog.hide();
    }

    function save(nameParam, addressParam) {
      if (self.trim(nameParam) === '') {
        self.showToast('this Contact-Name is not valid', nameParam, true);
        return;
      }
      if (self.trim(addressParam) === '') {
        self.showToast('this Contact-Address is not valid', addressParam, true);
        return;
      }
      self.getContacts();
      if (!self.contactExists(nameParam)) {
        self.showToast('this Contact-Name doesnt exist: ', nameParam, true);
        return;
      }
      if (!self.isAddress(addressParam)) {
        self.showToast('this seems to be not a valid Address: ', addressParam, true);
        return;
      }
      for (let i = 0; i < self.contacts.length; i++) {
        if (self.contacts[i].name === nameParam) {
          self.contacts[i].address = addressParam;
        }
      }
      self.save();
      self.showToast('Contact successfully saved: ', nameParam, false);
      cancel();
    }

    function remove(nameParam) {
      self.getContacts();
      if (!self.contactExists(nameParam)) {
        self.showToast('this Contact-Name doesnt exist: ', nameParam, true);
        return;
      }
      for (let i = 0; i < self.contacts.length; i++) {
        if (self.contacts[i].name === nameParam) {
          delete self.contacts[i];
          self.contacts.splice(i, 1);
        }
      }
      self.save();
      self.showToast('Contact successfully removed: ', nameParam, false);
      cancel();
    }

    $scope.editAddressbookContact = {
      cancel,
      save,
      remove,
      name,
      address
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'src/addressbook/view/editAddressbookContact.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
      fullscreen: true
    });
  };

  self.openMenu = function ($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  };
}

angular
  .module('arkclient.addressbook')
  .controller('AddressbookController',
    ['$scope', '$mdDialog', '$mdToast', 'storageService', 'gettextCatalog', addressbookController]);
