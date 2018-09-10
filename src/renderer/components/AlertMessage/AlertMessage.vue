<template>
  <div
    :class="alert ? `AlertMessage--${alert.type}` : 'opacity-0 hidden'"
    class="AlertMessage absolute z-10 max-w-1/2 min-w-1/4 rounded-lg inline pin-b pin-l m-4 p-4 text-white">
    <div class="message font-bold">
      <ButtonClose
        :on-click="showNext"
        aclass="dismiss float-right p-10px ml-4 cursor-pointer select-none">x</ButtonClose>
      {{ alert ? alert.message : '&nbsp;' }}
    </div>
  </div>
</template>

<script>
import { AlertEvents } from '@/components/AlertMessage'
import { ButtonClose } from '@/components/Button'

export default {
  name: 'AlertMessage',
  components: {
    ButtonClose
  },
  props: {
    duration: {
      type: Number,
      default: 4000
    }
  },
  data: () => ({
    queue: [],
    timer: null,
    alert: null
  }),
  mounted () {
    AlertEvents.$on('alert', this.queueAlert)
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
  background-color: var(--theme-error);
  box-shadow: 0px 0px 15px var(--theme-error-shadow);
}
.AlertMessage--success {
  background-color: var(--theme-success);
  box-shadow: 0px 0px 15px var(--theme-success-shadow);
}
.AlertMessage--info {
  background-color: var(--theme-info);
  box-shadow: 0px 0px 15px var(--theme-info-shadow);
}
.AlertMessage--warn {
  background-color: var(--theme-warn);
  box-shadow: 0px 0px 15px var(--theme-warn-shadow);
  color: var(--theme-warn-text);
}
</style>
