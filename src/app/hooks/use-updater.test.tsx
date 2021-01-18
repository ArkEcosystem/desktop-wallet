/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import electron from "electron";
import React from "react";
import { env, waitFor } from "utils/testing-library";

import { useUpdater } from "./use-updater";

describe("useUpdater hook", () => {
	beforeAll(() => {
		let isUpdateCalled = false;
		let updateDownloadedCalls = 0;

		jest.spyOn(electron.ipcRenderer, "invoke").mockResolvedValue((event: string) => {
			if (event === "updater:check-for-updates") {
				const response = {
					cancellationToken: isUpdateCalled ? null : "1",
					updateInfo: { version: "3.0.0" },
				};
				isUpdateCalled = true;
				return response;
			}
			return true;
		});

		jest.spyOn(electron.ipcRenderer, "on").mockImplementation(
			(evt: any, callback: (evt: any, data?: any) => void) => {
				if (evt === "updater:download-progress") {
					callback(evt, { total: 10, percent: 30, transferred: 3 });
				}

				if (evt === "updater:update-downloaded" && updateDownloadedCalls === 0) {
					updateDownloadedCalls += 1;
					callback(evt);
				}
			},
		);
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should handle cancel", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const { result } = renderHook(() => useUpdater(), { wrapper });

		act(() => {
			result.current.cancel();
		});

		await waitFor(() => expect(result.current.downloadStatus).toBe("canceled"));
	});

	it("should handle downloadUpdate", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const { result } = renderHook(() => useUpdater(), { wrapper });

		act(() => {
			result.current.downloadUpdate();
		});

		await waitFor(() => expect(result.current.downloadStatus).toBe("started"));
	});

	it("should handle quitInstall", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const { result } = renderHook(() => useUpdater(), { wrapper });

		act(() => {
			result.current.quitInstall();
		});

		await waitFor(() => expect(result.current.downloadStatus).toBe("idle"));
	});

	it("should handle failed update check in notifyForUpdates", async () => {
		const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);

		jest.spyOn(electron.ipcRenderer, "invoke").mockRejectedValueOnce(new Error("Error!"));

		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const { result } = renderHook(() => useUpdater(), { wrapper });

		await act(async () => {
			result.current.notifyForUpdates();
		});

		expect(consoleSpy).toHaveBeenCalledWith("Checking for update failed: Error!");

		consoleSpy.mockRestore();
	});

	it("should handle notifyForUpdates and find newer version", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const { result } = renderHook(() => useUpdater(), { wrapper });

		await act(async () => {
			result.current.notifyForUpdates();
		});

		await waitFor(() => expect(result.current.downloadStatus).toBe("idle"));
	});

	it("should handle notifyForUpdates and stay idle", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const { result } = renderHook(() => useUpdater(), { wrapper });

		act(() => {
			result.current.notifyForUpdates();
		});

		await waitFor(() => expect(result.current.downloadStatus).toBe("idle"));
	});

	it("should handle download progress", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const { result } = renderHook(() => useUpdater(), { wrapper });

		act(() => {
			result.current.notifyForUpdates();
		});

		await waitFor(() =>
			expect(result.current.downloadProgress).toStrictEqual({ percent: 30, total: 10, transferred: 3 }),
		);
	});
});
