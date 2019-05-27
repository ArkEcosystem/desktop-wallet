<template>
  <ModalConfirmation
    :question="$t('APP_SIDEMENU_PLUGIN_CONFIRMATION.QUESTION')"
    :note="$t('APP_SIDEMENU_PLUGIN_CONFIRMATION.NOTICE')"
    :cancel-button="$t('APP_SIDEMENU_PLUGIN_CONFIRMATION.NO')"
    :continue-button="$t('APP_SIDEMENU_PLUGIN_CONFIRMATION.YES')"
    :footer="$t('APP_SIDEMENU_PLUGIN_CONFIRMATION.WARNING')"
    container-classes="AppSidemenuPluginConfirmation"
    @close="emitClose"
    @cancel="emitIgnore"
    @continue="emitEnable"
  />
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'

export default {
  name: 'AppSidemenuPluginConfirmation',

  components: {
    ModalConfirmation
  },

  methods: {
    emitIgnore () {
      this.$emit('ignore')
    },

    emitEnable () {
      this.$emit('enable')
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style>
.AppSidemenuPluginConfirmation .ModalConfirmation__container {
  min-width: calc(10rem + 74px * 2 + 80px);
  max-width: calc(10rem + 74px * 2 + 120px)
}
.AppSidemenuPluginConfirmation .ModalConfirmation__container > div:first-child {
  @apply .mb-0
}
.AppSidemenuPluginConfirmation__container__name {
  margin-top: calc(3rem);
  margin-left: 2rem;
  margin-right: 2rem;
}
.AppSidemenuPluginConfirmation__container__arrow {
  width: 74px;
  height: 75px;
  margin-top: calc(var(--profile-avatar-xl) - 75px)
}
.AppSidemenuPluginConfirmation__container__arrow--reverse {
  transform: scaleX(-1)
}
</style>
