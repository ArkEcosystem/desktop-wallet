import { act, renderHook } from "@testing-library/react-hooks";
import { translations as errorTranslations } from "domains/error/i18n";
import { Offline } from "domains/error/pages";
import React from "react";
import { render } from "utils/testing-library";

import { useNetworkStatus } from "./network-status";

let eventMap: any;

describe("useNetworkStatus", () => {
	const TestNetworkStatus: React.FC = () => {
		const isOnline = useNetworkStatus();

		return isOnline ? <h1>My App</h1> : <Offline />;
	};

	beforeEach(() => {
		jest.restoreAllMocks();

		eventMap = {};

		window.addEventListener = jest.fn((eventName, callback) => {
			eventMap[eventName] = callback;
		});
	});

	afterEach(() => {
		window.removeEventListener = jest.fn((eventName) => {
			delete eventMap[eventName];
		});
	});

	it("should be online", () => {
		jest.spyOn(window.navigator, "onLine", "get").mockReturnValue(true);

		const { getByText } = render(<TestNetworkStatus />);

		expect(getByText("My App")).toBeTruthy();
	});

	it("should be offline", () => {
		jest.spyOn(window.navigator, "onLine", "get").mockReturnValueOnce(false);

		const { getByTestId } = render(<TestNetworkStatus />);

		expect(getByTestId("Offline__text")).toHaveTextContent(errorTranslations.OFFLINE.TITLE);
		expect(getByTestId("Offline__text")).toHaveTextContent(errorTranslations.OFFLINE.DESCRIPTION);
	});

	it("should trigger event", () => {
		jest.spyOn(window.navigator, "onLine", "get").mockReturnValueOnce(false);
		const { result } = renderHook(() => useNetworkStatus());

		act(() => {
			eventMap.online();
		});

		expect(result.current.valueOf()).toEqual(true);
	});
});
