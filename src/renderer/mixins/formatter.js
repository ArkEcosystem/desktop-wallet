export default {
  methods: {
    formatter_percentage (value) {
      return `${this.$n(value, { minimumFractionDigits: 2 })}%`
    },

    formatter_networkCurrency (value, digits) {
      return this.currency_format(this.currency_subToUnit(value), { currencyFrom: 'network', maximumFractionDigits: digits })
    },

    formatter_votes (value) {
      return this.$n(this.currency_subToUnit(value), { maximumFractionDigits: 2 })
    }
  }
}
