<template>
  <div class="flex justify-center items-center">
    <button
      v-tooltip="{
        content: tooltipText,
        placement: isHorizontal ? 'bottom' : 'right',
        boundariesElement: 'body'
      }"
      class="AppSidemenuImportantNotification relative cursor-pointer flex items-center justify-center h-8 w-8"
      @click="openNotification"
    >
      <div class="AppSidemenuImportantNotification__circle flex items-center justify-center h-8 w-8 rounded-full text-theme-feature bg-theme-feature-item-indicator hover:text-theme-feature-item-indicator hover:bg-theme-feature">
        <SvgIcon
          name="notification"
          view-box="0 0 15 15"
        />
      </div>
    </button>
    <AppUpdater
      v-if="isNotificationVisible"
      @close="closeNotification"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppUpdater from '@/components/App/AppUpdater'
import SvgIcon from '@/components/SvgIcon'

/**
 * A component to display a notification icon (a bell) and display important
 * notifications, such as, new relesases
 */
export default {
  name: 'AppSidemenuImportantNotification',

  components: {
    SvgIcon,
    AppUpdater
  },

  props: {
    isHorizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    isNotificationVisible: false
  }),

  computed: {
    ...mapGetters('updater', ['availableRelease']),
    releaseVersion () {
      return this.availableRelease && this.availableRelease.version
    },
    tooltipText () {
      return this.$t('APP_SIDEMENU_NOTIFICATION.TOOLTIP', { version: this.releaseVersion })
    }
  },

  methods: {
    closeNotification () {
      this.isNotificationVisible = false
    },
    openNotification () {
      this.isNotificationVisible = true
    }
  }
}
</script>

<style scoped>
.AppSidemenuImportantNotification__circle,
.AppSidemenuImportantNotification__cirlce:hover {
  transition: background-color 0.5s;
}

.AppSidemenuImportantNotification__notification button {
  height: 35px;
  width: 35px;
  padding: 10px;
  background: transparent;
    transition: background-color 0.3s;
}
.AppSidemenuImportantNotification__notification button:hover {
  transition: background-color 0.3s;
  background: rgba(255, 255, 255, 0.4);
}

.AppSidemenuImportantNotification__notification__download {
  height: 35px;
  width: 35px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
}

.AppSidemenuImportantNotification__notification__download:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
