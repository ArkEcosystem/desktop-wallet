<template>
  <div class="Plugins flex flex-col">
    <div class="flex flex-1 flex-col bg-theme-feature rounded-lg p-10">
      <div class="block w-full">
        <div class="flex items-center justify-between h-8">
          <h3 class=" items-center">
            {{ $t('PAGES.PLUGINS.HEADER') }}
          </h3>
        </div>
      </div>

      <div class="Plugins__tabular mt-10">
        <PluginTable
          :has-pagination="false"
          :is-contacts-table="true"
          :rows="plugins"
          :total-rows="plugins.length"
          :sort-query="sortParams"
          :no-data-message="$t('PLUGIN_TABLE.NO_PLUGINS')"
          @on-sort-change="onSortChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { clone, some, sortBy } from 'lodash'
import PluginTable from '@/components/Plugin/PluginTable'

export default {
  name: 'Plugins',

  components: {
    PluginTable
  },

  computed: {
    plugins () {
      const plugins = []
      const availablePlugins = this.$store.getters['plugin/available']
      for (const pluginData of Object.values(availablePlugins)) {
        plugins.push({
          id: pluginData.config.id,
          name: pluginData.config.name,
          description: pluginData.config.description,
          permissions: pluginData.config.permissions,
          isEnabled: this.$store.getters['plugin/isEnabled'](pluginData.config.id)
        })
      }

      return sortBy(plugins, ['id'])
    },

    sortParams: {
      get () {
        return this.$store.getters['session/contactSortParams']
      },
      set (sortParams) {
        this.$store.dispatch('session/setContactSortParams', sortParams)
        const profile = clone(this.session_profile)
        profile.contactSortParams = sortParams
        this.$store.dispatch('profile/update', profile)
      }
    },

    showVotedDelegates () {
      return some(this.plugins, contact => contact.hasOwnProperty('votedDelegate'))
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus('contacts')
    })
  },

  methods: {
    onSortChange (sortParams) {
      this.sortParams = sortParams
    }
  }
}
</script>

<style lang="postcss" scoped>
.Plugins__header {
  @apply .flex .items-center .justify-between;
}
.Plugins__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(var(--contact-identicon-lg) * 3));
  grid-gap: 1rem;
}
.Plugins__grid__contact__wrapper {
  @apply .m-6;
}
.Plugins__grid__contact:hover .identicon {
  opacity: 1;
}
.Plugins__grid__contact:hover .identicon-placeholder {
  opacity: 0.5;
}
.Plugins__grid__contact .identicon {
  transition: 0.5s;
  opacity: 0.5;
}
.Plugins__grid__contact .identicon-placeholder {
  transition: 0.5s;
  opacity: 0.25;
}
.Plugins__grid__contact__name {
  color: #037cff;
}
.Plugins__CreateButton {
  transition: all .1s ease-in;
  @apply .flex .items-center .font-semibold .bg-theme-button .rounded .cursor-pointer .text-theme-button-text .ml-12;
}
.Plugins__CreateButton:hover {
  @apply .bg-blue .text-white;
}
.Plugins__CreateButton__icon {
  transition: all .1s ease-in;
  @apply .flex .items-center .justify-center .h-10 .w-10 .rounded-l .bg-theme-button-inner-box;
}
.Plugins__CreateButton:hover .Plugins__CreateButton__icon {
  background-color: #0169f4;
  @apply .text-white;
}
@screen lg {
  .Plugins__grid__contact__wrapper {
    @apply .m-4
  }
}
</style>
