import imageManager from '@/services/image-manager';
export default {
    methods: {
        assets_loadImage: function (source) {
            try {
                return imageManager.loadImage(source);
            }
            catch (error) {
                return '';
            }
        }
    }
};
//# sourceMappingURL=assets.js.map