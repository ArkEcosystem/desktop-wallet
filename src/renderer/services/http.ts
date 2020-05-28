import { Reqwest } from "@kodekeep/reqwest";

export class HttpClient {
	readonly #client: Reqwest;

	public constructor() {
		this.#client = new Reqwest();
	}

	public async get(path: string, query: object = {}): Promise<Record<string, any>> {
		return (await this.#client.get(path, query)).throw().json();
	}

	public async post(path: string, body: object, headers: object = {}) {
		return (await this.#client.withHeaders(headers).post(path, body)).throw().json();
	}
}
