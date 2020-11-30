import { DateTime } from "@arkecosystem/platform-sdk-intl";

interface CacheItem {
	value: any;
	expires_at: DateTime;
}

export class Cache {
	private store: Record<string, CacheItem> = {};
	private ttl: number;

	public constructor(ttl: number) {
		this.ttl = ttl;
	}

	public async remember(key: string, value: unknown): Promise<any> {
		// 1. Check if we still have a matching item for the key.
		const cacheItem = this.store[key];

		if (cacheItem && DateTime.make().isBefore(cacheItem.expires_at)) {
			return cacheItem.value;
		}

		// 2. We don't have a matching value so we need to set it.
		let result: unknown = value;

		if (typeof value === "function") {
			result = await value();
		}

		this.store[key] = { value: result, expires_at: DateTime.make().addSeconds(this.ttl) };

		return result;
	}

	public flush() {
		this.store = {};
	}
}
