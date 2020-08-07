import { Contracts, Http } from "@arkecosystem/platform-sdk";
import fetch from "isomorphic-fetch";

export class HttpClient extends Http.Request {
	private readonly headers: Record<string, string> = {
		Accept: "application/json",
		"Content-Type": "application/json",
	};

	protected async send(
		method: string,
		url: string,
		data?: {
			query?: object;
			data?: any;
		},
	): Promise<Contracts.HttpResponse> {
		let response;

		if (data?.query && Object.keys(data?.query).length > 0) {
			url = `${url}?${new URLSearchParams(data.query as any)}`;
		}

		if (method === "GET") {
			response = await fetch(url, { headers: this.headers });
		}

		if (method === "POST") {
			response = await fetch(url, { method: "POST", body: JSON.stringify(data?.data), headers: this.headers });
		}

		return new Http.Response({
			body: await response?.text(),
			headers: response?.headers,
			statusCode: response?.status,
		});
	}
}
