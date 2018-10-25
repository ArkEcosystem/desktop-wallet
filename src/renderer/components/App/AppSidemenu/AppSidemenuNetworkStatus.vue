<template>
  <div
    v-click-outside="emitClose"
    class="AppSidemenuNetworkStatus absolute z-10"
  >

    <MenuOptions class="AppSidemenuNetworkStatus--peer">
      <div class="bg-theme-settings-sub inline-block mx-6 rounded-l text-white relative px-3 py-2 inline-block select-none cursor-pointer">
        <div
          @click="toggleSelect('peers-menu')"
        >
          <div
            slot="controls"
            class="pointer-events-none"
          >
            <MenuDropdown
              ref="peers-menu"
              :items="peerIps"
              :value="currentPeerId"
              :placeholder="peer ? `http://${peer.ip}:${peer.port}` : $t('PEER.NONE')"
              :pin-above="true"
              :prefix="$t('PEER.PEER')"
              class="inline-block text-white fill-white width-inherit"
              @select="setPeer"
            />
          </div>
        </div>
        <ButtonReload
          :is-refreshing="isRefreshing"
          class="AppSidemenuNetworkStatus__refresh-button bg-theme-settings-button absolute pin-t pin-r pin-b pt-3 pb-2 px-2"
          @click="refreshPeer"
        />
      </div>
      <div class="AppSidemenuNetworkStatus--status flex flex-wrap mt-6 mx-auto select-none">
        <div class="AppSidemenuNetworkStatus--status__height inline-block pr-6 border-r">
          <div class="text-xs mb-2">{{ $t('PEER.HEIGHT') }}</div>
          <div class="text-md text-white">{{ peer ? peer.height : '-' }}</div>
        </div>
        <div class="AppSidemenuNetworkStatus--status__last-checked inline-block ml-6 pr-6 border-r">
          <div class="text-xs mb-2">{{ $t('PEER.LAST_CHECKED') }}</div>
          <div class="text-md text-white">{{ $d(peer.lastUpdated || lastUpdated, 'shortTime') }}</div>
        </div>
        <div class="AppSidemenuNetworkStatus--status__delay ml-6 inline-block">
          <div class="text-xs mb-2">{{ $t('PEER.DELAY') }}</div>
          <div
            v-if="peer.delay"
            :class="peer && peer.delay < 500 ? 'text-green' : 'text-red'"
          >
            <span class="text-md">{{ peer.delay }} ms</span>
            <div
              :class="peer && peer.delay < 500 ? 'bg-green' : 'bg-red'"
              class="inline-block h-2 w-2 ml-1 rounded-full"
            />
          </div>
          <div v-else>
            <span class="text-white">-</span>
          </div>
        </div>
      </div>
    </MenuOptions>

    <div
      class="AppSidemenuNetworkStatus--custom_peer bg-theme-settings mt-2 rounded"
      @click="toggleCustomPeerModal">
      <div class="cursor-pointer py-5 px-10 text-grey-dark hover:text-white">
        <SvgIcon
          name="connect"
          view-box="0 0 30 15"
        />
        {{ $t('PEER.CONNECT_CUSTOM') }}
      </div>
    </div>

    <ModalPeer
      v-if="showCustomPeerModal"
      @close="toggleCustomPeerModal"
    />

  </div>
</template>

<script>
import { MenuDropdown, MenuOptions } from '@/components/Menu'
import { ModalPeer } from '@/components/Modal'
import { ButtonReload, ButtonSwitch } from '@/components/Button'
import { InputText } from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'AppSidemenuNetworkStatus',

  components: {
    ButtonReload,
    ButtonSwitch,
    InputText,
    MenuDropdown,
    MenuOptions,
    ModalPeer,
    SvgIcon
  },

  props: {
    outsideClick: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      isRefreshing: false,
      showCustomPeerModal: false
    }
  },

  computed: {
    peer () {
      return this.$store.getters['peer/current']()
    },
    bestPeers () {
      return this.$store.getters['peer/bestPeers'](undefined, false)
    },
    peerIps () {
      const bestPeers = this.bestPeers
      if (!bestPeers) {
        return {}
      }

      return bestPeers.reduce((map, peer, index) => {
        map[index] = `http://${peer.ip}:${peer.port}`

        return map
      }, {})
    },
    currentPeerId () {
      if (this.peer.isCustom) {
        return null
      }

      const bestPeers = this.bestPeers
      for (const peerId in bestPeers) {
        const peer = bestPeers[peerId]
        if (peer.ip === this.peer.ip) {
          return peerId
        }
      }

      return null
    },
    lastUpdated () {
      return this.$store.getters['peer/lastUpdated']()
    }
  },

  methods: {
    async refreshPeer () {
      this.isRefreshing = true
      await this.$store.dispatch('peer/connectToBest', {
        skipIfCustom: false
      })
      this.isRefreshing = false
    },

    setPeer (peerId) {
      const peer = this.bestPeers[peerId]
      if (!peer) {
        this.$error('Could not find peer')
      } else {
        this.$store.dispatch('peer/setCurrentPeer', peer)
      }
    },

    toggleSelect (name) {
      this.$refs[name].toggle()
    },

    toggleCustomPeerModal () {
      this.showCustomPeerModal = !this.showCustomPeerModal
    },

    emitClose () {
      if (this.outsideClick && !this.showCustomPeerModal) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppSidemenuNetworkStatus {
  width: 380px;
  left: 5.5rem;
}

.AppSidemenuNetworkStatus--status__height,
.AppSidemenuNetworkStatus--status__last-checked,
.AppSidemenuNetworkStatus--status__delay {
  @apply .text-theme-settings-heading .border-theme-settings-border
}

.AppSidemenuNetworkStatus--peer .MenuDropdownHandler.text-theme-page-text-light {
  @apply .text-white;
}
</style>
