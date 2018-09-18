<template>
  <div class="bg-white rounded-b-lg p-5">
    <MarketChart>
      <MarketChartButtons class="mb-5 text-right" />
    </MarketChart>
  </div>
</template>

<script>
import { MarketChart, MarketChartButtons } from '@/components/MarketChart'

export default {
  name: 'WalletStatistics',

  components: {
    MarketChart,
    MarketChartButtons
  }
}
</script>
