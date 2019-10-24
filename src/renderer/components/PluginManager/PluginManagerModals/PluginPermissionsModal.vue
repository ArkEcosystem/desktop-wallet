<template>
  <ModalWindow
    :title="title"
    :message="isInstalled ? '' : $t('PAGES.PLUGIN_MANAGER.DISCLAIMER')"
    container-classes="max-w-md"
    @close="emitClose"
  >
    <template #default>
      <div class="PluginPermissionsModal__permission__container">
        <div
          v-for="permission of plugin.permissions"
          :key="permission"
          class="PluginPermissionsModal__permission"
        >
          <span class="text-theme-page-text-light">
            {{ $t(`MODAL_PLUGIN_PERMISSIONS.PERMISSIONS.${permission}`) }}
          </span>
        </div>
      </div>

      <footer class="PluginPermissionsModal__footer">
        <button
          class="blue-button"
          @click="emitClose"
        >
          {{ $t('MODAL_PLUGIN_PERMISSIONS.BACK') }}
        </button>

        <button
          v-if="!isInstalled || isUpdate"
          class="blue-button"
          @click="emitConfirm"
        >
          {{ $t('MODAL_PLUGIN_PERMISSIONS.DOWNLOAD') }}
        </button>
      </footer>
    </template>
  </ModalWindow>
</template>

<script>
import { ModalWindow } from '@/components/Modal'

export default {
  name: 'PluginPermissionsModal',

  components: {
    ModalWindow
  },

  props: {
    modalRef: {
      type: String,
      required: false,
      default: ''
    },
    plugin: {
      type: Object,
      required: true
    },
    isUpdate: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  computed: {
    title () {
      if (this.isInstalled && !this.isUpdate) {
        return this.$t('MODAL_PLUGIN_PERMISSIONS.TITLE')
      }
      return this.$t('MODAL_PLUGIN_PERMISSIONS.ALTERNATIVE_TITLE')
    },

    isInstalled () {
      return this.$store.getters['plugin/isInstalled'](this.plugin.id)
    }
  },

  methods: {
    emitClose () {
      this.$emit('close', this.modalRef)
    },

    emitConfirm () {
      this.$emit('confirm', this.plugin)
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginPermissionsModal__permission__container {
  max-height: 12rem;
  @apply overflow-y-auto pr-2
}
.PluginPermissionsModal__permission {
  @apply flex flex-col py-4 border-b border-dashed border-theme-line-separator
}
.PluginPermissionsModal__permission:last-of-type {
  @apply border-none
}

.PluginPermissionsModal__footer {
  @apply mt-10 flex justify-between items-center
}
</style>
