class Container {
	readonly _bindings: Map<string, any> = new Map();

	public get<T>(key: string): T {
		return this._bindings.get(key);
	}

	public set(key: string, value: unknown): void {
		this._bindings.set(key, value);
	}

	public has(key: string): boolean {
		return this._bindings.has(key);
	}
}

export const container = new Container();
