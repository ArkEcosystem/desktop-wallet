<template>
  <div
    class="ProfileAvatar"
    v-on="$listeners"
  >
    <div
      v-if="profile.avatar"
      :style="profile.avatar ? `backgroundImage: url('${assets_loadImage(profile.avatar)}')` : ''"
      class="ProfileAvatar__image background-image bg-center bg-no-repeat border-none"
    >
      <slot />
    </div>

    <ButtonLetter
      v-else
      :value="profile.name"
      :has-custom-style="true"
      :size="letterSize"
      class="ProfileAvatar__letter bg-theme-feature-item-selected text-theme-feature-item-selected-text"
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
    },
    letterSize: {
      type: String,
      required: true
    }
  }
}
</script>
