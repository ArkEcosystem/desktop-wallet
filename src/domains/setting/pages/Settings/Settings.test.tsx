/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { translations as pluginTranslations } from "domains/plugin/i18n";
import React from "react";
import { act, fireEvent, renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { Settings } from "./Settings";

let env: any;

describe("Settings", () => {
	beforeEach(() => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	});

	it("should render", () => {
		const { container, asFragment } = renderWithRouter(<Settings />, {
			routes: ["/", "/profiles/1/settings"],
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should store profile", async () => {
		let savedProfile: any = null;
		const onSubmit = jest.fn((profile: any) => (savedProfile = profile));

		const { asFragment, container, getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Settings onSubmit={onSubmit} />
			</EnvironmentProvider>,
			{
				routes: ["/", "/profiles/1/settings"],
			},
		);

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "test profile" } });
		// Select Language
		fireEvent.click(getAllByTestId("select-list__toggle-button")[0]);
		fireEvent.click(getByTestId("select-list__toggle-option-0"));
		// Select Passphrase Language
		fireEvent.click(getAllByTestId("select-list__toggle-button")[1]);
		fireEvent.click(getByTestId("select-list__toggle-option-0"));
		// Select Market Provider
		fireEvent.click(getAllByTestId("select-list__toggle-button")[2]);
		fireEvent.click(getByTestId("select-list__toggle-option-0"));
		// Select Currency
		fireEvent.click(getAllByTestId("select-list__toggle-button")[3]);
		fireEvent.click(getByTestId("select-list__toggle-option-0"));
		// Select Time Format
		fireEvent.click(getAllByTestId("select-list__toggle-button")[4]);
		fireEvent.click(getByTestId("select-list__toggle-option-0"));
		// Toggle Screenshot Protection
		fireEvent.click(getByTestId("General-settings__toggle--isScreenshotProtection"));
		// Toggle Advanced Mode
		fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
		// Toggle Update Ledger in Background
		fireEvent.click(getByTestId("General-settings__toggle--isUpdateLedger"));

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__submit-button"));
		});
		expect(onSubmit).toHaveBeenNthCalledWith(1, savedProfile);
		expect(savedProfile.name()).toEqual("test profile");
		expect(savedProfile.settings().all()).toEqual({
			LOCALE: "option1",
			BIP39_LOCALE: "option1",
			MARKET_PROVIDER: "option1",
			EXCHANGE_CURRENCY: "option1",
			TIME_FORMAT: "option1",
			SCREENSHOT_PROTECTION: true,
			ADVANCED_MODE: true,
			THEME: "light",
			LEDGER_UPDATE_METHOD: true,
		});

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "test profile 2" } });
		// Toggle Dark Theme
		fireEvent.click(getByTestId("General-settings__toggle--isDarkMode"));

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__submit-button"));
		});

		expect(onSubmit).toHaveBeenNthCalledWith(1, savedProfile);
		expect(savedProfile.name()).toEqual("test profile 2");
		expect(savedProfile.settings().all()).toEqual({
			LOCALE: "option1",
			BIP39_LOCALE: "option1",
			MARKET_PROVIDER: "option1",
			EXCHANGE_CURRENCY: "option1",
			TIME_FORMAT: "option1",
			SCREENSHOT_PROTECTION: true,
			ADVANCED_MODE: true,
			THEME: "dark",
			LEDGER_UPDATE_METHOD: true,
		});

		expect(env.profiles().all().length).toEqual(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render peer settings", async () => {
		const { container, asFragment, findByText } = renderWithRouter(<Settings />, {
			routes: ["/", "/profiles/1/settings"],
		});

		expect(container).toBeTruthy();
		fireEvent.click(await findByText("Peer"));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render plugin settings", async () => {
		const { container, asFragment, findByText } = renderWithRouter(<Settings />, {
			routes: ["/", "/profiles/1/settings"],
		});

		expect(container).toBeTruthy();
		fireEvent.click(await findByText("Plugins"));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close modals in the plugin settings", async () => {
		const { container, asFragment, getByTestId, findByText } = renderWithRouter(<Settings />, {
			routes: ["/", "/profiles/1/settings"],
		});

		expect(container).toBeTruthy();
		fireEvent.click(await findByText("Plugins"));
		expect(asFragment()).toMatchSnapshot();

		// Open `BlacklistPlugins` modal
		act(() => {
			fireEvent.click(getByTestId("plugins__open-list"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent(pluginTranslations.MODAL_BLACKLIST_PLUGINS.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		// Open `AddBlacklistPlugin` modal
		act(() => {
			fireEvent.click(getByTestId("plugins__add-plugin"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent(pluginTranslations.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});
});
