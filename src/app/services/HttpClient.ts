import { Contracts, Http } from "@arkecosystem/platform-sdk";
import crossFetch from "cross-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";
import hash from "string-hash";
import { spawn, Thread, Worker } from "threads"
import { Primitive } from "type-fest";

import { Cache } from "./Cache";

/* istanbul ignore next */
const fetch = process.env.REACT_APP_IS_E2E ? window.fetch : crossFetch;

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

		const cacheKey: string = hash(`${method}.${url}.${JSON.stringify(data)}`).toString();

		return this.cache.remember(cacheKey, async () => {
			const client = await spawn(new Worker("./HttpClient.worker"))

			let response;

			if (method === "GET") {
				response = await client.get(url, this._options);
			}

			if (method === "POST") {
				response = await client.post(url, this._options, data);
			}

			await Thread.terminate(client);

			return new Http.Response(response);
		});
	}

	public clearCache() {
		this.cache.flush();
	}
}
