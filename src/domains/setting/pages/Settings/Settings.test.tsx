/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { translations as pluginTranslations } from "domains/plugin/i18n";
import { translations as profileTranslations } from "domains/profile/i18n";
import electron from "electron";
import os from "os";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { Settings } from "./Settings";

jest.setTimeout(8000);

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

let profile: Profile;
let showOpenDialogMock: jest.SpyInstance;
const showOpenDialogParams = {
	defaultPath: os.homedir(),
	properties: ["openFile"],
	filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "bmp"] }],
};

describe("Settings", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", () => {
		const { container, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update profile", async () => {
		const profilesCount = env.profiles().count();

		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		// Upload avatar image
		showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: ["filePath"],
		}));

		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
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
		// Select Automatic Sign Out Period
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

		// Upload and remove avatar image
		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__remove-button"));
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

		// Not upload avatar image
		showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: undefined,
		}));

		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

		// Open & close Advanced Mode Modal
		fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.DISCLAIMER);
		fireEvent.click(getByTestId("modal__close-btn"));

		expect(env.profiles().count()).toEqual(profilesCount);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should submit using default props", async () => {
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
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

	it.each([
		["close", "modal__close-btn"],
		["cancel", "ResetProfile__cancel-button"],
		["reset", "ResetProfile__submit-button"],
	])("should open & close reset profile modal (%s)", async (_, buttonId) => {
		const { container, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByText(commonTranslations.RESET_DATA));
		});

		expect(getByTestId("modal__inner")).toBeInTheDocument();
		expect(getByTestId("modal__inner")).toHaveTextContent(profileTranslations.MODAL_RESET_PROFILE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(profileTranslations.MODAL_RESET_PROFILE.DESCRIPTION);

		await act(async () => {
			fireEvent.click(getByTestId(buttonId));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should render peer settings", async () => {
		const { container, asFragment, findByText } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
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
				<Settings />
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
				<Settings />
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

	it("should add a plugin to the blacklist", async () => {
		const { container, asFragment, getByTestId, getAllByTestId, getAllByText } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("side-menu__item--Plugins"));
		});

		// Open `AddBlacklistPlugin` modal
		await waitFor(() => expect(getByTestId("plugins__add-plugin")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("plugins__add-plugin"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(pluginTranslations.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);

		await waitFor(() => expect(getAllByTestId("TableRow")).toHaveLength(7));

		const addButton = getAllByText("Add")[0];
		await waitFor(() => expect(addButton).toBeTruthy());

		act(() => {
			fireEvent.click(addButton);
		});

		await waitFor(() => expect(getByTestId("modal__close-btn")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		// Open `BlacklistPlugins` modal
		act(() => {
			fireEvent.click(getByTestId("plugins__open-list"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent(pluginTranslations.MODAL_BLACKLIST_PLUGINS.TITLE);

		await waitFor(() => expect(getAllByTestId("TableRow")).toHaveLength(1));

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));
	});

	it("should render password settings", async () => {
		const { container, asFragment, findByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--Password"));
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should set a password", async () => {
		const { container, asFragment, findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--Password"));
		});

		const currentPasswordInput = "Password-settings__input--currentPassword";

		expect(() => getByTestId(currentPasswordInput)).toThrow(/Unable to find an element by/);

		fireEvent.input(getByTestId("Password-settings__input--password_1"), { target: { value: "password" } });
		fireEvent.input(getByTestId("Password-settings__input--password_2"), { target: { value: "password" } });

		// wait for formState.isValid to be updated
		await findByTestId("Password-settings__submit-button");

		await act(async () => {
			fireEvent.click(getByTestId("Password-settings__submit-button"));
		});

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should change a password", async () => {
		const { container, asFragment, findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--Password"));
		});

		const currentPasswordInput = "Password-settings__input--currentPassword";

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeTruthy());

		act(() => {
			fireEvent.input(getByTestId(currentPasswordInput), { target: { value: "password" } });
		});
		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), { target: { value: "new password" } });
		});
		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), { target: { value: "new password" } });
		});

		// wait for formState.isValid to be updated
		await findByTestId("Password-settings__submit-button");

		await act(async () => {
			fireEvent.click(getByTestId("Password-settings__submit-button"));
		});

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show an error alert if the current password does not match", async () => {
		const { container, asFragment, findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--Password"));
		});

		const currentPasswordInput = "Password-settings__input--currentPassword";

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeTruthy());

		fireEvent.input(getByTestId(currentPasswordInput), { target: { value: "wrong!" } });
		fireEvent.input(getByTestId("Password-settings__input--password_1"), {
			target: { value: "another new password" },
		});
		fireEvent.input(getByTestId("Password-settings__input--password_2"), {
			target: { value: "another new password" },
		});

		// wait for formState.isValid to be updated
		await findByTestId("Password-settings__submit-button");

		await act(async () => {
			fireEvent.click(getByTestId("Password-settings__submit-button"));
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
