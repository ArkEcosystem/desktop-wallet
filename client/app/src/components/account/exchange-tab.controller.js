;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('exchangeTab', {
      templateUrl: 'src/components/account/templates/exchange-tab.html',
      bindings: {
        accountCtrl: '='
      },
      controller: ExchangeTabController
    })

  function ExchangeTabController ($scope, $sce) {
    this.$onInit = () => {
      this.ul = this.accountCtrl

      const merchantId = 'bab9de3731aa'
      const refId = merchantId
      const from = 'USD'
      const to = 'ARK'
      const amount = 100
      const address = this.ul.selected.address
      // Ark logo colour: #ED2A2D rgb(237,42,45)
      const colour = 'ED2A2D'

      this.changellySrc = $sce.trustAsResourceUrl(`https://changelly.com/widget/v1?auth=email&from=${from}&to=${to}&merchant_id=${merchantId}&address=${address}&amount=${amount}&ref_id=${refId}&color=${colour}`)

      // TODO not enabled on devnet
    }
  }
})()
