import { Contracts, Http } from "@arkecosystem/platform-sdk";
import got from "got";
import { md5 } from "hash-wasm";
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

	public withSocksProxy(host: string): HttpClient {
		this._options.agent = {
			http: new SocksProxyAgent(host),
			https: new SocksProxyAgent(host),
		};

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
		const options: Http.RequestOptions = {
			...this._options,
			retry: 0,
		};

		if (data && data.query) {
			options.searchParams = data.query;
		}

		if (data && data.data) {
			if (this._bodyFormat === "json") {
				options.json = data.data;
			}

			// if (this._bodyFormat === "form_params") {
			// 	options.body = new URLSearchParams();

			// 	for (const [key, value] of Object.entries(data.data)) {
			// 		options.body.set(key, value);
			// 	}
			// }

			// if (this._bodyFormat === "multipart") {
			// 	options.body = new FormData();

			// 	for (const [key, value] of Object.entries(data.data)) {
			// 		options.body.append(key, value);
			// 	}
			// }
		}

		const cacheKey: string = await md5(`${method}.${url}.${JSON.stringify(data)}`);

		return this.cache.remember(cacheKey, async () => {
			try {
				// @ts-ignore
				const response = await got[method.toLowerCase()](url, options);

				return new Http.Response({
					body: response?.body,
					headers: response?.headers,
					statusCode: response?.status,
				});
			} catch (error) {
				return new Http.Response(error.response, error);
			}
		});
	}
}
