<template>
  <ModalWindow
    :title="$t('MODAL_NETWORK_SELECTION.TITLE')"
    @close="emitCancel"
  >
    <div
      class="w-80 flex flex-col justify-center "
    >
      <div class="NetworkSelectionModal__grid">
        <div
          v-for="network in getCustomNetworks()"
          :key="network.id"
        >
          <button
            v-tooltip="network.name"
            :class="{ 'NetworkSelectionModal__network--selected' : selectedNetwork && selectedNetwork.id == network.id }"
            class="NetworkSelectionModal__network text-theme-page-text w-full"
            @click="selectNetwork(network)"
          >
            <!-- TODO: make network.svg override the default placeholder when users can set their own icons -->
            <img
              class="w-18 h-18 p-2"
              :src="assets_loadImage('networks/default.svg')"
            >
            <div class="NetworkSelectionModal__network--name">
              {{ network.name | truncate(20) }}
            </div>
          </button>
        </div>
      </div>
      <button
        :disabled="!selectedNetwork"
        class="blue-button mt-5"
        type="button"
        @click="emitSelected"
      >
        {{ $t('COMMON.DONE') }}
      </button>
    </div>
  </ModalWindow>
</template>

<script>
import { ModalWindow } from '@/components/Modal'

export default {
  name: 'NetworkSelectionModal',

  components: {
    ModalWindow
  },

  props: {
    toggle: {
      type: Function,
      required: true
    }
  },

  data: () => {
    return {
      selectedNetwork: null
    }
  },

  methods: {
    getCustomNetworks () {
      return Object.values(this.$store.getters['network/customNetworks'])
    },

    selectNetwork (network) {
      this.selectedNetwork = network
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitSelected () {
      this.$emit('selected', this.selectedNetwork, this.toggle)
    }
  }
}
</script>

<style>
.NetworkSelectionModal__grid {
  display: grid;
  grid-template-columns: repeat(3, 4.5rem);
  grid-gap: 1rem;
}

.NetworkSelectionModal__network {
  @apply .rounded-lg .border-2 .border-transparent
}
.NetworkSelectionModal__network--selected {
  @apply .border-green
}
.NetworkSelectionModal__network--name {
  max-width: 4.5rem;
  @apply .break-words
}
</style>
