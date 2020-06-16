/* eslint-disable @typescript-eslint/unbound-method */
import axios from "axios";

import { httpClient } from "../";

jest.mock("axios", () => ({
	create: () => ({
		get: () => jest.fn(),
		post: () => jest.fn(),
	}),
}));

describe("HttpClient", () => {
	beforeEach(() => {
		jest.spyOn(httpClient, "get");
		jest.spyOn(httpClient, "post");
	});

	it("should get without params", async () => {
		await httpClient.get("/hello-world");

		expect(httpClient.get).toHaveBeenCalledWith("/hello-world");
	});

	it("should get with params", async () => {
		await httpClient.get("/hello-world", { q: "my-param" });

		expect(httpClient.get).toHaveBeenCalledWith("/hello-world", { q: "my-param" });
	});

	it("should post without params", async () => {
		await httpClient.post("/hello-world");

		expect(httpClient.post).toHaveBeenCalledWith("/hello-world");
	});

	it("should post without headers", async () => {
		await httpClient.post("/hello-world", { name: "my-param" });

		expect(httpClient.post).toHaveBeenCalledWith("/hello-world", { name: "my-param" });
	});

	it("should post without headers", async () => {
		await httpClient.post("/hello-world", { name: "my-param" }, { authorization: "Bearer bear" });

		expect(httpClient.post).toHaveBeenCalledWith(
			"/hello-world",
			{ name: "my-param" },
			{ authorization: "Bearer bear" },
		);
	});
});
