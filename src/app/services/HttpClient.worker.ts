import { expose } from "threads/worker"
import { Primitive } from "type-fest";

const resolveResponse = async (response: any): Promise<Record<string, any>> => {
	return {
		body: await response.text(),
		headers: (response.headers as unknown) as Record<string, Primitive>,
		statusCode: response.status,
	};
}

expose({
	async get(url, options) {
		const response = await fetch(url, options);

		if (!response) {
			throw new Error("Received no response. This looks like a bug.");
		}

		return resolveResponse(response);
	},
	async post(url, options, data) {
		const response = await fetch(url, {
			...options,
			method: "POST",
			body: JSON.stringify(data?.data),
		});

		if (!response) {
			throw new Error("Received no response. This looks like a bug.");
		}

		return resolveResponse(response);
	}
});
