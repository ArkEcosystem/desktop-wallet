import nock from "nock";

import { HttpClient } from "./HttpClient";

const responseGet = {
	args: {},
	origin: "87.95.132.111,10.100.91.201",
	url: "http://httpbin.org/get",
};

const responsePost = {
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

const responsePostWithHeaders = {
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

let subject: HttpClient;

beforeAll(() => {
	nock.disableNetConnect();

	subject = new HttpClient();
});

describe("HttpClient", () => {
	it("should get with params", async () => {
		nock("http://httpbin.org/").get("/get").reply(200, responseGet);

		await expect(subject.get("http://httpbin.org/get")).resolves.toEqual(responseGet);
	});

	it("should get without params", async () => {
		nock("http://httpbin.org/").get("/get").reply(200, responseGet);

		await expect(subject.get("http://httpbin.org/get")).resolves.toEqual(responseGet);
	});

	it("should post with body", async () => {
		nock("http://httpbin.org/").post("/post").reply(200, responsePost);

		await expect(subject.post("http://httpbin.org/post", { key: "value" })).resolves.toEqual(responsePost);
	});

	it("should post without body", async () => {
		nock("http://httpbin.org/").post("/post").reply(200, responsePost);

		await expect(subject.post("http://httpbin.org/post", { key: "value" })).resolves.toEqual(responsePost);
	});

	it("should post with headers", async () => {
		nock("http://httpbin.org/").post("/post").reply(200, responsePostWithHeaders);

		await expect(
			subject.post("http://httpbin.org/post", { key: "value" }, { Authorization: "Bearer TOKEN" }),
		).resolves.toEqual(responsePostWithHeaders);
	});
});
