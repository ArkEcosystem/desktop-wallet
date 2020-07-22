import { Contracts, Http } from "@arkecosystem/platform-sdk";
import fetch from "node-fetch";

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

		if (method === "GET") {
			response = await fetch(data?.query ? `${url}?${new URLSearchParams(data.query as any)}` : url);
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
