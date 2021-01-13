/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { buildTranslations } from "app/i18n/helpers";
import { toasts } from "app/services";
import electron from "electron";
import fs from "fs";
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

describe("Settings", () => {
	beforeEach(() => {
		jest.spyOn(fs, "readFileSync").mockImplementation();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

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
		// Toggle Advanced Mode
		fireEvent.click(getByTestId("General-settings__toggle--isAdvancedMode"));
		// Open Advanced Mode Modal
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_ADVANCED_MODE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_ADVANCED_MODE.DISCLAIMER);
		fireEvent.click(getByTestId("AdvancedMode__accept-button"));
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
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
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_ADVANCED_MODE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_ADVANCED_MODE.DISCLAIMER);
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
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_ADVANCED_MODE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.SETTINGS.MODAL_ADVANCED_MODE.DISCLAIMER);
		fireEvent.click(getByTestId("modal__close-btn"));

		expect(env.profiles().count()).toEqual(profilesCount);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not update profile if profile name exists", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "J" } });

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__submit-button"));
		});

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "" } });

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__submit-button"));
		});

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "Jane Doe" } });

		await act(async () => {
			fireEvent.click(getByTestId("General-settings__submit-button"));
		});

		expect(asFragment()).toMatchSnapshot();
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
			fireEvent.click(getByText(translations.COMMON.RESET_DATA));
		});

		expect(getByTestId("modal__inner")).toBeInTheDocument();
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PROFILE.MODAL_RESET_PROFILE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PROFILE.MODAL_RESET_PROFILE.DESCRIPTION);

		await act(async () => {
			fireEvent.click(getByTestId(buttonId));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
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

		await waitFor(() => expect(getByText("The 'Peer IP' is not valid")).toBeVisible());

		act(() => {
			fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "//167.114.29.48:4003/api" },
			});
		});

		await waitFor(() => expect(getByText("The 'Peer IP' does not have 'http://' or 'https://'")).toBeVisible());

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
			fireEvent.mouseDown(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__name-input"), { target: { value: "ROBank" } });
		});

		act(() => {
			fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "http://167.114.29.48:4003/api" },
			});
		});

		await waitFor(() => expect(getByText(translations.SETTINGS.PEERS.VALIDATION.HOST_EXISTS)).toBeVisible());

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() =>
			expect(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy(),
		);

		act(() => {
			fireEvent.mouseDown(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(""));

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() =>
			expect(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy(),
		);

		act(() => {
			fireEvent.mouseDown(within(getByTestId("modal__inner")).getByTestId("NetworkIcon-ARK-ark.devnet"));
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
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PLUGINS.MODAL_BLACKLIST_PLUGINS.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		// Open `AddBlacklistPlugin` modal
		act(() => {
			fireEvent.click(getByTestId("plugins__add-plugin"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PLUGINS.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should add a plugin to the blacklist", async () => {
		const { container, getByTestId, getAllByTestId, getAllByText } = renderWithRouter(
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

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PLUGINS.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);

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
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.PLUGINS.MODAL_BLACKLIST_PLUGINS.TITLE);

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
});
