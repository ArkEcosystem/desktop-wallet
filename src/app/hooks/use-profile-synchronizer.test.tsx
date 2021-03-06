/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import { ConfigurationProvider, EnvironmentProvider } from "app/contexts";
import electron from "electron";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import {
	act as utilsAct,
	env,
	getDefaultProfileId,
	renderWithRouter,
	syncDelegates,
	waitFor,
} from "utils/testing-library";

import { useProfileRestore, useProfileSyncStatus } from "./use-profile-synchronizer";
import * as profileUtilsHook from "./use-profile-utils";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;

describe("useProfileSyncStatus", () => {
	it("should restore", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());
		const profileStatusMock = jest.spyOn(profile.status(), "isRestored").mockReturnValue(false);

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileSyncStatus(), { wrapper });

		expect(current.shouldRestore(profile)).toEqual(true);

		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";

		profileStatusMock.mockRestore();
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

		current.setStatus("idle");
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
	beforeEach(async () => {
		jest.useFakeTimers();

		const profile = env.profiles().findById(getDefaultProfileId());
		await env.profiles().restore(profile);
		await profile.sync();

		await syncDelegates(profile);
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it("should sync profile", async () => {
		history.push(dashboardURL);
		await act(async () => {
			const { getByTestId } = renderWithRouter(
				<Route path="/profiles/:profileId/dashboard">
					<div data-testid="ProfileSynced">test</div>
				</Route>,
				{
					history,
					routes: [dashboardURL],
					withProfileSynchronizer: true,
				},
			);

			await waitFor(() => expect(getByTestId("ProfileSynced")).toBeInTheDocument(), { timeout: 4000 });
		});
	});

	it("should clear last profile sync jobs", async () => {
		history.push(dashboardURL);
		jest.useFakeTimers();
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileSynced">test</div>
			</Route>,
			{
				history,
				routes: [dashboardURL],
				withProfileSynchronizer: true,
			},
		);

		jest.runAllTimers();
		await waitFor(() => expect(getByTestId("ProfileSynced")).toBeInTheDocument(), { timeout: 4000 });

		history.push("/");

		await utilsAct(async () => {
			jest.runAllTimers();
			await waitFor(() => expect(history.location.pathname).toEqual("/"));
			await waitFor(() => expect(() => getByTestId("ProfileSynced")).toThrow(), { timeout: 4000 });
		});

		jest.clearAllTimers();
	});

	it("should not sync if not in profile's url", async () => {
		history.push("/");

		jest.useFakeTimers();
		const { getByTestId } = renderWithRouter(
			<Route path="/">
				<div data-testid="RenderedContent">test</div>
			</Route>,
			{
				history,
				routes: ["/"],
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByTestId("RenderedContent")).toBeInTheDocument(), { timeout: 4000 });
		jest.runAllTimers();
	});

	it("should sync only valid profiles from url", async () => {
		history.push("/profiles/invalidId/dashboard");

		const { getByTestId } = renderWithRouter(
			<Route path="/">
				<div data-testid="RenderedContent">test</div>
			</Route>,
			{
				history,
				routes: ["/profiles/:profileId/dashboard"],
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByTestId("RenderedContent")).toBeInTheDocument(), { timeout: 4000 });
	});

	it("should restore profile", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = undefined;

		history.push(dashboardURL);

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileRestored">test</div>
			</Route>,
			{
				history,
				routes: [dashboardURL],
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

		const memoryPasswordMock = jest.spyOn(profile.password(), "get").mockImplementation(() => {
			throw new Error("password not found");
		});

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="Content">test</div>
			</Route>,
			{
				history,
				routes: [passwordProtectedUrl],
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

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileRestored">test</div>
			</Route>,
			{
				history,
				routes: [dashboardURL],
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

		await expect(current.restoreProfile(profile)).resolves.toEqual(false);

		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
	});

	it("should restore and save profile", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());
		const profileStatusMock = jest.spyOn(profile.status(), "isRestored").mockReturnValue(false);
		profile.wallets().flush();

		const mockProfileFromUrl = jest.spyOn(profileUtilsHook, "useProfileUtils").mockImplementation(() => ({
			getProfileFromUrl: () => profile,
			getProfileStoredPassword: () => undefined,
		}));

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
		mockProfileFromUrl.mockRestore();
		profileStatusMock.mockRestore();
	});

	it("should restore a profile that uses password", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		const profileStatusMock = jest.spyOn(profile.status(), "isRestored").mockReturnValue(false);

		const mockProfileFromUrl = jest.spyOn(profileUtilsHook, "useProfileUtils").mockImplementation(() => ({
			getProfileFromUrl: () => profile,
			getProfileStoredPassword: () => "password",
		}));

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
		mockProfileFromUrl.mockRestore();
		profileStatusMock.mockRestore();
	});

	it("should not restore if url doesn't match active profile", async () => {
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());
		profile.status().reset();
		profile.wallets().flush();

		const mockProfileFromUrl = jest.spyOn(profileUtilsHook, "useProfileUtils").mockImplementation(() => ({
			getProfileFromUrl: () => undefined,
			getProfileStoredPassword: () => undefined,
		}));

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

		expect(isRestored).toBeFalsy();

		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
		mockProfileFromUrl.mockRestore();
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

	it("should restore sign out automatically", async () => {
		jest.useFakeTimers();
		process.env.TEST_PROFILES_RESTORE_STATUS = undefined;
		process.env.REACT_APP_IS_E2E = undefined;
		const profile = env.profiles().findById(getDefaultProfileId());
		profile.status().reset();

		history.push(dashboardURL);

		const idleTimeMock = jest
			.spyOn(electron.remote.powerMonitor, "getSystemIdleTime")
			.mockImplementation(() => 1000);

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<div data-testid="ProfileRestored">test</div>
			</Route>,
			{
				history,
				routes: [dashboardURL],
				withProfileSynchronizer: true,
			},
		);

		const historyMock = jest.spyOn(history, "push").mockReturnValue();

		await waitFor(() => expect(getByTestId("ProfileRestored")).toBeInTheDocument(), { timeout: 4000 });

		await waitFor(() => expect(historyMock).toHaveBeenCalled(), { timeout: 4000 });

		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
		idleTimeMock.mockRestore();
		historyMock.mockRestore();
	});
});
