<template>
  <div class="ProfileAll relative bg-theme-feature rounded-lg m-r-4 p-10">
    <h3>{{ $t('PAGES.PROFILE_ALL.HEADER') }} ({{ totalBalances.join(', ') }})</h3>

    <div class="ProfileAll__grid mt-10">
      <RouterLink
        :to="{ name: 'profile-new' }"
        class="ProfileAll__grid__profile flex flex-row w-full"
      >
        <div
          :style="`backgroundImage: url('${assets_loadImage(addProfileImagePath)}')`"
          :title="$t('PAGES.PROFILE_ALL.ADD_PROFILE')"
          class="profile-avatar-xl background-image flex"
        />
        <div class="ProfileAll__grid__profile__name font-semibold flex items-center">
          {{ $t('PAGES.PROFILE_ALL.ADD_PROFILE') }}
        </div>
      </RouterLink>

      <div
        v-for="profile in profiles"
        :key="profile.id"
        :class="{
          'ProfileAll__grid__profile--selected': profile.id === session_profile.id
        }"
        class="ProfileAll__grid__profile flex flex-row w-full"
      >
        <button
          :style="`backgroundImage: url('${assets_loadImage(profile.avatar)}')`"
          class="profile-avatar-xl background-image flex cursor-pointer"
          @click="selectProfile(profile.id)"
        />

        <div class="flex flex-col justify-start">
          <div class="ProfileAll__grid__profile__name font-semibold flex text-lg pl-4">
            {{ profile.name }}
          </div>

          <span class="font-bold my-2 text-lg pl-4">
            {{ profileBalance(profile) }}
          </span>

          <RouterLink
            :to="{ name: 'profile-edition', params: { profileId: profile.id } }"
            class="ProfileAll__grid__profile__edition-link font-semibold flex text-xs pl-4 mt-2 mb-1"
          >
            {{ $t('PAGES.PROFILE_ALL.EDIT_PROFILE') }}
          </RouterLink>

          <button
            class="ProfileAll__grid__profile__delete font-semibold flex text-xs cursor-pointer pl-4 text-theme-page-text-light hover:underline hover:text-red"
            @click="openRemovalConfirmation(profile)"
          >
            {{ $t('PAGES.PROFILE_ALL.REMOVE_PROFILE') }}
          </button>

          <a
            v-show="profile.id !== session_profile.id"
            class="ProfileAll__grid__profile__select font-semibold flex text-xs cursor-pointer pl-4 hover:underline mt-4"
            @click="selectProfile(profile.id)"
          >
            {{ $t('PAGES.PROFILE_ALL.SELECT_PROFILE') }}
          </a>
        </div>
      </div>
    </div>

    <ProfileRemovalConfirmation
      v-if="profileToRemove"
      :profile="profileToRemove"
      @cancel="hideRemovalConfirmation"
      @removed="onRemoval"
    />
  </div>
</template>

<script>
import { mapValues, uniqBy } from 'lodash'
import { mapGetters } from 'vuex'
import { ProfileRemovalConfirmation } from '@/components/Profile'

export default {
  name: 'ProfileAll',

  components: {
    ProfileRemovalConfirmation
  },

  data: () => ({
    profileToRemove: null
  }),

  computed: {
    ...mapGetters({ profiles: 'profile/all' }),
    addProfileImagePath () {
      return 'pages/new-profile-avatar.svg'
    },
    /**
     * Returns the sum of balances of all profile of each network and the Ledger
     * wallets
     * @return {Object}
     */
    aggregatedBalances () {
      const walletsByNetwork = this.profiles.reduce((all, profile) => {
        const wallets = this.$store.getters['wallet/byProfileId'](profile.id)
        return {
          ...all,
          [profile.networkId]: (all[profile.networkId] || []).concat(wallets)
        }
      }, {})

      // Add the Ledger wallets of the current network only
      if (!walletsByNetwork[this.session_network.id]) {
        walletsByNetwork[this.session_network.id] = []
      }
      walletsByNetwork[this.session_network.id] = [
        ...walletsByNetwork[this.session_network.id],
        ...this.$store.getters['ledger/wallets']
      ]

      return mapValues(walletsByNetwork, wallets => {
        return uniqBy(wallets, 'address').reduce((total, wallet) => total + wallet.balance, 0)
      })
    },
    /**
     * Returns the balances of each network, as a String
     * TODO: when new design is applied, sort by amount in session currency/fiat
     * @return {String}
     */
    totalBalances () {
      const balances = []
      for (const networkId in this.aggregatedBalances) {
        const network = this.$store.getters['network/byId'](networkId)
        const amount = this.currency_subToUnit(this.aggregatedBalances[networkId], network)
        const balance = this.currency_format(amount, { currency: network.symbol, maximumFractionDigits: network.fractionDigits })
        balances.push(balance)
      }
      return balances
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus()
      vm.$synchronizer.pause('market')
    })
  },

  methods: {
    hideRemovalConfirmation () {
      this.profileToRemove = null
    },

    onRemoval () {
      this.hideRemovalConfirmation()

      if (this.profiles.length) {
        this.$store.dispatch('session/setProfileId', this.profiles[0].id)
      } else {
        this.$store.dispatch('session/reset')
        this.$router.push({ name: 'profile-new' })
      }
    },

    openRemovalConfirmation (profile) {
      this.profileToRemove = profile
    },

    profileBalance (profile) {
      const balance = this.$store.getters['profile/balanceWithLedger'](profile.id)
      const network = this.$store.getters['network/byId'](profile.networkId)
      const amount = this.currency_subToUnit(balance, network)
      return this.currency_format(amount, { currency: network.symbol, maximumFractionDigits: network.fractionDigits })
    },

    selectProfile (profileId) {
      this.$store.dispatch('session/setProfileId', profileId)
    }
  }
}
</script>

<style lang="postcss" scoped>
.ProfileAll__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(var(--profile-avatar-xl) * 2));
  grid-gap: 1rem;
}
.ProfileAll__grid__profile {
  @apply .p-4 .border-transparent .border-2 .rounded-lg;
}
.ProfileAll__grid__profile:hover .profile-avatar-xl {
  transition: 0.5s;
  opacity: 0.5;
}
.ProfileAll__grid__profile--selected {
  @apply .border-green .border-2 .rounded-lg;
}
.ProfileAll__grid__profile__name {
  width: var(--profile-avatar-xl);
}
</style>
