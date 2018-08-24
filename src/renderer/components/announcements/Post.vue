<template>
  <div class="relative">

    <!-- TODO reuse as a component when the pop-up modal is integrated into a page -->
    <button
      v-if="!isRead"
      class="close absolute pin-t pin-r mr-4 cursor-pointer"
      @click="dismiss">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="fill-current text-grey hover:text-red h-4 w-4">
        <path
          fill-rule="evenodd"
          d="M15.000,1.500 L13.500,-0.000 L7.500,5.999 L1.500,-0.000 L-0.000,1.500 L6.000,7.499 L-0.000,13.500 L1.500,15.000 L7.500,9.000 L13.500,15.000 L15.000,13.500 L9.000,7.499 L15.000,1.500 Z"/>
      </svg>
    </button>

    <h2
      :class="isRead ? 'text-grey-dark' : 'text-black'"
      class="text-2xl pr-8"
    >
      {{ title }}
    </h2>

    <p
      v-if="!isRead"
      class="summary bg-theme-black-light mt-2"
    >
      {{ summary }}
    </p>

    <a
      :title="title"
      class="block mt-4 cursor-pointer"
      @click="openExternal(url)"
    >
      Read more &#8594;
    </a>
  </div>
</template>

<script>
import electron from 'electron'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    dismiss () {
      this.$emit('read', this.announcement)
    },
    openExternal (url) {
      electron.shell.openExternal(url)
      setTimeout(() => this.dismiss(), 2000)
    }
  }
}
</script>

<style scoped>
.close {
  /* The close button is shown only on hover over the entire announcement */
  display: none;
  /* Adjust the vertical position to be at the same point than the title  */
  top: 0.25rem;
}
.relative:hover > .close {
  display: block;
}
</style>
