<template>
  <div
    v-tooltip="{
      content: tooltipText,
      placement: isHorizontal ? 'bottom' : 'right'
    }"
    class="AppSidemenuImportantNotification relative cursor-pointer flex items-center justify-center"
    @click="openNotification"
  >
    <div class="AppSidemenuImportantNotification__circle flex items-center justify-center h-12 w-12 rounded-full text-theme-feature bg-theme-feature-item-indicator hover:text-theme-feature-item-indicator hover:bg-theme-feature">
      <SvgIcon
        name="notification"
        view-box="0 0 15 15"
      />
    </div>

    <portal
      v-if="isNotificationVisible"
      to="important-notification"
    >
      <div class="AppSidemenuImportantNotification__notification absolute z-50 pin flex justify-center items-center">
        <div class="max-w-2/3 min-w-1/4 rounded-lg inline p-4 bg-theme-button-text text-theme-feature hover-button-blue-shadow-definition">
          <!-- The real viewBox of `notification` and `download` is 0 0 15 15, but it is adjusted -->
          <SvgIcon
            class="fill-current text-theme-feature mr-1"
            name="notification"
            view-box="0 0 12 12"
          />

          <span
            class="mr-2 cursor-pointer hover:text-theme-feature-item-alternative"
            @click="download"
          >
            {{ notificationText }}
          </span>

          <button
            class="AppSidemenuImportantNotification__notification__download rounded-lg -my-2 mr-2"
            @click="download"
          >
            <SvgIcon
              class="fill-current text-theme-feature"
              name="download"
              view-box="0 0 13 13"
            />
          </button>

          <ButtonClose
            class="dismiss cursor-pointer select-none float-right -my-2 ml-10 text-theme-feature"
            @click="closeNotification"
          />
        </div>
      </div>
    </portal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import releaseService from '@/services/release'
import { ButtonClose } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'

/**
 * A component to display a notification icon (a bell) and display important
 * notifications, such as, new relesases
 */
export default {
  name: 'AppSidemenuImportantNotification',

  components: {
    ButtonClose,
    SvgIcon
  },

  props: {
    isHorizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: vm => ({
    isNotificationVisible: false
  }),

  computed: {
    ...mapGetters({
      releaseVersion: 'app/latestReleaseVersion'
    }),
    notificationText () {
      return this.$t('APP_SIDEMENU_NOTIFICATION.NOTIFICATION', { version: this.releaseVersion })
    },
    releaseUrl () {
      return releaseService.latestReleaseUrl
    },
    tooltipText () {
      return this.$t('APP_SIDEMENU_NOTIFICATION.TOOLTIP', { version: this.releaseVersion })
    }
  },

  methods: {
    closeNotification () {
      document.removeEventListener('keyup', this.onEscKey)

      this.isNotificationVisible = false
      this.$emit('close')
    },
    download () {
      this.electron_openExternal(this.releaseUrl)
      this.closeNotification()
    },
    onEscKey (event) {
      if (event.keyCode === 27) {
        this.closeNotification()
      }
    },
    openNotification () {
      document.addEventListener('keyup', this.onEscKey, { once: true })

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
