/* eslint-disable @typescript-eslint/require-await */
import { MemoryPassword } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { ConfigurationProvider, EnvironmentProvider } from "app/contexts";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter, waitFor } from "utils/testing-library";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
import { useProfileRestore, useProfileSyncStatus } from "./use-profile-synchronizer";

describe("useProfileSyncStatus", () => {
	it("should restore", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus(), { wrapper });

		expect(current.shouldRestore(profile)).toEqual(true);
		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	});

	it("#idle", async () => {
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus(), { wrapper });

		expect(current.isIdle()).toEqual(true);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(true);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#restoring", async () => {
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus(), { wrapper });

		act(() => {
			current.setStatus("restoring");
		});

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#restored", async () => {
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus(), { wrapper });

		act(() => {
			current.markAsRestored(profile.id());
		});

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(true);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#syncing", async () => {
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus(), { wrapper });

		current.setStatus("syncing");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(false);
	});

	it("#synced", async () => {
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus(), { wrapper });

		current.setStatus("synced");

		expect(current.isIdle()).toEqual(false);
		expect(current.shouldRestore(profile)).toEqual(false);
		expect(current.shouldSync()).toEqual(false);
		expect(current.shouldMarkCompleted()).toEqual(true);
	});

	it("#completed", async () => {
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus(), { wrapper });

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
		process.env.REACT_APP_IS_E2E = undefined;

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

	it("should handle restoration error for password protected profile", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;

		const passwordProtectedUrl = "/profiles/cba050f1-880f-45f0-9af9-cfe48f406052/dashboard";
		history.push(passwordProtectedUrl);

		const profile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		profile.wallets().flush();

		const memoryPasswordMock = jest.spyOn(MemoryPassword, "get").mockImplementation(() => {
			throw new Error("password not found");
		});

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="Content">test</div>
			</Route>,
			{
				routes: [passwordProtectedUrl],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(() => getByTestId("Content")).toThrow());
		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
		memoryPasswordMock.mockRestore();
	});

	it("should restore profile and reset test password for e2e", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = "1";

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

describe("useProfileRestore", () => {
	it("should not restore profile if already restored in tests", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const {
			result: { current },
		} = renderHook(() => useProfileRestore(), { wrapper });

		expect(current.restoreProfile(profile)).resolves.toEqual(false);

		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
	});

	it("should restore", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());
		profile.wallets().flush();

		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const {
			result: { current },
		} = renderHook(() => useProfileRestore(), { wrapper });

		let isRestored;

		await act(async () => {
			isRestored = await current.restoreProfile(profile);
		});

		expect(isRestored).toEqual(true);

		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	});

	it("should restore a profile that uses password", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");

		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const {
			result: { current },
		} = renderHook(() => useProfileRestore(), { wrapper });

		let isRestored;

		await act(async () => {
			isRestored = await current.restoreProfile(profile, "password");
		});

		expect(isRestored).toEqual(true);

		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	});

	it("should restore in e2e", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = "1";

		const profile = env.profiles().findById(getDefaultProfileId());
		profile.wallets().flush();

		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const {
			result: { current },
		} = renderHook(() => useProfileRestore(), { wrapper });

		let isRestored;

		await act(async () => {
			isRestored = await current.restoreProfile(profile);
		});

		expect(isRestored).toEqual(true);

		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	});

	it("should restore only once", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = undefined;

		const profile = env.profiles().findById(getDefaultProfileId());
		profile.wallets().flush();

		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider defaultConfiguration={{ restoredProfiles: [profile.id()] }}>
					{children}
				</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const {
			result: { current },
		} = renderHook(() => useProfileRestore(), { wrapper });

		let isRestored;

		await act(async () => {
			isRestored = await current.restoreProfile(profile);
		});

		expect(isRestored).toEqual(false);

		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	});
});
