import { Contracts } from "@arkecosystem/platform-sdk";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class HttpClient implements Contracts.HttpClient {
	readonly client: AxiosInstance;

	public constructor() {
		const config: AxiosRequestConfig = {
			timeout: 2000,
		};

		this.client = axios.create(config);
	}

	// public timeout(seconds: number): HttpClient {
	// 	this.client.timeout(seconds);

	// 	return this;
	// }

	// public withoutEncoding(): HttpClient {
	// 	this.client.responseType = "arraybuffer";

	// 	return this;
	// }

	public async get(path: string, query: object = {}): Promise<Record<string, any>> {
		return await this.client.get(path, { params: { ...query } });
	}

	public async post(path: string, body: object, headers: object = {}) {
		return await this.client.post(path, { body, headers });
	}
}
