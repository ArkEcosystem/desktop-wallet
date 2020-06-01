import * as nock from "nock";

import { HttpClient } from "@/support/services/http";

let subject: HttpClient;
beforeAll(() => {
	subject = new HttpClient();

	nock.disableNetConnect();
});

afterEach(() => nock.cleanAll());

describe("HttpClient", () => {
	it("should perform a GET request", async () => {
		nock("http://my.server.com")
			.get("/")
			.reply(200, JSON.stringify({ key: "value" }));

		await expect(subject.get("http://my.server.com/")).resolves.toEqual({ key: "value" });
	});

	it("should perform a POST request", async () => {
		nock("http://my.server.com")
			.post("/")
			.reply(200, JSON.stringify({ key: "value" }));

		await expect(subject.post("http://my.server.com/", { key: "value" })).resolves.toEqual({ key: "value" });
	});
});
