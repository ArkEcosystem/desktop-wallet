export class ImageManager {
	readonly #context: any;

	constructor() {
		this.#context = require.context("../../assets/images", true, /\.(png|jpe?g|svg)$/);
	}

	public images() {
		return this.#context.keys();
	}

	public tree() {
		return this.images().reduce((stash, current) => {
			const path = current.replace("./", "");
			const [category, filename] = path.split("/");

			if (category && filename) {
				const previous = stash[category] || [];

				stash[category] = [...previous, `${category}/${filename}`];
			}

			return stash;
		}, {});
	}

	public inline(...filter) {
		let result = [];
		const tree = this.tree();

		for (const item of filter) {
			result = result.concat(tree[item] || []);
		}

		return result;
	}

	public loadImage(filename) {
		try {
			return this.#context(`./${filename}`);
		} catch {
			return this.#context("./default.svg");
		}
	}
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
	// Load all SVGs to be injected into the browser
	const svgs = require.context("@/assets/svg", true, /\.svg$/);
	svgs.keys().forEach(svgs);
}
