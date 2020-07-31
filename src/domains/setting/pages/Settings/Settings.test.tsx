/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { translations as pluginTranslations } from "domains/plugin/i18n";
import electron from "electron";
import os from "os";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, renderWithRouter } from "testing-library";
import { profiles } from "tests/fixtures/env/data";
import { StubStorage } from "tests/mocks";

import { translations } from "../../i18n";
import { Settings } from "./Settings";

jest.mock("electron", () => {
	const setContentProtection = jest.fn();

	return {
		remote: {
			dialog: {
				showOpenDialog: jest.fn(),
			},
			getCurrentWindow: () => ({
				setContentProtection,
			}),
		},
	};
});

jest.mock("fs", () => ({
	readFileSync: jest.fn(() => "avatarImage"),
}));

let env: Environment;
let profile: Profile;
let showOpenDialogMock: jest.SpyInstance;
const showOpenDialogParams = {
	defaultPath: os.homedir(),
	properties: ["openFile"],
	filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "bmp"] }],
};

describe("Settings", () => {
	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		await env.bootFromObject({ data: {}, profiles });

		profile = env.profiles().findById("bob");
	});

	it("should render", () => {
		const { container, asFragment } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/settings">
					<Settings onSubmit={jest.fn()} />
				</Route>
			</EnvironmentProvider>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update profile", async () => {
		let savedProfile: any = null;
		const onSubmit = jest.fn((profile: any) => (savedProfile = profile));

		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/settings">
					<Settings onSubmit={onSubmit} />
				</Route>
			</EnvironmentProvider>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		// Upload avatar image
		showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: ["filePath"],
		}));

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

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
			AVATAR: "data:image/png;base64,avatarImage",
			NAME: "test profile",
			LOCALE: "en-US",
			BIP39_LOCALE: "chinese_simplified",
			MARKET_PROVIDER: "coincap",
			EXCHANGE_CURRENCY: "btc",
			TIME_FORMAT: "h:mm A",
			SCREENSHOT_PROTECTION: true,
			ADVANCED_MODE: true,
			AUTOMATIC_LOGOFF_PERIOD: "1",
			THEME: "light",
			LEDGER_UPDATE_METHOD: true,
		});

		// Upload and remove avatar image
		await act(async () => {
			fireEvent.click(getByTestId("General-settings__remove-avatar"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

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
			AVATAR: "",
			NAME: "test profile 2",
			LOCALE: "en-US",
			BIP39_LOCALE: "chinese_simplified",
			MARKET_PROVIDER: "coincap",
			EXCHANGE_CURRENCY: "btc",
			TIME_FORMAT: "h:mm A",
			SCREENSHOT_PROTECTION: true,
			ADVANCED_MODE: false,
			AUTOMATIC_LOGOFF_PERIOD: "1",
			THEME: "dark",
			LEDGER_UPDATE_METHOD: true,
		});

		// Not upload avatar image
		showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: undefined,
		}));

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

		// Open & close Advanced Mode Modal
		fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.DISCLAIMER);
		fireEvent.click(getByTestId("modal__close-btn"));

		expect(env.profiles().count()).toEqual(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should submit using default props", async () => {
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/settings">
					<Settings onSubmit={jest.fn()} />
				</Route>
			</EnvironmentProvider>,
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
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/settings">
					<Settings onSubmit={jest.fn()} />
				</Route>
			</EnvironmentProvider>,
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
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/settings">
					<Settings onSubmit={jest.fn()} />
				</Route>
			</EnvironmentProvider>,
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
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/settings">
					<Settings onSubmit={jest.fn()} />
				</Route>
			</EnvironmentProvider>,
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
