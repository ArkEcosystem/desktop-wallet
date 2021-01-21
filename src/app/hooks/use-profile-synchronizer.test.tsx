/* eslint-disable @typescript-eslint/require-await */
import { renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter, waitFor } from "utils/testing-library";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
import { useProfileSyncStatus } from "./use-profile-synchronizer";

describe("useProfileSyncStatus", () => {
	it("should restore", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		expect(current.shouldRestore(profile)).toEqual(true);
		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	});

	it("should not restore if profile is created", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_BUILD_MODE = "demo";
		const profile = env.profiles().create("Test");

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		expect(current.shouldRestore(profile)).toEqual(false);
		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	});

	it("#idle", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		expect(current.isIdle()).toEqual(true);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(true);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#restoring", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("restoring");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#restored", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("restored");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(true);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#syncing", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("syncing");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#synced", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("synced");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(true);
	});

	it("#completed", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("completed");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});
});

describe("useProfileSynchronizer", () => {
	it("should sync profile", async () => {
		history.push(dashboardURL);
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileSynced">test</div>
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByTestId("ProfileSynced")).toBeInTheDocument(), { timeout: 4000 });
	});

	it("should clear last profile sync jobs", async () => {
		history.push(dashboardURL);
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileSynced">test</div>
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByTestId("ProfileSynced")).toBeInTheDocument(), { timeout: 4000 });
		history.push("/");
		await waitFor(() => expect(history.location.pathname).toEqual("/"));
	});

	it("should not sync if not in profile's url", async () => {
		history.push("/");

		const { getByTestId } = renderWithRouter(
			<Route path="/">
				<div data-testid="RenderedContent">test</div>
			</Route>,
			{
				routes: ["/"],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByTestId("RenderedContent")).toBeInTheDocument(), { timeout: 4000 });
	});

	it("should sync only valid profiles from url", async () => {
		history.push("/profiles/invalidId/dashboard");

		const { getByTestId } = renderWithRouter(
			<Route path="/">
				<div data-testid="RenderedContent">test</div>
			</Route>,
			{
				routes: ["/profiles/:profileId/dashboard"],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByTestId("RenderedContent")).toBeInTheDocument(), { timeout: 4000 });
	});

	it("should restore profile", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_BUILD_MODE = undefined;

		history.push(dashboardURL);

		const profile = env.profiles().findById(getDefaultProfileId());
		profile.wallets().flush();

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileRestored">test</div>
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByTestId("ProfileRestored")).toBeInTheDocument(), { timeout: 4000 });
		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	});

	it("should restore profile and reset test password for demo", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_BUILD_MODE = "demo";

		history.push(dashboardURL);

		const profile = env.profiles().findById(getDefaultProfileId());
		profile.wallets().flush();

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileRestored">test</div>
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByTestId("ProfileRestored")).toBeInTheDocument(), { timeout: 4000 });
		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	});
});
