import { translations } from "domains/error/i18n";
import { Offline } from "domains/error/pages";
import React from "react";
import { render } from "utils/testing-library";

import { useNetworkStatus } from "./network-status";

describe("useNetworkStatus", () => {
	const TestNetworkStatus: React.FC = () => {
		const isOnline = useNetworkStatus();

		return isOnline ? <h1>My App</h1> : <Offline />;
	};

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it("should be online", () => {
		jest.spyOn(window.navigator, "onLine", "get").mockReturnValue(true);

		const { getByText } = render(<TestNetworkStatus />);

		expect(getByText("My App")).toBeTruthy();
	});

	it("should be offline", () => {
		jest.spyOn(window.navigator, "onLine", "get").mockReturnValueOnce(false);

		const { getByTestId } = render(<TestNetworkStatus />);

		expect(getByTestId("Offline__text")).toHaveTextContent(translations.OFFLINE.TITLE);
		expect(getByTestId("Offline__text")).toHaveTextContent(translations.OFFLINE.DESCRIPTION);
	});
});
