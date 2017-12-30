;(function () {
  'use strict'

  angular
    .module('arkclient.components')
    .component('passphraseField', {
      templateUrl: 'src/components/passphrase-field/passphrase-field.html',
      bindings: {
        label: '@?',
        isOptional: '<?',
        tabIndex: '<?',
        autoFocus: '<?'
      },
      controller: PassphraseFieldController,
      controllerAs: '$pwc',
      require: {
        model: 'ngModel'
      }
    })

  function PassphraseFieldController ($scope) {
    this.$onInit = () => {
      const self = this
      this.model.$render = () => {
        self.value = self.model.$viewValue
      }
      this.tabIndex = typeof this.tabIndex === 'number' ? this.tabIndex : null
      this.autoFocus = typeof this.autoFocus === 'undefined' ? false : this.autoFocus
    }

    this.updateModel = () => {
      this.model.$setValidity('required', this.isOptional || this.value !== '')
      this.model.$setViewValue(this.value)
    }

    this.onQrCodeScanned = (passPhrase) => {
      this.value = passPhrase
      this.updateModel()
    }

    this.onChange = () => {
      this.updateModel()
    }
  }
})()
