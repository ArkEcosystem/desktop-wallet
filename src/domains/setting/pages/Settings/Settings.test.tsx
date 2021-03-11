/* eslint-disable @typescript-eslint/require-await */
import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { buildTranslations } from "app/i18n/helpers";
import { toasts } from "app/services";
import electron from "electron";
import os from "os";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor, within } from "testing-library";

import { Settings } from "./Settings";

const translations = buildTranslations();

jest.setTimeout(8000);

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useHistory: () => ({
		replace: jest.fn(),
	}),
}));

let profile: Profile;
let showOpenDialogMock: jest.SpyInstance;

const showOpenDialogParams = {
	defaultPath: os.homedir(),
	properties: ["openFile"],
	filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "bmp"] }],
};

jest.mock("fs", () => ({
	writeFileSync: jest.fn(),
	readFileSync: jest.fn(() => "avatarImage"),
}));

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

	it("should update the avatar when removing focus from name input", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(getByTestId("SelectProfileImage__avatar")).toBeTruthy();

		act(() => getByTestId("General-settings__input--name").focus());

		await act(async () => {
			fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "t" } });
		});

		act(() => getByTestId("General-settings__submit-button").focus());

		expect(getByTestId("SelectProfileImage__avatar")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();

		act(() => getByTestId("General-settings__input--name").focus());

		await act(async () => {
			fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "" } });
		});

		act(() => getByTestId("General-settings__submit-button").focus());

		act(() => getByTestId("General-settings__input--name").focus());

		await act(async () => {
			fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "" } });
		});

		act(() => getByTestId("General-settings__submit-button").focus());

		expect(() => getByTestId("SelectProfileImage__avatar")).toThrow(/^Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not update the uploaded avatar when removing focus from name input", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
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

		act(() => getByTestId("General-settings__input--name").focus());

		await act(async () => {
			fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "" } });
		});

		act(() => getByTestId("General-settings__submit-button").focus());

		expect(getByTestId("SelectProfileImage__avatar")).toBeTruthy();

		act(() => getByTestId("General-settings__input--name").focus());

		await act(async () => {
			fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "t" } });
		});

		act(() => getByTestId("General-settings__submit-button").focus());

		expect(getByTestId("SelectProfileImage__avatar")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update profile", async () => {
		const profilesCount = env.profiles().count();

		const { asFragment, getByTestId } = renderWithRouter(
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

		// Toggle Screenshot Protection
		fireEvent.click(getByTestId("General-settings__toggle--isScreenshotProtection"));

		// Toggle Test Development Network
		fireEvent.click(getByTestId("General-settings__toggle--useTestNetworks"));
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_DEVELOPMENT_NETWORK.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.SETTINGS.MODAL_DEVELOPMENT_NETWORK.DESCRIPTION,
		);
		fireEvent.click(getByTestId("DevelopmentNetwork__continue-button"));
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		// Toggle Test Development Network
		fireEvent.click(getByTestId("General-settings__toggle--useTestNetworks"));

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__submit-button"));
		});

		// Upload and remove avatar image
		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__remove-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "t" } });
		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeEnabled());
		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "" } });
		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeDisabled());
		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "test profile 2" } });
		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeEnabled());

		// Toggle Portfolio Transaction History
		fireEvent.click(getByTestId("General-settings__toggle--transactionHistory"));

		// Toggle Dark Theme
		fireEvent.click(getByTestId("General-settings__toggle--isDarkMode"));

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

		expect(env.profiles().count()).toEqual(profilesCount);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not update profile if profile name exists", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		const otherProfile = env
			.profiles()
			.values()
			.filter((el: Profile) => el.id() !== profile.id())[0];

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), {
				target: { value: otherProfile.settings().get(ProfileSetting.Name) },
			});
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeDisabled());

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "unique profile name" } });
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeEnabled());
	});

	it("should not update profile if profile name exists (uppercase)", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		const otherProfile = env
			.profiles()
			.values()
			.filter((el: Profile) => el.id() !== profile.id())[0];

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), {
				target: { value: otherProfile.settings().get(ProfileSetting.Name).toUpperCase() },
			});
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeDisabled());

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "unique profile name" } });
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeEnabled());
	});

	it("should not update profile if profile name is too long", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), {
				target: { value: "test profile".repeat(10) },
			});
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeDisabled());

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "unique profile name" } });
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeEnabled());
	});

	it("should not update profile if profile name exists (padded)", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		const otherProfile = env
			.profiles()
			.values()
			.filter((el: Profile) => el.id() !== profile.id())[0];

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), {
				target: { value: `  ${otherProfile.settings().get(ProfileSetting.Name)}  ` },
			});
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeDisabled());

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "unique profile name" } });
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeEnabled());
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "DevelopmentNetwork__cancel-button"],
		["continue", "DevelopmentNetwork__continue-button"],
	])("should open & close development network modal (%s)", async (_, buttonId) => {
		const { container, getByTestId } = renderWithRouter(
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
			fireEvent.click(getByTestId("General-settings__toggle--useTestNetworks"));
		});

		expect(getByTestId("modal__inner")).toBeInTheDocument();
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_DEVELOPMENT_NETWORK.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.SETTINGS.MODAL_DEVELOPMENT_NETWORK.DESCRIPTION,
		);

		await act(async () => {
			fireEvent.click(getByTestId(buttonId));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
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
			fireEvent.click(getByText(translations.COMMON.RESET_SETTINGS));
		});

		expect(getByTestId("modal__inner")).toBeInTheDocument();
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PROFILE.MODAL_RESET_PROFILE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PROFILE.MODAL_RESET_PROFILE.DESCRIPTION);

		await act(async () => {
			fireEvent.click(getByTestId(buttonId));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should reset fields on reset", async () => {
		const { container, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		fireEvent.click(getByTestId("General-settings__toggle--isDarkMode"));

		await waitFor(() => expect(getByTestId("General-settings__toggle--isDarkMode")).toBeChecked());

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__submit-button"));
		});

		act(() => {
			fireEvent.click(getByText(translations.COMMON.RESET_SETTINGS));
		});

		expect(getByTestId("modal__inner")).toBeInTheDocument();
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PROFILE.MODAL_RESET_PROFILE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PROFILE.MODAL_RESET_PROFILE.DESCRIPTION);

		await act(async () => {
			fireEvent.click(getByTestId("ResetProfile__submit-button"));
		});

		await waitFor(() => expect(getByTestId("General-settings__toggle--isDarkMode")).not.toBeChecked());
	});

	describe("advanced mode", () => {
		it("should open and accept disclaimer", () => {
			const { getByTestId } = renderWithRouter(
				<Route path="/profiles/:profileId/settings">
					<Settings />
				</Route>,
				{
					routes: [`/profiles/${profile.id()}/settings`],
				},
			);

			act(() => {
				fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
			});

			expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_ADVANCED_MODE.TITLE);
			expect(getByTestId("modal__inner")).toHaveTextContent(
				translations.SETTINGS.MODAL_ADVANCED_MODE.DISCLAIMER.replace(/\n\n/g, " "),
			);

			act(() => {
				fireEvent.click(getByTestId("AdvancedMode__accept-button"));
			});

			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			expect(getByTestId("General-settings__toggle--isAdvancedMode").checked).toEqual(true);

			act(() => {
				fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
			});

			expect(getByTestId("General-settings__toggle--isAdvancedMode").checked).toEqual(false);
		});

		it("should open, accept disclaimer and remember choice", () => {
			const { getByTestId } = renderWithRouter(
				<Route path="/profiles/:profileId/settings">
					<Settings />
				</Route>,
				{
					routes: [`/profiles/${profile.id()}/settings`],
				},
			);

			act(() => {
				fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
			});

			expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_ADVANCED_MODE.TITLE);
			expect(getByTestId("modal__inner")).toHaveTextContent(
				translations.SETTINGS.MODAL_ADVANCED_MODE.DISCLAIMER.replace(/\n\n/g, " "),
			);

			act(() => {
				fireEvent.click(getByTestId("AdvancedMode__rememberChoice-toggle"));
			});

			act(() => {
				fireEvent.click(getByTestId("AdvancedMode__accept-button"));
			});

			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			expect(getByTestId("General-settings__toggle--isAdvancedMode").checked).toEqual(true);

			// uncheck toggle
			act(() => {
				fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
			});

			expect(getByTestId("General-settings__toggle--isAdvancedMode").checked).toEqual(false);

			// check toggle again
			act(() => {
				fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
			});

			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			expect(getByTestId("General-settings__toggle--isAdvancedMode").checked).toEqual(true);

			// reset setting
			profile.settings().set(ProfileSetting.DoNotShowAdvancedModeDisclaimer, false);
		});

		it.each([
			["close", "modal__close-btn"],
			["decline", "AdvancedMode__decline-button"],
		])("should open and %s disclaimer", (_, buttonId) => {
			const { getByTestId } = renderWithRouter(
				<Route path="/profiles/:profileId/settings">
					<Settings />
				</Route>,
				{
					routes: [`/profiles/${profile.id()}/settings`],
				},
			);

			act(() => {
				fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
			});

			expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_ADVANCED_MODE.TITLE);
			expect(getByTestId("modal__inner")).toHaveTextContent(
				translations.SETTINGS.MODAL_ADVANCED_MODE.DISCLAIMER.replace(/\n\n/g, " "),
			);

			act(() => {
				fireEvent.click(getByTestId(buttonId));
			});

			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			expect(getByTestId("General-settings__toggle--isAdvancedMode").checked).toEqual(false);
		});
	});

	it("should render peer settings", async () => {
		// Import a wallet after the profile reset test
		await profile.wallets().importByAddress("D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax", "ARK", "ark.devnet");

		const { container, asFragment, findByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		fireEvent.click(await findByTestId("side-menu__item--Peer"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should submit peer settings form", async () => {
		const toastSpy = jest.spyOn(toasts, "success");

		const { findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		fireEvent.click(await findByTestId("side-menu__item--Peer"));

		expect(getByTestId("Peer-settings__submit-button")).toBeTruthy();

		fireEvent.click(getByTestId("General-peers__toggle--isCustomPeer"));
		fireEvent.click(getByTestId("General-peers__toggle--isMultiPeerBroadcast"));

		expect(getByTestId("Peer-list__add-button")).toBeTruthy();

		await act(async () => {
			fireEvent.click(getByTestId("Peer-settings__submit-button"));
		});

		expect(toastSpy).toHaveBeenCalledWith(translations.SETTINGS.PEERS.SUCCESS);
	});

	it("should show an error message for invalid peer (host)", async () => {
		const { findByTestId, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		fireEvent.click(await findByTestId("side-menu__item--Peer"));

		expect(getByTestId("Peer-list__add-button")).toBeTruthy();

		const addPeerButton = getByTestId("Peer-list__add-button");
		expect(addPeerButton).toBeTruthy();
		await act(async () => {
			fireEvent.click(addPeerButton);
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__name-input"), { target: { value: "ROBank" } });
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "167.114.29.48:4003/api" },
			});
		});

		await waitFor(() => {
			expect(getByTestId("Input-error")).toBeVisible();
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "//167.114.29.48:4003/api" },
			});
		});

		await waitFor(() => {
			expect(getByTestId("Input-error")).toBeVisible();
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "http://167.114.29.48:4003/api" },
			});
		});

		const submitButton = getByTestId("PeerForm__submit-button");
		expect(submitButton).toBeTruthy();
		await waitFor(() => {
			expect(submitButton).not.toHaveAttribute("disabled");
		});

		fireEvent.click(submitButton);

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));
	});

	it("should add & delete custom peer", async () => {
		const { findByTestId, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		fireEvent.click(await findByTestId("side-menu__item--Peer"));

		expect(getByTestId("Peer-list__add-button")).toBeTruthy();

		const addPeerButton = getByTestId("Peer-list__add-button");
		expect(addPeerButton).toBeTruthy();
		await act(async () => {
			fireEvent.click(addPeerButton);
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() =>
			expect(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__name-input"), { target: { value: "ROBank" } });
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "http://167.114.29.48:4003/api" },
			});
		});

		await waitFor(() => {
			expect(getByTestId("Input-error")).toBeVisible();
		});

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() =>
			expect(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(""));

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() =>
			expect(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "http://89.45.251.233:4003/api" },
			});
		});

		const submitButton = getByTestId("PeerForm__submit-button");
		expect(submitButton).toBeTruthy();
		await waitFor(() => {
			expect(submitButton).not.toHaveAttribute("disabled");
		});

		fireEvent.click(submitButton);

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));

		const toggle = within(getByTestId("Peer-settings__table")).getAllByTestId("dropdown__toggle")[0];

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const deleteOption = getByTestId("dropdown__option--1");
		expect(deleteOption).toBeTruthy();

		act(() => {
			fireEvent.click(deleteOption);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_DELETE_PEER.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_DELETE_PEER.DESCRIPTION);

		const deleteButton = getByTestId("DeleteResource__submit-button");

		act(() => {
			fireEvent.click(deleteButton);
		});

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));
	});

	it("should enable broadcast to multiple peers", async () => {
		const toastSpy = jest.spyOn(toasts, "success");

		const { findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		fireEvent.click(await findByTestId("side-menu__item--Peer"));

		expect(getByTestId("Peer-list__add-button")).toBeTruthy();

		const addPeerButton = getByTestId("Peer-list__add-button");
		expect(addPeerButton).toBeTruthy();
		await act(async () => {
			fireEvent.click(addPeerButton);
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() =>
			expect(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__name-input"), { target: { value: "ROBank" } });
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "http://167.114.29.48:4003/api" },
			});
		});

		expect(getByTestId("PeerForm__submit-button")).toBeTruthy();
		await waitFor(() => {
			expect(getByTestId("PeerForm__submit-button")).not.toHaveAttribute("disabled");
		});

		fireEvent.click(getByTestId("PeerForm__submit-button"));

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));

		fireEvent.click(getByTestId("General-peers__toggle--isMultiPeerBroadcast"));

		await act(async () => {
			fireEvent.click(getByTestId("Peer-settings__submit-button"));
		});

		expect(toastSpy).toHaveBeenCalledWith(translations.SETTINGS.PEERS.SUCCESS);
	});

	it("should disable broadcast to multiple peers", async () => {
		const toastSpy = jest.spyOn(toasts, "success");

		const { findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		fireEvent.click(await findByTestId("side-menu__item--Peer"));

		expect(getByTestId("Peer-list__add-button")).toBeTruthy();

		const toggle = within(getByTestId("Peer-settings__table")).getAllByTestId("dropdown__toggle")[0];

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const deleteOption = getByTestId("dropdown__option--1");
		expect(deleteOption).toBeTruthy();

		act(() => {
			fireEvent.click(deleteOption);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_DELETE_PEER.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_DELETE_PEER.DESCRIPTION);

		const deleteButton = getByTestId("DeleteResource__submit-button");

		act(() => {
			fireEvent.click(deleteButton);
		});

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));

		fireEvent.click(getByTestId("General-peers__toggle--isCustomPeer"));

		await act(async () => {
			fireEvent.click(getByTestId("Peer-settings__submit-button"));
		});

		expect(toastSpy).toHaveBeenCalledWith(translations.SETTINGS.PEERS.SUCCESS);
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

	it("should submit plugin settings form", async () => {
		const toastSpy = jest.spyOn(toasts, "success");

		const { findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		fireEvent.click(await findByTestId("side-menu__item--Plugins"));

		await act(async () => {
			fireEvent.click(getByTestId("Plugins-settings__submit-button"));
		});

		expect(toastSpy).toHaveBeenCalledWith(translations.SETTINGS.PLUGINS.SUCCESS);
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

	it("should show an error toast if the current password does not match", async () => {
		const toastSpy = jest.spyOn(toasts, "error");

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

		expect(toastSpy).toHaveBeenCalledWith(
			`${translations.COMMON.ERROR}: ${translations.SETTINGS.PASSWORD.ERROR.MISMATCH}`,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger password confirmation mismatch error", async () => {
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

		await waitFor(() => expect(getByTestId("Password-settings__input--password_1")).toHaveValue("new password"));

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), {
				target: { value: "new password 1" },
			});
		});

		await waitFor(() => expect(getByTestId("Password-settings__input--password_2")).toHaveValue("new password 1"));

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "new password 2" },
			});
		});

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--password_2")).toHaveAttribute("aria-invalid"),
		);
		// wait for formState.isValid to be updated
		await waitFor(() => expect(getByTestId("Password-settings__submit-button")).toBeDisabled());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render export settings", async () => {
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
			fireEvent.click(await findByTestId("side-menu__item--Export"));
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should export data", async () => {
		const exportingProfile = env.profiles().create("Exporting Profile");

		const dialogMock = jest
			.spyOn(electron.remote.dialog, "showSaveDialog")
			//@ts-ignore
			.mockResolvedValue({ filePath: ["/test.dwe"] });

		const { container, findByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				withProfileSynchronizer: true,
				routes: [`/profiles/${exportingProfile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--Export"));
		});

		await act(async () => {
			fireEvent.click(await findByTestId("Export-settings__submit-button"));
		});

		expect(dialogMock).toHaveBeenCalled();
		dialogMock.mockRestore();
	});
});
