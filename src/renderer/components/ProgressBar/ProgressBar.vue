<template>
  <div
    :class="[
      `ProgressBar--status-${getStatus}`,
      `ProgressBar--size-${size}`,
    ]"
    class="ProgressBar"
  >
    <div class="ProgressBar__outer">
      <div class="ProgressBar__inner">
        <div
          class="ProgressBar__bg"
          :style="{ width: `${getCurrentPercent}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',

  props: {
    percent: {
      type: [String, Number],
      required: false,
      default: 0
    },
    status: {
      type: String,
      required: false,
      default: 'active',
      validator: (value) => ['active', 'exception', 'success'].includes(value)
    },
    size: {
      type: String,
      required: false,
      default: 'normal',
      validator: (value) => ['normal', 'small', 'large'].includes(value)
    }
  },

  computed: {
    getCurrentPercent () {
      return parseInt(this.percent.toString(), 10)
    },

    getStatus () {
      if (this.status === 'active' && this.getCurrentPercent >= 100) {
        return 'success'
      }

      return this.status
    }
  }
}
</script>

<style lang="postcss" scoped>
.ProgressBar {
  @apply w-full relative;
}

.ProgressBar__outer {
  @apply w-full inline-block
}

.ProgressBar__inner {
  @apply relative inline-block w-full overflow-hidden align-middle rounded-full bg-theme-switch-button
}

.ProgressBar__bg {
  @apply rounded-full;
  transition: width 1s;
}

.ProgressBar--size-large .ProgressBar__bg {@apply h-4;}
.ProgressBar--size-normal .ProgressBar__bg {@apply h-3;}
.ProgressBar--size-small .ProgressBar__bg {@apply h-2;}

.ProgressBar--status-active .ProgressBar__bg {@apply bg-blue;}
.ProgressBar--status-success .ProgressBar__bg {@apply bg-green;}
.ProgressBar--status-exception .ProgressBar__bg {@apply bg-red;}
</style>
