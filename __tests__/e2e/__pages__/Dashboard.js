import PageObject from '../__utils__/page-object'

export default class Dashboard extends PageObject {
  /**
   * Price of the network symbol
   */
  get $price () {
    return '.Dashboard > main > .text-theme-chart-price'
  }
  /**
   * Market chart
   */
  get $marketChart () {
    return '.MarketChart'
  }
  /**
   * Latest transactions
   */
  get $transactions () {
    return '.Dashboard__transactions'
  }
  /**
   * Create wallet button
   */
  get $createWallet () {
    return '.WalletButton__create'
  }
  /**
   * Import wallet button
   */
  get $importWallet () {
    return '.WalletButton__import'
  }
  /**
   * Wallets of the current profile
   */
  get $wallets () {
    return '.Dashboard__wallets__list'
  }
}
