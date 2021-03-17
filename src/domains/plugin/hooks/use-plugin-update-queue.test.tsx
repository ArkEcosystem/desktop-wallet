import { waitFor } from "@testing-library/react";
import { act as actHook, renderHook } from "@testing-library/react-hooks";

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
		const { result } = renderHook(() => usePluginUpdateQueue(ids));

		await actHook(async () => {
			result.current.start();
			await waitFor(() => expect(result.current.hasInQueue("plugin-3")).toBe(true));
			await waitFor(() => expect(result.current.isUpdating).toBe(true));
			await waitFor(() => expect(result.current.isCompleted).toBe(true));
		});

		expect(result.current.isUpdating).toBe(false);
		expect(result.current.hasInQueue("plugin-3")).toBe(false);
	});
});
