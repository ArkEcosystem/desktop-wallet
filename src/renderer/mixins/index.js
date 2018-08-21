import Vue from 'vue'
import imagesManager from '@/services/images-manager'

const options = {
  methods: {
    loadAssetImage (filename) {
      return imagesManager.loadImage(filename)
    }
  }
}

Vue.mixin(options)

export default options
