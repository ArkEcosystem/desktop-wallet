import electron from "electron";
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

	it("should set timer if not set and path does match", () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const location = {
			pathname: `/profiles/${profile.id()}/dashboard`,
		};
		const redirect = jest.fn();
		const history = { push: jest.fn() };
		const params = { location, redirect, env, history };
		// @ts-ignore
		expect(subject.state).toEqual({});
		expect(subject.handler(params)).toBe(true);
		expect(subject.state).toEqual(
			expect.objectContaining({
				intervalId: expect.any(Number),
				threshold: expect.any(Number),
			}),
		);
	});

	it("should not redirect if not idle", () => {
		jest.spyOn(electron.remote.powerMonitor, "getSystemIdleTime").mockImplementation(() => 30);

		jest.useFakeTimers();

		const profile = env.profiles().findById(getDefaultProfileId());

		const location = {
			pathname: `/profiles/${profile.id()}/dashboard`,
		};
		const redirect = jest.fn();
		const pushSpy = jest.fn();
		const history = { push: pushSpy };
		const params = { location, redirect, env, history };
		// @ts-ignore
		expect(subject.state).toEqual({});
		expect(subject.handler(params)).toBe(true);
		expect(subject.state).toEqual(
			expect.objectContaining({
				intervalId: expect.any(Number),
				threshold: expect.any(Number),
			}),
		);

		jest.runOnlyPendingTimers();

		expect(pushSpy).not.toHaveBeenCalled();
	});

	it("should redirect if idle", () => {
		jest.spyOn(electron.remote.powerMonitor, "getSystemIdleTime").mockImplementation(() => 61);

		jest.useFakeTimers();

		const profile = env.profiles().findById(getDefaultProfileId());

		const location = {
			pathname: `/profiles/${profile.id()}/dashboard`,
		};
		const redirect = jest.fn();
		const pushSpy = jest.fn();
		const history = { push: pushSpy };
		const params = { location, redirect, env, history };
		// @ts-ignore
		expect(subject.state).toEqual({});
		expect(subject.handler(params)).toBe(true);
		expect(subject.state).toEqual(
			expect.objectContaining({
				intervalId: expect.any(Number),
				threshold: expect.any(Number),
			}),
		);

		jest.runOnlyPendingTimers();

		expect(pushSpy).toHaveBeenCalledWith("/");
	});

	it("should reset timer if set and path does not match", () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		let location = {
			pathname: `/profiles/${profile.id()}/dashboard`,
		};
		const redirect = jest.fn();
		const history = { push: jest.fn() };
		const params = { location, redirect, env, history };
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
		expect(subject.state).toEqual(
			expect.objectContaining({
				intervalId: expect.any(Number),
				threshold: expect.any(Number),
			}),
		);

		location = {
			pathname: "/",
		};
		params.location = location;
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
		expect(subject.state).toEqual({});
	});

	it("should reset timer if set and path matches but is a subrouter", () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		let location = {
			pathname: `/profiles/${profile.id()}/dashboard`,
		};
		const redirect = jest.fn();
		const history = { push: jest.fn() };
		const params = { location, redirect, env, history };
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
		expect(subject.state).toEqual(
			expect.objectContaining({
				intervalId: expect.any(Number),
				threshold: expect.any(Number),
			}),
		);

		location = {
			pathname: "/profiles/create",
		};
		params.location = location;
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
		expect(subject.state).toEqual({});
	});

	it("should not reset timer if set and path matches", () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const location = {
			pathname: `/profiles/${profile.id()}/dashboard`,
		};
		const redirect = jest.fn();
		const history = { push: jest.fn() };
		const params = { location, redirect, env, history };
		// @ts-ignore
		expect(subject.handler(params)).toBe(true);

		const state = JSON.parse(JSON.stringify(subject.state));

		expect(subject.state).toEqual(
			expect.objectContaining({
				intervalId: expect.any(Number),
				threshold: expect.any(Number),
			}),
		);

		// @ts-ignore
		expect(subject.handler(params)).toBe(true);
		expect(subject.state).toEqual(state);
	});
});
