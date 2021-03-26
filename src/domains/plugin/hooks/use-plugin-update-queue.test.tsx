import { waitFor } from "@testing-library/react";
import { act as actHook, renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import { PluginManager, PluginManagerProvider } from "plugins";
import React from "react";
import { env } from "utils/testing-library";

import { usePluginUpdateQueue } from "./use-plugin-update-queue";

describe("Plugin Update Queue", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	beforeAll(() => {
		jest.useRealTimers();
	});

	it("should work properly", async () => {
		const ids = ["plugin-1", "plugin-2", "plugin-3"];
		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<PluginManagerProvider services={[]} manager={new PluginManager()}>
					{children}
				</PluginManagerProvider>
			</EnvironmentProvider>
		);

		const { result } = renderHook(() => usePluginUpdateQueue(), { wrapper });

		await actHook(async () => {
			result.current.startUpdate(ids);
			await waitFor(() => expect(result.current.hasInUpdateQueue("plugin-3")).toBe(true));
			await waitFor(() => expect(result.current.hasUpdateComplete("plugin-3")).toBe(false));
			await waitFor(() => expect(result.current.isUpdating).toBe(true));
			await waitFor(() => expect(result.current.isUpdateCompleted).toBe(true));
			await waitFor(() => expect(result.current.hasUpdateComplete("plugin-3")).toBe(true));
		});

		expect(result.current.isUpdating).toBe(false);
		expect(result.current.hasInUpdateQueue("plugin-3")).toBe(false);
	});
});
