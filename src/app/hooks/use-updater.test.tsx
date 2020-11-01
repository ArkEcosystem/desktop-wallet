import { act, renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { env, waitFor } from "utils/testing-library";

import { useUpdater } from "./use-updater";

jest.mock(`electron`, () => {
	let isUpdateCalled = false;

	return {
		ipcRenderer: {
			invoke: (event: string, data) => {
				if (event === "updater:check-for-updates") {
					const response = {
						cancellationToken: isUpdateCalled ? null : "1",
						updateInfo: { version: "3.0.0" },
					};
					isUpdateCalled = true;
					return response;
				}
				return true;
			},
			on: (evt: any, callback: (evt: any, progress: any) => void) => {
				if (evt === "updater:download-progress") {
					callback(evt, { total: 10, percent: 30, transferred: 3 });
				}
			},
			handle: jest.fn(),
			send: jest.fn(),
			removeListener: jest.fn(),
		},
	};
});

describe("useUpdater hook", () => {
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

	it("should handle notifyForUpdates and find newer version", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const { result } = renderHook(() => useUpdater(), { wrapper });

		act(() => {
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
