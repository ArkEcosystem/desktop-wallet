import nock from "nock";

import { HttpClient } from "./HttpClient";

let subject: HttpClient;

beforeAll(() => {
	nock.disableNetConnect();

	subject = new HttpClient();
});

describe("HttpClient", () => {
	it("should get with params", async () => {
		const responseBody = {
			args: { key: "value" },
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/get",
		};

		nock("http://httpbin.org/").get("/get").query(true).reply(200, responseBody);

		await expect(subject.get("http://httpbin.org/get", { key: "value" })).resolves.toEqual(responseBody);
	});

	it("should get without params", async () => {
		const responseBody = {
			args: {},
			origin: "87.95.132.111,10.100.91.201",
			url: "http://httpbin.org/get",
		};

		nock("http://httpbin.org/").get("/get").reply(200, responseBody);

		await expect(subject.get("http://httpbin.org/get")).resolves.toEqual(responseBody);
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

		await expect(subject.post("http://httpbin.org/post", { key: "value" })).resolves.toEqual(responseBody);
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

		await expect(
			subject.post("http://httpbin.org/post", { key: "value" }, { Authorization: "Bearer TOKEN" }),
		).resolves.toEqual(responseBody);
	});
});
