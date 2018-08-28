import imageManager from '@/services/image-manager'

export default {
  methods: {
    assets_loadImage (source) {
      return imageManager.loadImage(source)
    }
  }
}
