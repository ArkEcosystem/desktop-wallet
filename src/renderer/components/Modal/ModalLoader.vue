<template>
  <portal
    v-if="visible"
    to="loading"
  >
    <ModalWindow
      :allow-close="false"
      @close="toggle"
    >
      <div>
        {{ message }}
      </div>
      <div
        class="flex justify-center p-5"
      >
        <Loader />
      </div>
    </ModalWindow>
  </portal>
</template>

<script>
import Loader from '@/components/utils/Loader'
import ModalWindow from './ModalWindow'

export default {
  name: 'ModalLoading',

  components: {
    Loader,
    ModalWindow
  },

  props: {
    message: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  methods: {
    toggle () {
      this.visible = !this.visible
    }
  }
}
</script>
