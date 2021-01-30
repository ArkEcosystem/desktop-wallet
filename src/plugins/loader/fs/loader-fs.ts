import resolve from "enhanced-resolve";
import fs from "fs";
import { glob } from "glob";
import path from "path";

import { PluginRawInstance } from "../../types";
import * as loaderIpc from "./loader-fs-ipc";

export class PluginLoaderFileSystem {
	#roots: string[];

	constructor(paths: string[]) {
		this.#roots = paths;
	}

	static ipc() {
		return loaderIpc;
	}

	remove(dir: string) {
		const fsExtra = require("fs-extra");
		const isValid = this.#roots.some((root) => new RegExp(root).test(dir));

		if (!isValid) {
			return Promise.reject(`The dir ${dir} cannot be removed.`);
		}

		return fsExtra.remove(dir);
	}

	search(): PluginRawInstance[] {
		const paths = this.findPathsByConfigFiles();
		const entries: PluginRawInstance[] = [];

		for (const dir of paths) {
			try {
				const result = this.find(dir);
				entries.push(result!);
			} catch {
				continue;
			}
		}

		return entries;
	}

	find(dir: string) {
		const configPath = path.join(dir, "package.json");
		const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

		const sourcePath = resolve.sync(dir, ".");

		/* istanbul ignore next */
		if (sourcePath) {
			const source = fs.readFileSync(sourcePath, "utf-8");

			return {
				sourcePath,
				source,
				config,
				dir,
			};
		}
	}

	private findPathsByConfigFiles() {
		const files: string[] = [];

		for (const cwd of this.#roots) {
			const match = glob.sync("**/package.json", {
				cwd,
				matchBase: true,
				ignore: "**/node_modules/**/*",
				nodir: true,
				absolute: true,
			});

			files.push(...match);
		}

		const paths = files.map((file) => path.dirname(file));

		return paths;
	}
}
