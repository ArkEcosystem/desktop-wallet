import { ImageManager } from "@/support/services/image-manager";

const imageManager = new ImageManager();

export const assetMixins = {
	methods: {
		loadImageFromAssets(source: string) {
			try {
				return imageManager.loadImage(source);
			} catch {
				return "";
			}
		},
	},
};
