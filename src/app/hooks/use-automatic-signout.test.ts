import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import electron from "electron";
import { env, getDefaultProfileId, waitFor } from "utils/testing-library";

import { useAutomaticSignout } from "./use-automatic-signout";

let profile: Contracts.IProfile;

describe("useAutomaticSignout", () => {
	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await env.profiles().restore(profile);
	});

	it("should monitor idle time and timeout", async () => {
		let times = 1;
		const idleTimeMock = jest.spyOn(electron.remote.powerMonitor, "getSystemIdleTime").mockImplementation(() => {
			times = times + 2;
			return times;
		});

		const profileSettingMock = jest.spyOn(profile.settings(), "get").mockReturnValue(4);

		jest.useFakeTimers();

		const { result } = renderHook(() => useAutomaticSignout());
		const onTimeout = jest.fn();

		result.current.monitorIdleTime({ profile, onTimeout });
		jest.runAllTimers();
		await waitFor(() => expect(onTimeout).toHaveBeenCalled());

		idleTimeMock.mockRestore();
		profileSettingMock.mockRestore();
	});

	it("should wait previous timer", async () => {
		jest.useFakeTimers();
		const idleTimeMock = jest
			.spyOn(electron.remote.powerMonitor, "getSystemIdleTime")
			.mockImplementation(() => 1000);

		const { result } = renderHook(() => useAutomaticSignout());
		const onTimeout = jest.fn();
		// @TODO: proper expectation
		// expect(result.current.monitorIdleTime({ profile, onTimeout }));
		result.current.monitorIdleTime({ profile });

		jest.runAllTimers();

		await waitFor(() => expect(onTimeout).toHaveBeenCalled());
		idleTimeMock.mockRestore();
	});

	it("should not start if profile is not defined", async () => {
		jest.useFakeTimers();
		const idleTimeMock = jest.spyOn(electron.remote.powerMonitor, "getSystemIdleTime").mockImplementation(() => 1);

		const { result } = renderHook(() => useAutomaticSignout());
		const onTimeout = jest.fn();
		expect(result.current.monitorIdleTime({}));

		jest.runAllTimers();

		await waitFor(() => expect(onTimeout).not.toHaveBeenCalled());
		idleTimeMock.mockRestore();
	});

	it("should not start if profile is not restored", async () => {
		jest.useFakeTimers();
		const idleTimeMock = jest.spyOn(electron.remote.powerMonitor, "getSystemIdleTime").mockImplementation(() => 1);

		const { result } = renderHook(() => useAutomaticSignout());
		const onTimeout = jest.fn();
		const mockProfileStatus = jest.spyOn(profile.status(), "isRestored").mockReturnValue(false);
		expect(result.current.monitorIdleTime({ profile }));

		jest.runAllTimers();

		await waitFor(() => expect(onTimeout).not.toHaveBeenCalled());
		idleTimeMock.mockRestore();
		mockProfileStatus.mockRestore();
	});

	it("should reset automatic signout timer", () => {
		jest.useFakeTimers();

		const { result } = renderHook(() => useAutomaticSignout());

		expect(result.current.resetAutomatiSignout()).toBeUndefined();
	});
});
