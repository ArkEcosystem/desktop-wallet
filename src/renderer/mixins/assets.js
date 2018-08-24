import imagesManager from '@/services/images-manager'

export default {
  methods: {
    assets_loadImage (filename) {
      return imagesManager.loadImage(filename)
    }
  }
}
