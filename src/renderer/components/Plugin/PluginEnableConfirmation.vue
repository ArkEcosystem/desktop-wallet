<template>
  <ModalConfirmation
    :question="$t('PLUGIN_ENABLE_CONFIRMATION.QUESTION')"
    :cancel-button="$t('PLUGIN_ENABLE_CONFIRMATION.NO')"
    :continue-button="$t('PLUGIN_ENABLE_CONFIRMATION.YES')"
    container-classes="PluginEnableConfirmation"
    @close="emitClose"
    @cancel="emitIgnore"
    @continue="emitEnable"
  >
    <div class="flex flex-row justify-center">
      <img
        :title="plugin.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="PluginEnableConfirmation__container__arrow"
      >
      <div class="PluginEnableConfirmation__container__name">
        {{ plugin.name }}
      </div>
      <img
        :title="plugin.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="PluginEnableConfirmation__container__arrow PluginEnableConfirmation__container__arrow--reverse"
      >
    </div>
  </ModalConfirmation>
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'

export default {
  name: 'PluginEnableConfirmation',

  components: {
    ModalConfirmation
  },

  props: {
    plugin: {
      type: Object,
      required: true
    }
  },

  methods: {
    emitIgnore () {
      this.$emit('ignore')
    },

    emitEnable () {
      this.$emit('enable', this.plugin)
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style>
.PluginEnableConfirmation .ModalConfirmation__container {
  min-width: calc(10rem + 74px * 2 + 80px);
  max-width: calc(10rem + 74px * 2 + 120px)
}
.PluginEnableConfirmation .ModalConfirmation__container > div:first-child {
  @apply .mb-0
}
.PluginEnableConfirmation__container__name {
  margin-top: calc(3rem);
  margin-left: 2rem;
  margin-right: 2rem;
}
.PluginEnableConfirmation__container__arrow {
  width: 74px;
  height: 75px;
  margin-top: calc(var(--profile-avatar-xl) - 75px)
}
.PluginEnableConfirmation__container__arrow--reverse {
  transform: scaleX(-1)
}
</style>
