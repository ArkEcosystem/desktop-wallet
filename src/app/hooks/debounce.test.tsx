import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useDebounce } from "./debounce";

describe("useDebounce", () => {
	it("should render useDebounce", async () => {
		jest.useFakeTimers();
		const debouncedValue = renderHook(() => useDebounce("query", 2000));
		act(() => {
			jest.runAllTimers();
		});
		await waitFor(() => expect(debouncedValue).toBeTruthy());
	});
});
