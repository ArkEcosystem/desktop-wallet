import { Contracts, Http } from "@arkecosystem/platform-sdk";
import { md5 } from "hash-wasm";
import fetch from "isomorphic-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";
import { Primitive } from "type-fest";

import { Cache } from "./Cache";

export class HttpClient extends Http.Request {
	private readonly cache: Cache;

	public constructor(ttl: number) {
		super();

		this.cache = new Cache(ttl);

		this.withHeaders({
			Accept: "application/json",
			"Content-Type": "application/json",
		});
	}

	/* istanbul ignore next */
	public withSocksProxy(host: string): HttpClient {
		this._options.agent = new SocksProxyAgent(host);

		return this;
	}

	protected async send(
		method: string,
		url: string,
		data?: {
			query?: object;
			data?: any;
		},
	): Promise<Contracts.HttpResponse> {
		if (data?.query && Object.keys(data?.query).length > 0) {
			url = `${url}?${new URLSearchParams(data.query as any)}`;
		}

		const cacheKey: string = await md5(`${method}.${url}.${JSON.stringify(data)}`);

		return this.cache.remember(cacheKey, async () => {
			let response;

			if (method === "GET") {
				response = await fetch(url, this._options);
			}

			if (method === "POST") {
				response = await fetch(url, {
					...this._options,
					method: "POST",
					body: JSON.stringify(data?.data),
				});
			}

			if (!response) {
				throw new Error("Received no response. This looks like a bug.");
			}

			return new Http.Response({
				body: await response.text(),
				headers: (response.headers as unknown) as Record<string, Primitive>,
				statusCode: response.status,
			});
		});
	}

	public clearCache() {
		this.cache.flush();
	}
}
