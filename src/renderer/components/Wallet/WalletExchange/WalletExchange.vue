<template>
  <section>
    <div
      v-if="!isPurchaseEnabled"
      class="mx-auto w-1/3 flex flex-col items-center py-5"
    >
      <a
        href="#"
        alt="Changelly"
        @click.stop="openChangellyWebsite"
      >
        <img
          :src="changellyLogo"
          alt="Changelly"
        >
      </a>

      <div class="leading-normal mt-10 mb-5 text-justify">
        <p class="font-semibold text-lg mb-2">
          {{ $t('PAGES.WALLET_EXCHANGE.CHANGELLY_TERMS.TITLE', { ticker: currentTicker }) }}
        </p>
        <p>{{ $t('PAGES.WALLET_EXCHANGE.CHANGELLY_TERMS.CONTENT', { ticker: currentTicker }) }}</p>
      </div>

      <InputSwitch
        v-model="isChangellyEnabled"
        :is-reverse="true"
        :is-large="false"
        :text="$t('PAGES.WALLET_EXCHANGE.CHANGELLY_TERMS.CONFIRMATION')"
      />

      <div class="text-center mt-5">
        <button
          :disabled="!isChangellyEnabled"
          class="blue-button"
        >
          {{ $t('COMMON.CONFIRM') }}
        </button>
      </div>
    </div>

    <div v-else>
      Exchange
    </div>
  </section>
</template>

<script>
import { InputSwitch } from '@/components/Input'

export default {
  name: 'WalletExchange',

  components: {
    InputSwitch
  },

  data: () => ({
    isChangellyEnabled: false,
    isPurchaseEnabled: false
  }),

  computed: {
    hasDarkTheme () {
      return this.$store.getters['session/hasDarkTheme']
    },

    currentTicker () {
      return this.session_network.market.ticker
    },

    changellyLogo () {
      const filename = this.hasDarkTheme ? 'changelly-logo-dark' : 'changelly-logo'
      return this.assets_loadImage(`pages/${filename}.png`)
    }
  },

  methods: {
    openChangellyWebsite () {
      this.electron_openExternal('https://changelly.com')
    },

    openChangellyTerms () {
      this.electron_openExternal('https://changelly.com/terms-of-use')
    }
  }
}
</script>

<style>

</style>
