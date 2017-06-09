(function () {
  angular
    .module('arkclient')
    .controller('AddressbookController',
    ['$scope', '$mdDialog', "$mdToast", "storageService", "gettextCatalog", AddressbookController]);

  function AddressbookController($scope, $mdDialog, $mdToast, storageService, gettextCatalog) {

    var self = this;
    var contacts;

    self.getContacts = function () {
      self.contacts = storageService.get("contacts");
      if (self.contacts == null || self.contacts == undefined) self.contacts = [];
    }

    self.getContacts();

    self.save = function () {
      storageService.set("contacts", self.contacts);
      $scope.$apply;
    }

    self.isAddress = function (address) {
      var isAddress = /^[1-9A-Za-z]+$/g;
      return isAddress.test(address)
    }

    self.contactExists = function (name) {
      var i;
      for (i = 0; i < self.contacts.length; i++) {
        if (self.contacts[i].name == name) {
          return true;
        }
      }
      return false;
    }

    self.showToast = function (message, variable) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(gettextCatalog.getString(message) + variable)
          .hideDelay(5000)
      );
    }

    self.addAddressbookContact = function () {

      $scope.addAddressbookContact = {
        add: add,
        cancel: cancel
      };
      function cancel() {
        $mdDialog.hide();
      };

      function add(contactname, contactaddress) {
        self.getContacts();
        var newcontact = { name: contactname, address: contactaddress };
        if (self.contactExists(contactname)) {
          self.showToast('this Contact-Name is already taken, please choose another one: ', contactname);
          return;
        }
        if(!self.isAddress(contactaddress)) {
          self.showToast('this seems to be not a valid Address: ', contactaddress);
          return;
        }
        self.contacts.push(newcontact);
        self.save();
        self.showToast('Contact successfully added: ', contactname);
        cancel();
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/Addressbook/addAddressbookContact.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      });
    }

    self.editAddressbookContact = function (name, address) {

      $scope.editAddressbookContact = {
        cancel: cancel,
        save: save,
        remove: remove,
        name: name,
        address: address
      };
      function cancel() {
        $mdDialog.hide();
      };

      function save(name, address) {
        self.getContacts();
        if (!self.contactExists(name)) {
          self.showToast('this Contact-Name doesnt exist: ', name);
          return;
        }
        if(!self.isAddress(address)) {
          self.showToast('this seems to be not a valid Address: ', address);
          return;
        }
        for (i = 0; i < self.contacts.length; i++) {
          if (self.contacts[i].name == name) {
            self.contacts[i].address = address;
          }
        }
        self.save();
        self.showToast('Contact successfully saved: ', name);
        cancel();
      };

      function remove(name) {
        self.getContacts();
        if (!self.contactExists(name)) {
          self.showToast('this Contact-Name doesnt exist: ', name);
          return;
        }
        for (i = 0; i < self.contacts.length; i++) {
          if (self.contacts[i].name == name) {
            delete self.contacts[i];
            self.contacts.splice(i, 1);
          }
        }
        self.save();
        self.showToast('Contact successfully removed: ', name);
        cancel();
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/Addressbook/editAddressbookContact.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      });
    }

    self.openMenu = function ($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };
  }

})();