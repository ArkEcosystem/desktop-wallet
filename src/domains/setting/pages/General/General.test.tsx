/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { buildTranslations } from "app/i18n/helpers";
import { GeneralSettings } from "domains/setting/pages";
import electron from "electron";
import { createHashHistory } from "history";
import os from "os";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

const translations = buildTranslations();

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useHistory: () => ({
		go: jest.fn(),
		replace: jest.fn(),
	}),
}));

let profile: Contracts.IProfile;
let showOpenDialogMock: jest.SpyInstance;

const showOpenDialogParameters = {
	defaultPath: os.homedir(),
	filters: [{ extensions: ["png", "jpg", "jpeg", "bmp"], name: "" }],
	properties: ["openFile"],
};

jest.mock("fs", () => ({
	readFileSync: jest.fn(() => "avatarImage"),
	writeFileSync: jest.fn(),
}));

describe("General Settings", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await env.profiles().restore(profile);
		await profile.sync();
	});

	it("should render with prompt paths", async () => {
		const history = createHashHistory();

		history.push(`/profiles/${profile.id()}/settings`);

		renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<GeneralSettings />
			</Route>,
			{
				// @ts-ignore
				history,
			},
		);

		// Idle
		history.push(`/profiles/${profile.id()}/dashboard`);

		fireEvent.input(screen.getByTestId("General-settings__input--name"), { target: { value: "My Profile" } });

		await waitFor(() => expect(screen.getByTestId("General-settings__submit-button")).toBeEnabled());

		// Dirty
		history.replace(`/profiles/${profile.id()}/dashboard`);

		// Reload
		history.replace(`/profiles/${profile.id()}/settings`);

		await waitFor(() => expect(screen.getByTestId("General-settings__cancel-button")).toBeEnabled());

		fireEvent.click(screen.getByTestId("General-settings__cancel-button"));
	});

	it("should render", () => {
		const { container, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<GeneralSettings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should disable submit button when profile is not restored yet", async () => {
		const isProfileRestoredMock = jest.spyOn(profile.status(), "isRestored").mockReturnValue(false);

		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<GeneralSettings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(screen.getByTestId("General-settings__submit-button")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();

		isProfileRestoredMock.mockRestore();
	});

	it("should update the avatar when removing focus from name input", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<GeneralSettings />
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
				<GeneralSettings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		// Upload avatar image
		showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: ["banner.png"],
		}));

		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParameters);

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
				<GeneralSettings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		// Upload avatar image
		showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: ["banner.png"],
		}));

		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParameters);

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "test profile" } });

		// Toggle Screenshot Protection
		fireEvent.click(getByTestId("General-settings__toggle--screenshotProtection"));

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

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParameters);

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "t" } });
		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeEnabled());
		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "" } });
		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeDisabled());
		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "test profile 2" } });
		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeEnabled());

		// Toggle Portfolio Transaction History
		fireEvent.click(getByTestId("General-settings__toggle--dashboardTransactionHistory"));

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

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParameters);

		expect(env.profiles().count()).toEqual(profilesCount);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not update profile if name consists only of whitespace", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<GeneralSettings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		fireEvent.input(getByTestId("General-settings__input--name"), {
			target: { value: "     " },
		});

		await waitFor(() => {
			expect(getByTestId("Input__error")).toBeVisible();
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeDisabled());
	});

	it("should not update profile if profile name exists", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<GeneralSettings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		const otherProfile = env
			.profiles()
			.values()
			.find((element: Profile) => element.id() !== profile.id());

		fireEvent.input(getByTestId("General-settings__input--name"), {
			target: { value: otherProfile.settings().get(Contracts.ProfileSetting.Name) },
		});

		await waitFor(() => {
			expect(getByTestId("Input__error")).toBeVisible();
		});

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeDisabled());

		fireEvent.input(getByTestId("General-settings__input--name"), { target: { value: "unique profile name" } });

		await waitFor(() => expect(getByTestId("General-settings__submit-button")).toBeEnabled());
	});

	it("should not update profile if profile name exists (uppercase)", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<GeneralSettings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		const otherProfile = env
			.profiles()
			.values()
			.find((element: Profile) => element.id() !== profile.id());

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), {
				target: { value: otherProfile.settings().get(Contracts.ProfileSetting.Name).toUpperCase() },
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
				<GeneralSettings />
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
				<GeneralSettings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		const otherProfile = env
			.profiles()
			.values()
			.find((element: Profile) => element.id() !== profile.id());

		act(() => {
			fireEvent.input(getByTestId("General-settings__input--name"), {
				target: { value: `  ${otherProfile.settings().get(Contracts.ProfileSetting.Name)}  ` },
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
				<GeneralSettings />
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
				<GeneralSettings />
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
				<GeneralSettings />
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
});
