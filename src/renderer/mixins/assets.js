import imageManager from '@/services/image-manager'

export default {
  methods: {
    assets_loadImage (source) {
      try {
        return imageManager.loadImage(source)
      } catch (error) {
        return ''
      }
    }
  }
}
