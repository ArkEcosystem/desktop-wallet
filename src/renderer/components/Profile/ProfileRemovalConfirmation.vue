<template>
  <ModalConfirmation
    :question="$t('PROFILE_REMOVAL_CONFIRMATION.QUESTION')"
    :note="$t('PROFILE_REMOVAL_CONFIRMATION.NOTE')"
    class="ProfileRemovalConfirmation"
    @cancel="emitCancel"
    @continue="removeProfile"
  >
    <div class="flex flex-row justify-center">
      <img
        :title="profile.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="ProfileRemovalConfirmation__container__arrow"
      >
      <div
        :style="`backgroundImage: url('${assets_loadImage(profile.avatar)}')`"
        :title="profile.name"
        class="profile-avatar-xl background-image bg-contain"
      />
      <img
        :title="profile.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="ProfileRemovalConfirmation__container__arrow ProfileRemovalConfirmation__container__arrow--reverse"
      >
    </div>
  </ModalConfirmation>
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'

export default {
  name: 'ProfileRemovalConfirmation',

  components: {
    ModalConfirmation
  },

  props: {
    profile: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeProfile () {
      this.$store.dispatch('profile/delete', this.profile)
      this.emitRemoved()
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitRemoved () {
      this.$emit('removed')
    }
  }
}
</script>

<style scoped>
.ProfileRemovalConfirmation >>> .ModalConfirmation__container {
  min-width: calc(var(--profile-avatar-xl) + 74px * 2);
  max-width: calc(var(--profile-avatar-xl) + 74px * 2 + 50px)
}
.ProfileRemovalConfirmation__container__arrow {
  width: 74px;
  height: 75px;
  margin-top: calc(var(--profile-avatar-xl) - 75px + 2rem)
}
.ProfileRemovalConfirmation__container__arrow--reverse {
  transform: scaleX(-1)
}
</style>
