<template>
  <ModalConfirmation
    :question="$t('PROFILE_LEAVING_CONFIRMATION.QUESTION')"
    :cancel-button="$t('PROFILE_LEAVING_CONFIRMATION.NO')"
    :continue-button="$t('PROFILE_LEAVING_CONFIRMATION.YES')"
    container-classes="ProfileLeavingConfirmation"
    @close="emitClose"
    @cancel="emitSave"
    @continue="emitIgnore"
  >
    <div class="flex flex-row justify-center">
      <img
        :title="profile.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="ProfileLeavingConfirmation__container__arrow"
      >
      <ProfileAvatar
        :profile="profile"
        letter-size="3xl"
      />
      <img
        :title="profile.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="ProfileLeavingConfirmation__container__arrow ProfileLeavingConfirmation__container__arrow--reverse"
      >
    </div>
  </ModalConfirmation>
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'
import { ProfileAvatar } from '@/components/Profile'

export default {
  name: 'ProfileLeavingConfirmation',

  components: {
    ModalConfirmation,
    ProfileAvatar
  },

  props: {
    profile: {
      type: Object,
      required: true
    }
  },

  methods: {
    emitIgnore () {
      this.$emit('ignore')
    },

    emitSave () {
      this.$emit('save')
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style>
.ProfileLeavingConfirmation .ModalConfirmation__container {
  min-width: calc(var(--profile-avatar-xl) + 74px * 2 + 80px);
  max-width: calc(var(--profile-avatar-xl) + 74px * 2 + 120px)
}
.ProfileLeavingConfirmation .ModalConfirmation__container > div:first-child {
  @apply .mb-0
}
.ProfileLeavingConfirmation .ProfileAvatar {
  @apply .flex .flex-col .justify-around
}
.ProfileLeavingConfirmation .ProfileAvatar__image {
  height: calc(var(--profile-avatar-xl) * 0.66);
  width: var(--profile-avatar-xl);
}
.ProfileLeavingConfirmation__container__arrow {
  width: 74px;
  height: 75px;
  margin-top: calc(var(--profile-avatar-xl) - 75px + 2rem)
}
.ProfileLeavingConfirmation__container__arrow--reverse {
  transform: scaleX(-1)
}
</style>
