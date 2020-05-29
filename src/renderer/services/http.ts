import { Contracts } from "@arkecosystem/platform-sdk";
import { Reqwest } from "@kodekeep/reqwest";

export class HttpClient implements Contracts.HttpClient {
	readonly #client: Reqwest;

	public constructor() {
		this.#client = new Reqwest();

		this.#client.retry(0, 0);
	}

	public timeout(seconds: number): HttpClient {
		this.#client.timeout(seconds);

		return this;
	}

	public withoutEncoding(): HttpClient {
		this.#client.withOptions({
			encoding: null,
		});

		return this;
	}

	public async get(path: string, query: object = {}): Promise<Record<string, any>> {
		return (await this.#client.get(path, query)).throw().json();
	}

	public async post(path: string, body: object, headers: object = {}) {
		return (await this.#client.withHeaders(headers).post(path, body)).throw().json();
	}
}
