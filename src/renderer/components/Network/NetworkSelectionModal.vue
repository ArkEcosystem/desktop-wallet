<template>
  <ModalWindow
    :title="$t('MODAL_NETWORK_SELECTION.TITLE')"
    @close="emitCancel"
  >
    <div
      class="w-80 flex flex-col justify-center "
    >
      <!-- TODO: grid of networks -->
      <div class="NetworkSelectionModal__grid">

        <div
          v-for="network in getCustomNetworks()"
          :key="network.id"
        >
          <button
            :class="{ 'NetworkSelectionModal__network--selected' : selectedNetwork && selectedNetwork.id == network.id }"
            class="NetworkSelectionModal__network text-theme-page-text"
            @click="selectNetwork(network)"
          >
            <!-- TODO: image -->
            <img
              class="w-18 h-18"
              :src="`${assets_loadImage(network.svg)}`"
            >
            <div>{{ network.name }}</div>
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

  mounted () {
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
</style>
