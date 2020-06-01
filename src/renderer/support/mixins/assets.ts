import { ImageManager } from "@/support/services/image-manager";

const imageManager = new ImageManager();

export const assets = {
	methods: {
		assets_loadImage(source: string) {
			try {
				return imageManager.loadImage(source);
			} catch (error) {
				return "";
			}
		},
	},
};
