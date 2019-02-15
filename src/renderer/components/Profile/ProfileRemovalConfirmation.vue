<template>
  <ModalConfirmation
    :question="$t('PROFILE_REMOVAL_CONFIRMATION.QUESTION')"
    :note="$t('PROFILE_REMOVAL_CONFIRMATION.NOTE')"
    container-classes="ProfileRemovalConfirmation"
    @close="emitCancel"
    @cancel="emitCancel"
    @continue="removeProfile"
  >
    <div class="flex flex-row justify-center">
      <img
        :title="profile.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="ProfileRemovalConfirmation__container__arrow"
      >
      <ProfileAvatar
        :profile="profile"
        letter-size="3xl"
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
import { ProfileAvatar } from '@/components/Profile'

export default {
  name: 'ProfileRemovalConfirmation',

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
    removeProfile () {
      const removeCurrentProfile = () => {
        this.$store.dispatch('profile/delete', this.profile)
        this.emitRemoved()
      }

      const profiles = this.$store.getters['profile/all']

      if (profiles.length <= 1) {
        this.$store.dispatch('session/reset')
        removeCurrentProfile()
        this.$router.push({ name: 'profile-new' })
      } else {
        const nextProfile = profiles.find(profile => profile.id !== this.profile.id)
        this.$store.dispatch('session/setProfileId', nextProfile.id)
        removeCurrentProfile()
      }
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

<style>
.ProfileRemovalConfirmation .ModalConfirmation__container {
  min-width: calc(var(--profile-avatar-xl) + 74px * 2);
  max-width: calc(var(--profile-avatar-xl) + 74px * 2 + 50px)
}
.ProfileRemovalConfirmation .ModalConfirmation__container > div:first-child {
  @apply .mb-0
}
.ProfileRemovalConfirmation .ProfileAvatar {
  @apply .flex .flex-col .justify-around
}
.ProfileRemovalConfirmation .ProfileAvatar__image {
  height: calc(var(--profile-avatar-xl) * 0.66);
  width: var(--profile-avatar-xl);
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
