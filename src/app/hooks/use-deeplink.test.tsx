import { ipcRenderer } from "electron";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { getDefaultProfileId, getDefaultWalletId, renderWithRouter } from "testing-library";

import { useDeeplink } from "./use-deeplink";

const history = createMemoryHistory();
const walletURL = `/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}`;

jest.mock("electron", () => ({
	ipcRenderer: { on: jest.fn(), send: jest.fn(), removeListener: jest.fn() },
}));

describe("useDeeplink hook", () => {
	const TestComponent: React.FC = () => {
		useDeeplink();

		return <h1>Deeplink tester</h1>;
	};

	it("should subscribe to deeplink listener", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) => {
			callback(event, "success");
		});

		const { getByText, history } = renderWithRouter(
			<Route>
				<TestComponent />
			</Route>,
		);

		expect(getByText("Deeplink tester")).toBeTruthy();
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});
});
