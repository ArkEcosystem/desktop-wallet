<template>
  <ModalWindow
    :title="$t('MODAL_PLUGIN_MANAGE_BLACKLIST.TITLE')"
    container-classes="w-md max-w-md"
    @close="emitClose"
  >
    <section class="ModalConfirmation__container flex flex-col">
      <div class="mb-6">
        <p
          v-if="!blacklist.length"
          class="mb-2"
        >
          {{ $t('MODAL_PLUGIN_MANAGE_BLACKLIST.EMPTY') }}
        </p>

        <div
          v-for="plugin of blacklist"
          :key="plugin"
          class="flex items-center justify-between mb-2"
        >
          <span class="mr-4">{{ plugin }}</span>

          <button
            class="font-semibold flex text-xs hover:text-red text-theme-page-text-light p-1"
            @click="removeFromBlacklist(plugin)"
          >
            <SvgIcon
              name="delete-wallet"
              view-box="0 0 16 16"
            />
          </button>
        </div>
      </div>

      <div class="mt-2 flex flex-row">
        <button
          class="blue-button"
          @click="emitClose"
        >
          {{ $t('MODAL_PLUGIN_MANAGE_BLACKLIST.CLOSE') }}
        </button>
      </div>
    </section>
  </ModalWindow>
</template>

<script>
import { ModalWindow } from '@/components/Modal'
import { SvgIcon } from '@/components/SvgIcon'

export default {
  name: 'PluginManageBlacklistModal',

  components: {
    ModalWindow,
    SvgIcon
  },

  props: {
    blacklist: {
      type: Array,
      required: true
    }
  },

  methods: {
    emitClose () {
      this.$emit('close')
    },

    removeFromBlacklist (plugin) {
      this.$store.dispatch('plugin/setBlacklisted', {
        scope: 'local',
        plugins: this.$store.getters['plugin/blacklisted'].local.filter(blacklisted => blacklisted !== plugin)
      })
    }
  }
}
</script>
