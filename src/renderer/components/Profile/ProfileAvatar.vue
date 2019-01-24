<template>
  <div
    class="ProfileAvatar"
  >
    <div
      v-if="profile.avatar"
      :style="profile.avatar ? `backgroundImage: url('${assets_loadImage(profile.avatar)}')` : ''"
      :to="{ name: 'profiles' }"
      class="background-image bg-center bg-no-repeat border-none"
    >
      <slot />
    </div>

    <ButtonLetter
      v-if="!profile.avatar"
      :value="profile.name"
      :has-custom-style="true"
      size="xl"
      class="bg-theme-feature-item-selected text-theme-feature-item-selected-text"
    />

    <slot />
  </div>
</template>

<script>
import { ButtonLetter } from '@/components/Button'

export default {
  name: 'ProfileAvatar',

  components: {
    ButtonLetter
  },

  props: {
    profile: {
      type: Object,
      required: true
    }
  }
}
</script>
