import { Contracts } from "@arkecosystem/platform-sdk";
import fetch from "node-fetch";

export class HttpClient implements Contracts.HttpClient {
	public async get(path: string, query: object = {}) {
		return (await fetch(path, { params: { ...query } })).json();
	}

	public async post(path: string, body: object, headers: object = {}) {
		return (await fetch(path, { method: "POST", body: JSON.stringify(body), headers })).json();
	}
}
