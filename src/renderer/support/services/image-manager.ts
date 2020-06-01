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
			return this.#context("./default.svg");
		}
	}
}

if (process.env.NODE_ENV !== "test") {
	// Load all SVGs to be injected into the browser
	const svgs = require.context("@/assets/svg", true, /\.svg$/);
	svgs.keys().forEach(svgs);
}
