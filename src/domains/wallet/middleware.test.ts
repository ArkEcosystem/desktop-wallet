import { Middleware } from "router/interfaces";
import { env, getDefaultProfileId } from "utils/testing-library";

import { WalletMiddleware } from "./middleware";

let subject: Middleware;

describe("WalletMiddleware", () => {
	beforeEach(() => {
		subject = new WalletMiddleware();
	});

	it("should return true if path does not match", () => {
		const location = {
			pathname: "/profiles/create",
		};
		const redirect = jest.fn();
		const params = { location, redirect, env };
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
	});

	it("should return true if path matches but is a subrouter", () => {
		const location = {
			pathname: "/profiles/1/wallets/create",
		};
		const redirect = jest.fn();
		const params = { location, redirect, env };
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
	});

	it("should return false if path matches but the wallet does not exist", () => {
		const location = {
			pathname: "/profiles/1/wallets/1",
		};
		const redirect = jest.fn();
		const params = { location, redirect, env };
		// @ts-ignore
		expect(subject.handler(params)).toBe(false);
		expect(redirect).toHaveBeenCalled();
	});

	it("should return true if path matches and wallet exists", () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().values()[0];

		const location = {
			pathname: `/profiles/${profile.id()}/wallets/${wallet.id()}`,
		};
		const redirect = jest.fn();
		const params = { location, redirect, env };
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
	});
});
