import { Contracts, Http } from "@arkecosystem/platform-sdk";
import { md5 } from "hash-wasm";
// @ts-ignore
import needle from "needle";
import { SocksProxyAgent } from "socks-proxy-agent";

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
		const cacheKey: string = await md5(`${method}.${url}.${JSON.stringify(data)}`);

		return this.cache.remember(cacheKey, async () => {
			try {
				const options: Http.RequestOptions = { ...this._options };

				if (data?.query && Object.keys(data?.query).length > 0) {
					url = `${url}?${new URLSearchParams(data.query as any)}`;
				}

				let response;

				if (["POST", "PUT", "PATCH"].includes(method)) {
					response = await needle(method.toLowerCase(), url, data?.data, { ...options, json: true });
				} else {
					response = await needle(method.toLowerCase(), url, options);
				}

				return new Http.Response({
					body: JSON.stringify(response.body),
					headers: response.headers,
					statusCode: response.statusCode,
				});
			} catch (error) {
				console.log(error)
				return new Http.Response(
					{
						body: "{}",
						headers: {},
						statusCode: 500,
					},
					error,
				);
			}
		});
	}

	public clearCache() {
		this.cache.flush();
	}
}
