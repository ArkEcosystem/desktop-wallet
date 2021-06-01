/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { buildTranslations } from "app/i18n/helpers";
import { toasts } from "app/services";
import electron from "electron";
import { createHashHistory } from "history";
import os from "os";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { Settings } from "./Settings";

const translations = buildTranslations();

jest.setTimeout(8000);

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useHistory: () => ({
		replace: jest.fn(),
		go: jest.fn(),
	}),
}));

let profile: Contracts.IProfile;
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
				<Settings />
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

	it("should not update profile if name consists only of whitespace", async () => {
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

		await act(async () => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "S3cUrePa$sword" },
			});
		});

		await act(async () => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), {
				target: { value: "S3cUrePa$sword" },
			});
		});

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
			fireEvent.input(getByTestId(currentPasswordInput), { target: { value: "S3cUrePa$sword" } });
		});
		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "S3cUrePa$sword2different" },
			});
		});
		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), {
				target: { value: "S3cUrePa$sword2different" },
			});
		});

		// wait for formState.isValid to be updated
		await findByTestId("Password-settings__submit-button");

		await act(async () => {
			fireEvent.click(getByTestId("Password-settings__submit-button"));
		});

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeInTheDocument());
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

		await act(async () => {
			fireEvent.input(getByTestId(currentPasswordInput), { target: { value: "wrong!" } });
		});

		await act(async () => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "AnotherS3cUrePa$swordNew" },
			});
		});

		await act(async () => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), {
				target: { value: "AnotherS3cUrePa$swordNew" },
			});
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
			fireEvent.input(getByTestId(currentPasswordInput), { target: { value: "S3cUrePa$sword" } });
		});

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "S3cUrePa$sword2different" },
			});
		});

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--password_1")).toHaveValue("S3cUrePa$sword2different"),
		);

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), {
				target: { value: "S3cUrePa$sword2different1" },
			});
		});

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--password_2")).toHaveValue("S3cUrePa$sword2different1"),
		);

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

	it("should not allow setting the current password as the new password", async () => {
		const { asFragment, findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<Settings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--Password"));
		});

		await waitFor(() => expect(getByTestId("Password-settings__input--currentPassword")).toBeTruthy());

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--currentPassword"), {
				target: { value: "S3cUrePa$sword" },
			});
		});

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--currentPassword")).toHaveValue("S3cUrePa$sword"),
		);

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "S3cUrePa$sword" },
			});
		});

		await waitFor(() => expect(getByTestId("Password-settings__input--password_1")).toHaveValue("S3cUrePa$sword"));

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--password_1")).toHaveAttribute("aria-invalid"),
		);

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
			await waitFor(() => expect(dialogMock).toHaveBeenCalled());
		});

		dialogMock.mockRestore();
	});
});
