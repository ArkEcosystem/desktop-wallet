<template>
  <div
    v-click-outside="emitClose"
    :class="isHorizontal ? 'AppSidemenuNetworkStatus--horizontal' : 'AppSidemenuNetworkStatus'"
    class="absolute z-20"
  >
    <MenuOptions
      :is-horizontal="isHorizontal"
      class="AppSidemenuNetworkStatus__peer"
    >
      <div class="bg-theme-settings-sub inline-block mx-6 rounded-l text-white relative px-3 py-2 inline-block select-none cursor-pointer">
        <button
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
              :placeholder="peer ? `${peer.isHttps ? 'https://' : 'http://'}${peer.ip}` : $t('PEER.NONE')"
              :pin-above="true"
              :prefix="$t('PEER.PEER')"
              class="inline-block text-white fill-white width-inherit"
              @select="setPeer"
            />
          </div>
        </button>
        <ButtonReload
          :is-refreshing="isRefreshing"
          class="AppSidemenuNetworkStatus__refresh-button bg-theme-settings-button absolute pin-t pin-r pin-b pt-3 pb-2 px-2"
          @click="refreshPeer"
        />
      </div>
      <div class="AppSidemenuNetworkStatus__status flex flex-wrap mt-6 mx-auto select-none">
        <div class="AppSidemenuNetworkStatus__status__height inline-block pr-6 border-r">
          <div class="text-xs mb-2">
            {{ $t('PEER.HEIGHT') }}
          </div>
          <div class="text-md text-white">
            {{ peer ? peer.height : '-' }}
          </div>
        </div>
        <div class="AppSidemenuNetworkStatus__status__last-checked inline-block ml-6 pr-6 border-r">
          <div class="text-xs mb-2">
            {{ $t('PEER.LAST_CHECKED') }}
          </div>
          <div class="text-md text-white">
            {{ $d(peer.lastUpdated || lastUpdated, 'shortTime') }}
          </div>
        </div>
        <div class="AppSidemenuNetworkStatus__status__delay ml-6 inline-block">
          <div class="text-xs mb-2">
            {{ $t('PEER.DELAY') }}
          </div>
          <div
            v-if="peer.delay"
            :class="peer && peer.delay < 500 ? 'text-green' : 'text-red'"
          >
            <span class="text-md">
              {{ peer.delay }} ms
            </span>
            <div
              :class="peer && peer.delay < 500 ? 'bg-green' : 'bg-red'"
              class="inline-block h-2 w-2 ml-1 rounded-full"
            />
          </div>
          <div v-else>
            <span class="text-white">
              -
            </span>
          </div>
        </div>
      </div>
    </MenuOptions>
    <div
      class="bg-theme-settings mt-2 pt-1 rounded"
    >
      <ButtonModal
        :label="$t('PEER.CONNECT_CUSTOM')"
        icon="connect"
        view-box="0 0 30 15"
        class="AppSidemenuNetworkStatus__ButtonModal cursor-pointer w-full text-left py-3 pl-10 text-grey-dark hover:text-white"
      >
        <template slot-scope="{ toggle, isOpen }">
          <NetworkCustomPeer
            v-if="isOpen"
            @close="toggle"
          />
        </template>
      </ButtonModal>
      <RouterLink
        :to="{ name: 'networks' }"
        :class="isHorizontal ? 'py-3 px-4 flex-row w-22' : 'px-3 py-4 rounded-t-lg'"
        class="flex items-center cursor-pointer w-full text-left py-3 pl-10 text-grey-dark hover:no-underline hover:text-white"
        @click.native="goToNetworkOverview()"
      >
        <SvgIcon
          name="network-management"
          view-box="0 0 21 21"
          class="mr-4"
        />
        <span class="font-semibold">
          {{ $t('APP_SIDEMENU.NETWORK_OVERVIEW') }}
        </span>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { MenuDropdown, MenuOptions } from '@/components/Menu'
import { NetworkCustomPeer } from '@/components/Network'
import { ButtonModal, ButtonReload } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'AppSidemenuNetworkStatus',

  components: {
    ButtonModal,
    ButtonReload,
    MenuDropdown,
    MenuOptions,
    NetworkCustomPeer,
    SvgIcon
  },

  props: {
    outsideClick: {
      type: Boolean,
      required: false,
      default: false
    },
    isHorizontal: {
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
        map[index] = `http://${peer.ip}`

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

    async setPeer (peerId) {
      const peer = this.bestPeers[peerId]
      if (!peer) {
        this.$error('Could not find peer')
      } else {
        await this.$store.dispatch('peer/setCurrentPeer', peer)
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
    },

    goToNetworkOverview () {
      this.$emit('close')
      this.$router.push({ name: 'networks' })
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppSidemenuNetworkStatus {
  width: 380px;
  left: 6.5rem;
}

.AppSidemenuNetworkStatus--horizontal {
  width: 380px;
  right: 4.5rem;
  top: 5.5rem;
}

.AppSidemenuNetworkStatus__status__height,
.AppSidemenuNetworkStatus__status__last-checked,
.AppSidemenuNetworkStatus__status__delay {
  @apply .text-theme-settings-heading .border-theme-settings-border
}

.AppSidemenuNetworkStatus__peer .MenuDropdownHandler.text-theme-page-text-light {
  @apply .text-white;
}

.AppSidemenuNetworkStatus__ButtonModal {
  @apply block;
}
</style>
