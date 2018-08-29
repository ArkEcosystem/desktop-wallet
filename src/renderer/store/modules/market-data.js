import db from '@/store/db/instance'
import DbModule from './db-module'
import MarketData from '@/models/market-data'
import MarketDataService from '@/services/market-data-service'

// TODO: Change to use token for current network
const marketDataService = new MarketDataService('ARK')

export default new DbModule('market-data', {
  actions: {
    async sync () {
      const data = await marketDataService.fetchMarketData()
      if (data) {
        this.dispatch('marketData/saveAndCache', {
          token: marketDataService.token,
          data
        })
      }
    },
    async saveAndCache (state, value) {
      try {
        for (const item of Object.values(value.data)) {
          const marketData = MarketData.fromObject(value.token, item)
          const found = await db.find(marketData.id)

          if (found) {
            await this.dispatch('marketData/update', marketData)
          } else {
            await this.dispatch('marketData/create', marketData)
          }
        }
      } catch (error) {
        // TODO alert/toast component
        console.error('Problem saving market data: ', error)
      }
    }
  },
  getters: {
    getMarketData: state => (token, currency) => {
      return state.all.find(record => record.token === token && record.currency === currency)
    },
    hasMarketData: state => (token, currency) => {
      return !!state.all.find(record => record.token === token && record.currency === currency)
    }
  }
})
