export class StubStorage {
	readonly #storage;

	public constructor() {
		this.#storage = {};
	}

	public all(): object {
		return this.#storage;
	}

	public get<T = any>(key: string): T | undefined {
		return this.#storage[key];
	}

	public set(key: string, value: string | object): void {
		this.#storage[key] = value;
	}

	public has(key: string): boolean {
		return Object.keys(this.#storage).includes(key);
	}

	public forget(key: string): void {
		delete this.#storage[key];
	}

	public flush(): void {
		this.#storage = {};
	}

	public count(): number {
		return 0;
	}

	public async snapshot(): Promise<void> {
		//
	}

	public async restore(): Promise<void> {
		//
	}
}
