/* eslint-disable @typescript-eslint/require-await */
import { renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter, waitFor } from "utils/testing-library";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
import { useProfileSyncStatus } from "./use-profile-synchronizer";

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
	});

	it("should not restore if not in demo", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;
		history.push(dashboardURL);

		env.profiles().flush();

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="RenderedContent">test</div>
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByTestId("RenderedContent")).toBeInTheDocument(), { timeout: 4000 });
	});
});

describe("useProfileSyncStatus", () => {
	it("should restore demo", async () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		expect(current.shouldRestore()).toEqual(true);
	});

	it("should not restore if not demo", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		expect(current.shouldRestore()).toEqual(false);
	});

	it("#idle", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		expect(current.isIdle()).toEqual(true);
		expect(current.shouldRestore()).toEqual(false);
		expect(current.shouldSync()).toEqual(true);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#restoring", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("restoring");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore()).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#restored", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("restored");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore()).toEqual(false);
		expect(current.shouldSync()).toEqual(true);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#syncing", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("syncing");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore()).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#synced", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("synced");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore()).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(true);
	});

	it("#completed", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus());

		current.setStatus("completed");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore()).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});
});
