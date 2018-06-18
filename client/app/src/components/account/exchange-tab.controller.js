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

      let from
      let to = 'ARK'
      let address = ''
      let amount

      if (this.ul.network.token === 'DARK') {
        from = 'btc'
        amount = 0.1
      } else {
        to = this.ul.network.token

        // Use the current address to receive the ARKs
        if (to === 'ARK') {
          address = this.ul.selected.address
        }

        let pseudo = 500 * Math.random()
        pseudo = pseudo < 100 ? 100 : pseudo

        let price

        if (this.ul.btcValueActive) {
          from = this.ul.bitcoinCurrency.name
          price = this.ul.connectedPeer.market.price[from]
          amount = pseudo * price
        } else {
          from = this.ul.currency.name

          // If it's not 1 of these currencies, BTC would be used
          if (['eur', 'usd'].indexOf(from) !== -1) {
            price = (this.ul.connectedPeer.market.price[from] || 1)
            amount = pseudo / price
          } else {
            price = this.ul.connectedPeer.market.price.btc
            amount = pseudo * price
          }
        }
      }

      amount = amount.toFixed(2)

      // Ark logo colour: #ED2A2D rgb(237,42,45)
      const colour = 'ED2A2D'

      this.changellySrc = $sce.trustAsResourceUrl(`https://changelly.com/widget/v1?auth=email&from=${from}&to=${to}&merchant_id=${merchantId}&address=${address}&amount=${amount}&ref_id=${refId}&color=${colour}`)
    }
  }
})()
