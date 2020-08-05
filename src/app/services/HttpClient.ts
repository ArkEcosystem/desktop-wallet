import { Contracts, Http } from "@arkecosystem/platform-sdk";
import fetch from "isomorphic-fetch";

export class HttpClient extends Http.Request {
	protected async send(
		method: string,
		url: string,
		data?: {
			query?: object;
			data?: any;
		},
	): Promise<Contracts.HttpResponse> {
		let response;

		if (data?.query) {
			const hasQueryKeys: boolean = Object.keys(data.query).length > 0;

			if (hasQueryKeys) {
				url = `${url}?${new URLSearchParams(data.query as any)}`;
			}
		}

		if (method === "GET") {
			response = await fetch(url);
		}

		if (method === "POST") {
			response = await fetch(url, { method: "POST", body: JSON.stringify(data?.data) });
		}

		return new Http.Response({
			body: await response?.text(),
			headers: response?.headers,
			statusCode: response?.status,
		});
	}
}
