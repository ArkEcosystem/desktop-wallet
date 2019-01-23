<template>
  <div class="NetworkOverview relative">
    <main class="flex h-full">
      <div
        class="NetworkOverview__instructions theme-dark bg-theme-feature text-theme-page-instructions-text hidden lg:flex flex-1 mr-4 rounded-lg overflow-y-auto"
      >
        <div class="m-auto w-3/5 text-center flex flex-col items-center justify-center">
          <h1 class="text-inherit">
            {{ $t('PAGES.NETWORK_OVERVIEW.INSTRUCTIONS.HEADER') }}
          </h1>
          <p class="text-center py-2 leading-normal">
            {{ $t('PAGES.NETWORK_OVERVIEW.INSTRUCTIONS.TEXT') }}
          </p>

          <img
            :src="assets_loadImage('pages/network-selection/background.svg')"
            :title="$t('PAGES.NETWORK_OVERVIEW.INSTRUCTIONS.HEADER')"
            class="w-full xl:w-4/5 mt-10"
          >
        </div>
      </div>

      <div class="flex-none w-full lg:max-w-sm bg-theme-feature rounded-lg overflow-y-auto p-10">
        <div
          class="NetworkOverview__network"
          @click="openAddNetwork()"
        >
          <a>{{ $t('PAGES.NETWORK_OVERVIEW.CREATE_NEW') }}</a>
          <NetworkModal
            v-if="selected === 'openAddNetwork'"
            :title="$t('PAGES.NETWORK_OVERVIEW.NEW_NETWORK')"
            @cancel="toggle"
            @saved="toggle"
            @removed="toggle"
          />
        </div>

        <!-- List of available networks -->
        <div
          v-for="network in networks"
          :key="network.id"
          class="NetworkOverview__network"
          @click="openNetwork(network.id)"
        >
          <!-- TODO: image? -->
          <div class="flex flex-col">
            <span class="text-theme-page-text font-bold text-lg">
              {{ network.title }}
            </span>
            <span class="text-theme-page-text-light">
              {{ network.description }}
            </span>
          </div>
          <NetworkModal
            v-if="selected === network.id"
            :network="network"
            :title="network.title"
            @cancel="toggle"
            @saved="toggle"
            @removed="toggle"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { NetworkModal } from '@/components/Network'

export default {
  name: 'NetworkOverview',

  components: {
    NetworkModal
  },

  props: {
  },

  data: () => ({
    networks: [],
    selected: null
  }),

  mounted () {
    this.getNetworks()
  },

  methods: {
    getNetworks () {
      const defaultNetworkIds = ['ark.mainnet', 'ark.devnet']

      this.networks = Object.values(this.$store.getters['network/all']).map(network => {
        return {
          ...network,
          isDefault: defaultNetworkIds.indexOf(network.id) > -1
        }
      })
    },
    openNetwork (network) {
      this.selected = network
    },
    openAddNetwork () {
      this.selected = 'openAddNetwork'
    },
    toggle () {
      this.selected = null
      this.getNetworks() // Refresh list
    }
  }
}
</script>

<style>
.NetworkOverview .Collapse.MenuStepItem .Collapse__handler {
  width: 100%;
  text-align: left;
  vertical-align: middle;
  pointer-events: none;
}

.NetworkOverview__instructions {
  background-size: cover;
  background-position: center center;
}

.NetworkOverview__network {
  cursor: pointer;
  @apply .p-4 .py-6 .border-b .border-dashed .border-theme-line-separator
}

.NetworkOverview__network:hover {
  @apply bg-theme-table-row-hover
}
</style>
