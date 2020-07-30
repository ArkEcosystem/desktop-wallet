/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { translations as pluginTranslations } from "domains/plugin/i18n";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, useDefaultNetMocks } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { translations } from "../../i18n";
import { Settings } from "./Settings";

let profile: Profile;

describe("Settings", () => {
	beforeAll(useDefaultNetMocks);

	beforeEach(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();

		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", () => {
		const { container, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings onSubmit={jest.fn()} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update profile", async () => {
		let savedProfile: any = null;
		const profilesCount = env.profiles().all().length;

		const onSubmit = jest.fn((profile: any) => (savedProfile = profile));

		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings onSubmit={onSubmit} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
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
		// Select Auto-logoff
		fireEvent.click(getAllByTestId("select-list__toggle-button")[5]);
		fireEvent.click(getByTestId("select-list__toggle-option-0"));
		// Toggle Screenshot Protection
		fireEvent.click(getByTestId("General-settings__toggle--isScreenshotProtection"));
		// Toggle Advanced Mode
		fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
		// Open Advanced Mode Modal
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.DISCLAIMER);
		fireEvent.click(getByTestId("AdvancedMode__accept-button"));
		// Toggle Update Ledger in Background
		fireEvent.click(getByTestId("General-settings__toggle--isUpdateLedger"));

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__submit-button"));
		});
		expect(onSubmit).toHaveBeenNthCalledWith(1, savedProfile);
		expect(savedProfile.name()).toEqual("test profile");
		expect(savedProfile.settings().all()).toEqual({
			NAME: "test profile",
			LOCALE: "en-US",
			BIP39_LOCALE: "chinese_simplified",
			MARKET_PROVIDER: "coincap",
			EXCHANGE_CURRENCY: "btc",
			TIME_FORMAT: "h:mm A",
			SCREENSHOT_PROTECTION: false,
			ADVANCED_MODE: true,
			AUTOMATIC_LOGOFF_PERIOD: "1",
			THEME: "light",
			LEDGER_UPDATE_METHOD: true,
		});

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "test profile 2" } });
		// Toggle Dark Theme
		fireEvent.click(getByTestId("General-settings__toggle--isDarkMode"));
		// Toggle Advanced Mode
		fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
		fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
		// Open Advanced Mode Modal
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.DISCLAIMER);
		fireEvent.click(getByTestId("AdvancedMode__decline-button"));

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__submit-button"));
		});

		expect(onSubmit).toHaveBeenNthCalledWith(1, savedProfile);
		expect(savedProfile.name()).toEqual("test profile 2");
		expect(savedProfile.settings().all()).toEqual({
			NAME: "test profile 2",
			LOCALE: "en-US",
			BIP39_LOCALE: "chinese_simplified",
			MARKET_PROVIDER: "coincap",
			EXCHANGE_CURRENCY: "btc",
			TIME_FORMAT: "h:mm A",
			SCREENSHOT_PROTECTION: false,
			ADVANCED_MODE: false,
			AUTOMATIC_LOGOFF_PERIOD: "1",
			THEME: "dark",
			LEDGER_UPDATE_METHOD: true,
		});

		// Open & close Advanced Mode Modal
		fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.DISCLAIMER);
		fireEvent.click(getByTestId("modal__close-btn"));

		expect(env.profiles().all().length).toEqual(profilesCount);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should submit using default props", async () => {
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings onSubmit={jest.fn()} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
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

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render peer settings", async () => {
		const { container, asFragment, findByText } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings onSubmit={jest.fn()} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();
		fireEvent.click(await findByText("Peer"));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render plugin settings", async () => {
		const { container, asFragment, findByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings onSubmit={jest.fn()} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();
		fireEvent.click(await findByTestId("side-menu__item--Plugins"));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close modals in the plugin settings", async () => {
		const { container, asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings onSubmit={jest.fn()} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("side-menu__item--Plugins"));
		});
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
