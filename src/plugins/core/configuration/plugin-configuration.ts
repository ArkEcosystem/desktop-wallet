import { DataRepository } from "@arkecosystem/platform-sdk-profiles";
import { intersection, prettyBytes, startCase, uniq } from "@arkecosystem/utils";
import { githubImageProvider } from "domains/transaction/entity/providers";
import du from "du";
import parseAuthor from "parse-author";
import semver from "semver";
import stringHash from "string-hash";

import { schema } from "./schema";

export class PluginConfigurationData {
	#config: DataRepository;
	#manifest: DataRepository;
	#size = 0;

	constructor(config: DataRepository, manifest: DataRepository) {
		this.#config = config;
		this.#manifest = manifest;
	}

	static make(config: Record<string, any>, dir?: string) {
		const data = new DataRepository();
		data.fill(config);

		const manifest = new DataRepository();
		const values = data.get<Record<string, any>>("desktop-wallet");

		if (values) {
			manifest.fill(values);
		}

		const plugin = new PluginConfigurationData(data, manifest);

		if (dir) {
			plugin.syncSize(dir);
		}

		return plugin;
	}

	validate() {
		return schema.validateSync(this.#config.toJSON());
	}

	get<T = string>(key: string, defaultValue?: T) {
		return this.#config.get<T>(key, defaultValue);
	}

	manifest() {
		return this.#manifest;
	}

	name() {
		return this.get("name");
	}

	id(): number {
		return stringHash(this.get("name")!);
	}

	author() {
		if (this.isOfficial()) {
			return `ARK Ecosystem`;
		}

		const author = this.get<string | { name: string }>("author");
		const contributors = this.get<{ name: string }[]>("contributors");

		if (author) {
			if (typeof author === "string") {
				return parseAuthor(author).name;
			}
			return author.name;
		}

		if (contributors?.length) {
			return parseAuthor(contributors?.[0]?.name).name;
		}

		return `Unknown`;
	}

	keywords(): string[] {
		// @ts-ignore
		const keywords: string[] = this.get("keywords", []);

		return uniq(keywords).map((item) => startCase(item) as string);
	}

	categories() {
		const validCategories = ["game", "theme", "language", "utility", "exchange", "other"];
		// @ts-ignore
		const categories: string[] = this.manifest().get("categories", ["other"]);

		const result = intersection(categories, validCategories);

		return result;
	}

	permissions() {
		return this.manifest().get<string[]>("permissions", []);
	}

	urls() {
		return this.manifest().get<string[]>("urls", []);
	}

	version() {
		const version = this.get("version");
		return semver.valid(version) ? semver.coerce(version)?.version : "0.0.0";
	}

	logo() {
		const logo = this.manifest().get<string>("logo");
		if (logo && githubImageProvider.validate(logo)) {
			return logo;
		}
	}

	size() {
		return prettyBytes(this.#size);
	}

	title() {
		const title = this.manifest().get<string>("title");

		if (title) {
			return startCase(title);
		}

		const name = this.get("name")!;

		const parts = name.split("/");
		const tmp = parts[parts.length > 1 ? 1 : 0];

		return startCase(tmp);
	}

	isOfficial() {
		const name = this.name();

		if (!name) {
			return false;
		}

		const scopeRegex = new RegExp(`^@arkecosystem/`);
		return scopeRegex.test(name);
	}

	async syncSize(dir?: string) {
		const dist = this.get<{ unpackedSize: number }>("dist");

		let size = 0;

		if (dist) {
			size = dist.unpackedSize;
		} else if (dir) {
			try {
				size = await du(dir);
			} catch {
				size = 0;
			}
		}

		this.#size = size;
	}
}
