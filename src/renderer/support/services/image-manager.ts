export class ImageManager {
	readonly #context: any;

	public constructor() {
		this.#context = require.context("@/assets/images", true, /\.(png|jpe?g|svg)$/);
	}

	public loadImage(filename: string) {
		try {
			return this.#context(`./${filename}`);
		} catch (error) {
			// In case the image could not be found:

			if (filename.startsWith("flags/")) {
				return this.#context("./flags/default.svg");
			}

			return this.#context("./default.svg");
		}
	}
}
