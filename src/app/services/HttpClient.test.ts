/* eslint-disable @typescript-eslint/unbound-method */

import { HttpClient } from "./HttpClient";

jest.mock("axios", () => ({
	create: () => ({
		get: () => jest.fn(),
		post: () => jest.fn(),
	}),
}));

let subject: HttpClient;

beforeEach(() => (subject = new HttpClient()));

describe("HttpClient", () => {
	beforeEach(() => {
		jest.spyOn(subject, "get");
		jest.spyOn(subject, "post");
	});

	it("should get without params", async () => {
		await subject.get("/hello-world");

		expect(subject.get).toHaveBeenCalledWith("/hello-world");
	});

	it("should get with params", async () => {
		await subject.get("/hello-world", { q: "my-param" });

		expect(subject.get).toHaveBeenCalledWith("/hello-world", { q: "my-param" });
	});

	it("should post without params", async () => {
		await subject.post("/hello-world", { key: "value" });

		expect(subject.post).toHaveBeenCalledWith("/hello-world", { key: "value" });
	});

	it("should post without headers", async () => {
		await subject.post("/hello-world", { name: "my-param" });

		expect(subject.post).toHaveBeenCalledWith("/hello-world", { name: "my-param" });
	});

	it("should post without headers", async () => {
		await subject.post("/hello-world", { name: "my-param" }, { authorization: "Bearer bear" });

		expect(subject.post).toHaveBeenCalledWith(
			"/hello-world",
			{ name: "my-param" },
			{ authorization: "Bearer bear" },
		);
	});
});
