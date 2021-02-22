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

describe("useDeeplink hook", () => {
	const toastWarningSpy = jest.spyOn(toasts, "warning").mockImplementationOnce((subject) => jest.fn(subject));
	const toastErrorSpy = jest.spyOn(toasts, "error").mockImplementationOnce((subject) => jest.fn(subject));

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const TestComponent: React.FC = () => {
		useDeeplink();

		return <h1>Deeplink tester</h1>;
	};

	it("should subscribe to deeplink listener", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(
				event,
				"ark:transfer?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
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
				"ark:transfer?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
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
		expect(toastWarningSpy).toHaveBeenCalledWith(translations.SELECT_A_PROFILE);
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});

	it("should subscribe to deeplink listener and toast a warning to coin not supported", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(
				event,
				"ark:transfer?coin=doge&network=mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
			),
		);

		window.history.pushState({}, "Deeplink Test", `/profiles/${getDefaultProfileId()}/dashboard`);

		const { getByText, history } = renderWithRouter(
			<Route pathname="/profiles/:profileId">
				<TestComponent />
			</Route>,
			{
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
			},
		);

		expect(getByText("Deeplink tester")).toBeTruthy();
		expect(toastErrorSpy).toHaveBeenLastCalledWith('Invalid URI: Coin "doge" not supported.');
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});

	it("should subscribe to deeplink listener and toast a warning to network not supported", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(
				event,
				"ark:transfer?coin=ark&network=custom&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
			),
		);

		window.history.pushState({}, "Deeplink Test", `/profiles/${getDefaultProfileId()}/dashboard`);

		const { getByText, history } = renderWithRouter(
			<Route pathname="/profiles/:profileId">
				<TestComponent />
			</Route>,
			{
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
			},
		);

		expect(getByText("Deeplink tester")).toBeTruthy();
		expect(toastErrorSpy).toHaveBeenCalledWith('Invalid URI: Network "custom" not supported.');
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});

	it("should subscribe to deeplink listener and toast a warning to no senders available", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(
				event,
				"ark:transfer?coin=ark&network=ark.mainnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
			),
		);

		window.history.pushState({}, "Deeplink Test", `/profiles/${getDefaultProfileId()}/dashboard`);

		const { getByText, history } = renderWithRouter(
			<Route pathname="/profiles/:profileId">
				<TestComponent />
			</Route>,
			{
				routes: [`/profiles/${getDefaultProfileId()}/dashboard`],
			},
		);

		expect(getByText("Deeplink tester")).toBeTruthy();
		expect(toastErrorSpy).toHaveBeenCalledWith(
			'Invalid URI: The current profile has no wallets available for the "ark.mainnet" network',
		);
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});

	it("should subscribe to deeplink listener and navigate", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(
				event,
				"ark:transfer?coin=ark&network=ark.devnet&recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1.2&memo=ARK",
			),
		);

		window.history.pushState(
			{},
			"Deeplink Test",
			`/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}`,
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
		expect(history.location.pathname).toEqual(`/profiles/${getDefaultProfileId()}/send-transfer`);
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});

	it("should subscribe to deeplink listener and navigate when no method found", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(event, "ark:vote?coin=ark&network=ark.devnet&delegate=alessio"),
		);

		window.history.pushState(
			{},
			"Deeplink Test",
			`/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}`,
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
		expect(history.location.pathname).toEqual("/");
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});

	it("should use create", () => {
		ipcRenderer.on.mockImplementationOnce((event, callback) =>
			callback(event, "ark:vote?coin=ark&network=ark.devnet&delegate=alessio"),
		);

		window.history.pushState({}, "Deeplink Test", `/profiles/create/wallets/${getDefaultWalletId()}`);

		const { getByText, history } = renderWithRouter(
			<Route pathname="/profiles/:profileId/wallets/:walletId">
				<TestComponent />
			</Route>,
			{
				routes: [walletURL],
			},
		);

		expect(getByText("Deeplink tester")).toBeTruthy();
		expect(ipcRenderer.on).toBeCalledWith("process-url", expect.any(Function));
	});
});
