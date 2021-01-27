import { Contracts, Http } from "@arkecosystem/platform-sdk";
import fetch from "cross-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";
import { Primitive } from "type-fest";

import { Cache } from "./Cache";

export class HttpClient extends Http.Request {
	private readonly cache: Cache;

	public constructor(ttl: number) {
		super();

		this.cache = new Cache(ttl);

		this.withHeaders({
			Accept: "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*",
			// "Content-Type": "application/json",
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

		url = url.replace('@', '%40')
		url = url.replace('%3A', ':')

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
		console.log({ url, status: response.status })

		return new Http.Response({
			body: await response.text(),
			headers: (response.headers as unknown) as Record<string, Primitive>,
			statusCode: response.status,
		});
	}

	public clearCache() {
		this.cache.flush();
	}
}
