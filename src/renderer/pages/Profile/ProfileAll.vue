<template>
  <div class="ProfileAll relative bg-theme-feature rounded-lg m-r-4 p-10">
    <h3>{{ $t('PAGES.PROFILE_ALL.HEADER') }}</h3>

    <div class="ProfileAll__grid mt-10">
      <router-link
        :to="{ name: 'profile-new' }"
        class="ProfileAll__grid__profile flex flex-row w-full"
      >
        <div
          :style="`backgroundImage: url('${assets_loadImage(addProfileImagePath)}')`"
          title="$t('PAGES.PROFILE_ALL.ADD_PROFILE')"
          class="profile-avatar-xl background-image flex"
        />
        <div class="ProfileAll__grid__profile__name font-semibold flex mt-12">
          {{ $t('PAGES.PROFILE_ALL.ADD_PROFILE') }}
        </div>
      </router-link>

      <div
        v-for="profile in profiles"
        :key="profile.id"
        :class="{
          'ProfileAll__grid__profile--selected': profile.id === currentProfileId
        }"
        class="ProfileAll__grid__profile flex flex-row w-full"
      >
        <div
          :style="`backgroundImage: url('${assets_loadImage(profile.avatar)}')`"
          :title="profile.name"
          class="profile-avatar-xl background-image flex cursor-pointer"
          @click="selectProfile(profile.id)"
        />

        <div class="flex flex-col">
          <div class="ProfileAll__grid__profile__name font-semibold flex text-lg pl-4 mt-8">
            {{ profile.name }}
          </div>

          <router-link
            :to="{ name: 'profile-edition', params: { profileId: profile.id } }"
            class="ProfileAll__grid__profile__edition-link font-semibold flex text-xs pl-4 mt-2 mb-6"
          >
            {{ $t('PAGES.PROFILE_ALL.EDIT_PROFILE') }}
          </router-link>

          <div
            v-show="profile.id !== currentProfileId"
            class="ProfileAll__grid__profile__select font-semibold flex text-xs cursor-pointer pl-4 hover:underline"
            @click="selectProfile(profile.id)"
          >
            {{ $t('PAGES.PROFILE_ALL.SELECT_PROFILE') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileAll',

  computed: {
    ...mapGetters({ profiles: 'profile/all' }),
    addProfileImagePath () {
      return 'pages/new-profile-avatar.svg'
    },
    currentProfileId () {
      return this.$store.getters['session/profileId']
    }
  },

  methods: {
    selectProfile (profileId) {
      this.$store.dispatch('session/setProfileId', profileId)
    }
  }
}
</script>

<style lang="postcss" scoped>
.ProfileAll__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(var(--profile-avatar-xl) * 2));
  grid-gap: 1rem;
}
.ProfileAll__grid__profile {
  @apply .p-4
}
.ProfileAll__grid__profile:hover .profile-avatar-xl {
  transition: 0.5s;
  opacity: 0.5;
}
.ProfileAll__grid__profile--selected {
  @apply .border-green .border-2 .rounded-lg;
}
.ProfileAll__grid__profile__name {
  width: var(--profile-avatar-xl);
}
</style>
