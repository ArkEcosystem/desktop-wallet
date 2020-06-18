import { Contracts } from "@arkecosystem/platform-sdk";
import fetch from "node-fetch";

export class HttpClient implements Contracts.HttpClient {
	public async get(path: string, searchParams?: Record<string, any>) {
		return (await fetch(searchParams ? `${path}?${new URLSearchParams(searchParams)}` : path)).json();
	}

	public async post(path: string, body: object, headers = {}) {
		return (await fetch(path, { method: "POST", body: JSON.stringify(body), headers })).json();
	}
}
