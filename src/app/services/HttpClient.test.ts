import nock from "nock";

import { HttpClient } from "./HttpClient";

let subject: HttpClient;

beforeAll(() => {
	nock.disableNetConnect();

	subject = new HttpClient(0);
});

describe("HttpClient", () => {
	it("should get with params", async () => {
		const responseBody = {
			args: { key: "value" },
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/get",
		};

		nock("http://httpbin.org/").get("/get").query(true).reply(200, responseBody);

		const response = await subject.get("http://httpbin.org/get", { key: "value" });

		expect(response.json()).toEqual(responseBody);
	});

	it("should get without params", async () => {
		const responseBody = {
			args: {},
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/get",
		};

		nock("http://httpbin.org/").get("/get").reply(200, responseBody);

		const response = await subject.get("http://httpbin.org/get");

		expect(response.json()).toEqual(responseBody);
	});

	it("should handle 404 status codes", async () => {
		nock("http://httpbin.org/").get("/get").reply(404, {});

		await expect(subject.get("http://httpbin.org/get")).rejects.toThrow();
	});

	it("should post with body", async () => {
		const responseBody = {
			args: {},
			data: '{"key":"value"}',
			files: {},
			form: {},
			json: {
				key: "value",
			},
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/post",
		};

		nock("http://httpbin.org/").post("/post").reply(200, responseBody);

		const response = await subject.post("http://httpbin.org/post", { key: "value" });

		expect(response.json()).toEqual(responseBody);
	});

	it("should post with headers", async () => {
		const responseBody = {
			args: {},
			data: '{"key":"value"}',
			files: {},
			form: {},
			headers: { Authorization: "Bearer TOKEN" },
			json: {
				key: "value",
			},
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/post",
		};

		nock("http://httpbin.org/").post("/post").reply(200, responseBody);

		const response = await subject
			.withHeaders({ Authorization: "Bearer TOKEN" })
			.post("http://httpbin.org/post", { key: "value" });

		expect(response.json()).toEqual(responseBody);
	});

	it("should throw if an unsupported method is used", async () => {
		await expect(subject.delete("http://httpbin.org/delete")).rejects.toThrow(
			"Received no response. This looks like a bug.",
		);
	});

	// @README: Run this locally with TOR running.
	it.skip("should connect with TOR", async () => {
		nock.enableNetConnect();

		const realAddress = await subject.get("https://ipinfo.io");
		const newAddress = await subject.withSocksProxy("socks5://127.0.0.1:9050").get("https://ipinfo.io");

		expect(newAddress.json().ip).not.toBe(realAddress);
	});
});
