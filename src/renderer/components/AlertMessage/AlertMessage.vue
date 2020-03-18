<template>
  <button
    :class="alert ? `AlertMessage--${alert.type}` : 'opacity-0 hidden'"
    class="AlertMessage absolute z-50 max-w-1/2 min-w-1/4 rounded-lg inline pin-b pin-l m-4 p-4 text-white"
  >
    <div class="text-left message font-bold">
      <ButtonClose
        icon-class="text-white"
        @click="showNext"
      />
      <span class="break-words">
        {{ alert ? alert.message : '&nbsp;' }}
      </span>
    </div>
  </button>
</template>

<script>
import { ButtonClose } from '@/components/Button'

export default {
  name: 'AlertMessage',

  components: {
    ButtonClose
  },

  props: {
    duration: {
      type: Number,
      default: 5000
    }
  },

  data: () => ({
    queue: [],
    timer: null,
    alert: null
  }),

  mounted () {
    this.$eventBus.on('alert', this.queueAlert)
  },

  methods: {
    queueAlert (alert) {
      this.queue.push(alert)

      if (this.queue.length === 1) {
        this.showNext()
      }
    },

    showNext () {
      clearTimeout(this.timer)

      if (this.alert) {
        this.queue.shift()
      }
      let duration = this.duration
      if (this.queue.length) {
        this.alert = this.queue[0]
        if (this.alert.duration && Number.isFinite(this.alert.duration)) {
          duration = this.alert.duration
        }
      } else {
        this.alert = null
      }

      this.timer = setTimeout(this.showNext, duration)
    }
  }
}
</script>

<style scoped>
.AlertMessage {
  transition: opacity, hidden .2s ease-in, background-color .1s ease-in;
}
.AlertMessage--error {
  @apply bg-theme-error;
  box-shadow: 0px 0px 15px var(--theme-error-shadow);
}
.AlertMessage--success {
  @apply bg-theme-success;
  box-shadow: 0px 0px 15px var(--theme-success-shadow);
}
.AlertMessage--info {
  @apply bg-theme-info;
  box-shadow: 0px 0px 15px var(--theme-info-shadow);
}
.AlertMessage--warn {
  @apply bg-theme-warn text-theme-warn-text;
  box-shadow: 0px 0px 15px var(--theme-warn-shadow);
}
.AlertMessage .ButtonClose {
  @apply float-right cursor-pointer select-none ml-4;
}
</style>
