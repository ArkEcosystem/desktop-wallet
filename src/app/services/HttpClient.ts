import { AbstractRequest, HttpResponse, Response } from "@arkecosystem/platform-sdk-http";
import crossFetch from "cross-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";
import hash from "string-hash";
import { Primitive } from "type-fest";

import { Cache } from "./Cache";

/* istanbul ignore next */
const fetch = process.env.REACT_APP_IS_E2E ? window.fetch : crossFetch;

export class HttpClient extends AbstractRequest {
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
	): Promise<HttpResponse> {
		if (data?.query && Object.keys(data?.query).length > 0) {
			url = `${url}?${new URLSearchParams(data.query as any)}`;
		}

		const cacheKey: string = hash(`${method}.${url}.${JSON.stringify(data)}`).toString();
		// console.time(url);

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

			return new Response({
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
