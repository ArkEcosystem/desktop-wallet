import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { WithProviders } from "utils/testing-library";

import { useTimeFormat } from "./use-time-format";

describe("UseTimeFormat", () => {
	it("should return format without profile route", () => {
		const wrapper = ({ children }: any) => <WithProviders>{children}</WithProviders>;
		const { result } = renderHook(() => useTimeFormat(), { wrapper });

		expect(result.current).toBe("DD.MM.YYYY HH:mm");
	});
});
