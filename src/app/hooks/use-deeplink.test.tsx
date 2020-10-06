import { translations } from "app/i18n/common/i18n";
import { toasts } from "app/services";
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
	const toastSpy = jest.spyOn(toasts, "warning").mockImplementationOnce((subject) => jest.fn(subject));

	const TestComponent: React.FC = () => {
		useDeeplink();

		return <h1>Deeplink tester</h1>;
	};

	it("should subscribe to deeplink listener", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(
				event,
				"ark:transfer?coin=ark&network=mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
			),
		);

		const { getByText, history } = renderWithRouter(
			<Route pathname="/">
				<TestComponent />
			</Route>,
		);

		expect(getByText("Deeplink tester")).toBeTruthy();
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});

	it("should subscribe to deeplink listener and toast a warning to select a profile", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(
				event,
				"ark:transfer?coin=ark&network=mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
			),
		);

		const { getByText, history } = renderWithRouter(
			<Route pathname="/">
				<TestComponent />
			</Route>,
			{
				routes: ["/"],
			},
		);

		expect(getByText("Deeplink tester")).toBeTruthy();
		expect(toastSpy).toHaveBeenCalledWith(translations.SELECT_A_PROFILE);
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});

	it("should subscribe to deeplink listener and toast a warning to select a wallet", () => {
		window.history.pushState({}, "Deeplink Test", `/profiles/${getDefaultProfileId()}/dashboard`);

		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(
				event,
				"ark:transfer?coin=ark&network=mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
			),
		);

		const { getByText, history } = renderWithRouter(
			<Route pathname="/profiles/:profileId">
				<TestComponent />
			</Route>,
			{
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
			},
		);

		expect(getByText("Deeplink tester")).toBeTruthy();
		expect(toastSpy).toHaveBeenCalledWith(translations.SELECT_A_WALLET);
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});

	it("should subscribe to deeplink listener and navigate", () => {
		window.history.pushState(
			{},
			"Deeplink Test",
			`/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}`,
		);

		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(
				event,
				"ark:transfer?coin=ark&network=mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
			),
		);

		const { getByText, history } = renderWithRouter(
			<Route pathname="/profiles/:profileId/wallets/:walletId">
				<TestComponent />
			</Route>,
			{
				routes: [walletURL],
			},
		);

		expect(getByText("Deeplink tester")).toBeTruthy();
		expect(history.location.pathname).toEqual(
			`/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}/send-transfer`,
		);
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});
});
