/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider, ThemeProvider } from "app/contexts";
import { httpClient } from "app/services";
import { translations as profileTranslations } from "domains/profile/i18n";
import electron from "electron";
import os from "os";
import React from "react";
import { act, fireEvent, renderWithRouter, waitFor } from "testing-library";
import { StubStorage } from "tests/mocks";

import { CreateProfile } from "./CreateProfile";

jest.mock("fs", () => ({
	readFileSync: jest.fn(() => "avatarImage"),
}));

let env: Environment;
let showOpenDialogMock: jest.SpyInstance;

const showOpenDialogParams = {
	defaultPath: os.homedir(),
	properties: ["openFile"],
	filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "bmp"] }],
};

const baseSettings = {
	ADVANCED_MODE: false,
	AUTOMATIC_SIGN_OUT_PERIOD: 15,
	BIP39_LOCALE: "english",
	EXCHANGE_CURRENCY: "BTC",
	LEDGER_UPDATE_METHOD: false,
	LOCALE: "en-US",
	MARKET_PROVIDER: "cryptocompare",
	NAME: "test profile",
	SCREENSHOT_PROTECTION: true,
	THEME: "light",
	TIME_FORMAT: "h:mm A",
	USE_CUSTOM_PEER: false,
	USE_MULTI_PEER_BROADCAST: false,
	USE_TEST_NETWORKS: false,
};

const renderComponent = async () => {
	const result = renderWithRouter(
		<EnvironmentProvider env={env}>
			<ThemeProvider>
				<CreateProfile />
			</ThemeProvider>
		</EnvironmentProvider>,
	);
	await waitFor(() => expect(result.getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));
	return result;
};

describe("CreateProfile", () => {
	beforeAll(() => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	});

	beforeEach(() => {
		showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: ["filePath"],
		}));
	});

	it("should render", async () => {
		const { container, getByText, asFragment } = await renderComponent();

		expect(container).toBeTruthy();
		fireEvent.click(getByText("Back"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should store profile", async () => {
		const { asFragment, container, getAllByTestId, getByTestId } = await renderComponent();

		// Upload avatar image
		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile 1" } });

		const selectDropdown = getByTestId("SelectDropdownInput__input");

		await act(async () => {
			fireEvent.change(selectDropdown, { target: { value: "BTC" } });
		});

		fireEvent.click(getByTestId("select-list__toggle-option-0"));

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));
		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		let profiles = env.profiles().values();

		expect(profiles.length).toEqual(1);
		expect(profiles[0].name()).toEqual("test profile 1");
		expect(profiles[0].settings().all()).toEqual({
			...baseSettings,
			AVATAR: "data:image/png;base64,avatarImage",
			NAME: "test profile 1",
		});
		expect(profiles[0].usesPassword()).toBe(false);

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile 2" } });
		fireEvent.click(container.querySelector("input[name=isDarkMode]"));

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		profiles = env.profiles().values();
		expect(profiles.length).toEqual(2);
		expect(profiles[1].name()).toEqual("test profile 2");
		expect(profiles[1].settings().all()).toEqual({
			...baseSettings,
			AVATAR: "data:image/png;base64,avatarImage",
			NAME: "test profile 2",
			THEME: "dark",
		});
		expect(profiles[1].usesPassword()).toBe(false);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not be able to create new profile if name already exists", async () => {
		const name = "test profile";
		const profile = env.profiles().create(name);

		const { asFragment, getAllByTestId, getByTestId, getByText } = await renderComponent();

		const selectDropdown = getByTestId("SelectDropdownInput__input");
		fireEvent.change(selectDropdown, { target: { value: "BTC" } });
		fireEvent.click(getByTestId("select-list__toggle-option-0"));

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "t" } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).not.toHaveAttribute("disabled"));

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: name } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));

		expect(getByText(profileTranslations.PAGE_CREATE_PROFILE.VALIDATION.NAME_EXISTS)).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();

		env.profiles().forget(profile.id());
	});

	it("should not be able to create new profile if name is too long", async () => {
		const { asFragment, getAllByTestId, getByTestId, getByText } = await renderComponent();

		const selectDropdown = getByTestId("SelectDropdownInput__input");
		fireEvent.change(selectDropdown, { target: { value: "BTC" } });
		fireEvent.click(getByTestId("select-list__toggle-option-0"));

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "t" } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).not.toHaveAttribute("disabled"));

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile".repeat(10) } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));

		expect(getByText("'Name' should have at most 42 characters")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should store profile with password", async () => {
		const { asFragment, getAllByTestId, getByTestId } = await renderComponent();

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile 3" } });
		fireEvent.input(getAllByTestId("Input")[1], { target: { value: "test password" } });
		fireEvent.input(getAllByTestId("Input")[2], { target: { value: "test password" } });

		const selectDropdown = getByTestId("SelectDropdownInput__input");

		await act(async () => {
			fireEvent.change(selectDropdown, { target: { value: "BTC" } });
		});

		fireEvent.click(getByTestId("select-list__toggle-option-0"));

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).not.toHaveAttribute("disabled"));
		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		expect(env.profiles().last().usesPassword()).toBe(true);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail password confirmation", async () => {
		const { asFragment, getAllByTestId, getByTestId } = await renderComponent();

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "asdasdas" } });

		const selectDropdown = getByTestId("SelectDropdownInput__input");
		fireEvent.change(selectDropdown, { target: { value: "BTC" } });
		fireEvent.click(getByTestId("select-list__toggle-option-0"));

		fireEvent.change(getAllByTestId("Input")[1], { target: { value: "test password" } });
		fireEvent.change(getAllByTestId("Input")[2], { target: { value: "wrong" } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));

		fireEvent.input(getAllByTestId("Input")[1], { target: { value: "password" } });
		fireEvent.input(getAllByTestId("Input")[2], { target: { value: "password" } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).not.toHaveAttribute("disabled"));

		fireEvent.input(getAllByTestId("Input")[2], { target: { value: "test password" } });
		fireEvent.input(getAllByTestId("Input")[1], { target: { value: "wrong" } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should upload and remove avatar image", async () => {
		const { asFragment, getAllByTestId, getByTestId } = await renderComponent();

		// Upload avatar image
		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__remove-button"));
		});

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile 4" } });

		const selectDropdown = getByTestId("SelectDropdownInput__input");

		await act(async () => {
			fireEvent.change(selectDropdown, { target: { value: "BTC" } });
		});

		fireEvent.click(getByTestId("select-list__toggle-option-0"));

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).not.toHaveAttribute("disabled"));

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not upload avatar image", async () => {
		const { asFragment, getAllByTestId, getByTestId } = await renderComponent();

		// Not upload avatar image
		showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: undefined,
		}));

		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile 5" } });

		const selectDropdown = getByTestId("SelectDropdownInput__input");

		await act(async () => {
			fireEvent.change(selectDropdown, { target: { value: "BTC" } });
		});

		fireEvent.click(getByTestId("select-list__toggle-option-0"));

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
