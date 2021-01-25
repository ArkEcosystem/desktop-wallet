import { EventEmitter } from "events";

type HandlerFn = (...args: any[]) => any;

const formatKey = (...args: string[]) => args.join(".");

export class PluginHooks extends EventEmitter {
	#filters: Map<string, HandlerFn[]> = new Map();
	#commands: Map<string, HandlerFn> = new Map();

	hasCommand(commandName: string) {
		return this.#commands.has(commandName);
	}

	registerCommand(commandName: string, handler: HandlerFn) {
		if (this.#commands.has(commandName)) {
			throw new Error(`Command ${commandName} already registered.`);
		}

		if (typeof handler !== "function") {
			throw new Error(`Expected handler to be a function, but found type '${typeof handler}'`);
		}

		this.#commands.set(commandName, handler);
	}

	executeCommand(commandName: string, ...args: any[]) {
		if (!this.#commands.has(commandName)) {
			throw new Error(`Command ${commandName} not found.`);
		}

		return this.#commands.get(commandName)?.(...args);
	}

	hasFilter(namespace: string, hookName: string) {
		return this.#filters.has(formatKey(namespace, hookName));
	}

	addFilter(namespace: string, hookName: string, handler: HandlerFn) {
		const key = formatKey(namespace, hookName);
		const current = this.#filters.get(key) || [];

		if (typeof handler !== "function") {
			throw new Error(`Expected handler to be a function, but found type '${typeof handler}'`);
		}

		current.push(handler);

		this.#filters.set(key, current);
	}

	applyFilter<T = unknown>(
		namespace: string,
		hookName: string,
		content: T,
		props?: Record<string, any>,
	): T | undefined {
		const key = formatKey(namespace, hookName);

		if (!this.#filters.has(key)) {
			return;
		}

		return this.#filters.get(key)!.reduce((acc, handler) => handler(acc, props), content);
	}

	clearAll() {
		this.#filters.clear();
		this.#commands.clear();
	}
}
