import { Middleware } from "router/interfaces";
import { env, getDefaultProfileId } from "utils/testing-library";

import { ProfileMiddleware } from "./middleware";

let subject: Middleware;

describe("ProfileMiddleware", () => {
	beforeEach(() => {
		subject = new ProfileMiddleware();
	});

	it("should return true if path does not match", () => {
		const location = {
			pathname: "/",
		};
		const redirect = jest.fn();
		const params = { location, redirect, env };
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
	});

	it("should return true if path matches but is a subrouter", () => {
		const location = {
			pathname: "/profiles/create",
		};
		const redirect = jest.fn();
		const params = { location, redirect, env };
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
	});

	it("should return false if path matches but the profile does not exist", () => {
		const location = {
			pathname: "/profiles/1/dashboard",
		};
		const redirect = jest.fn();
		const params = { location, redirect, env };
		// @ts-ignore
		expect(subject.handler(params)).toBe(false);
		expect(redirect).not.toHaveBeenCalled();
	});

	it("should return true if path matches and profile exists", () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const location = {
			pathname: `/profiles/${profile.id()}/dashboard`,
		};
		const redirect = jest.fn();
		const params = { location, redirect, env };
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
	});
});
