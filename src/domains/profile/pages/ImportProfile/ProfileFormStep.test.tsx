/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { ImportProfileForm } from "domains/profile/pages/ImportProfile/ProfileFormStep";
import electron from "electron";
import { createMemoryHistory } from "history";
import os from "os";
import React from "react";
import * as utils from "utils/electron-utils";
import { act, env, fireEvent, renderWithRouter, waitFor } from "utils/testing-library";
let profile: Contracts.IProfile;

let showOpenDialogMock: jest.SpyInstance;
const showOpenDialogParams = {
	defaultPath: os.homedir(),
	properties: ["openFile"],
	filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "bmp"] }],
};

jest.mock("fs", () => ({
	readFileSync: jest.fn(() => "avatarImage"),
}));

describe("Import Profile - Profile Form Step", () => {
	beforeAll(() => {
		profile = env.profiles().first();
	});

	beforeEach(() => {
		//@ts-ignore
		showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: ["filePath"],
		}));
	});

	it("should render profile form", async () => {
		const history = createMemoryHistory();
		history.push(`/profiles/import`);

		const { container, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfileForm env={env} profile={profile} showCurrencyField={true} showThemeToggleField={true} />
			</EnvironmentProvider>,
		);

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));
		expect(container).toMatchSnapshot();
	});

	it("should render profile form with hidden fields", async () => {
		const history = createMemoryHistory();
		history.push(`/profiles/import`);

		const { container, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfileForm env={env} profile={profile} />
			</EnvironmentProvider>,
		);

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));
		expect(container).toMatchSnapshot();
	});

	it("should render profile form with empty profile", async () => {
		const history = createMemoryHistory();
		const emptyProfile = env.profiles().create("test2");
		history.push(`/profiles/import`);

		const { container, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfileForm
					env={env}
					profile={emptyProfile}
					showCurrencyField={true}
					showThemeToggleField={true}
				/>
			</EnvironmentProvider>,
		);

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));
		expect(container).toMatchSnapshot();
	});

	it("should store profile", async () => {
		const emptyProfile = env.profiles().create("test3");
		const { asFragment, container, getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfileForm
					env={env}
					profile={emptyProfile}
					showCurrencyField={true}
					showThemeToggleField={true}
				/>
			</EnvironmentProvider>,
		);

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));

		// Upload avatar image
		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile 1" } });

		const selectDropdown = getByTestId("SelectDropdown__input");

		await act(async () => {
			fireEvent.focus(selectDropdown);
		});

		fireEvent.click(getByTestId("SelectDropdown__option--0"));

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		const profiles = env.profiles().values();

		expect(emptyProfile.usesPassword()).toBe(false);

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile 2" } });
		fireEvent.click(container.querySelector("input[name=isDarkMode]"));

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		const newProfile = env.profiles().findById(emptyProfile.id());
		expect(newProfile.name()).toEqual("test profile 2");
		expect(newProfile.usesPassword()).toBe(false);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should store new profile with password", async () => {
		const profilesCount = env.profiles().count();

		const { asFragment, container, getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfileForm env={env} showCurrencyField={true} showThemeToggleField={true} />
			</EnvironmentProvider>,
		);

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));

		// Upload avatar image
		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith(showOpenDialogParams);

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile 1" } });

		const selectDropdown = getByTestId("SelectDropdown__input");

		await act(async () => {
			fireEvent.focus(selectDropdown);
		});

		fireEvent.click(getByTestId("SelectDropdown__option--0"));

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		const profiles = env.profiles().values();

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "profile2" } });
		fireEvent.click(container.querySelector("input[name=isDarkMode]"));

		await act(async () => {
			fireEvent.change(getAllByTestId("InputPassword")[0], { target: { value: "S3cUrePa$sword" } });
			fireEvent.change(getAllByTestId("InputPassword")[1], { target: { value: "S3cUrePa$sword" } });
		});

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		expect(env.profiles().count()).toBe(profilesCount + 1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail password confirmation", async () => {
		const emptyProfile = env.profiles().create("test4");
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfileForm
					env={env}
					profile={emptyProfile}
					showCurrencyField={true}
					showThemeToggleField={true}
				/>
			</EnvironmentProvider>,
		);

		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "asdasdas" } });

		const selectDropdown = getByTestId("SelectDropdown__input");
		fireEvent.focus(selectDropdown);
		fireEvent.click(getByTestId("SelectDropdown__option--0"));

		fireEvent.change(getAllByTestId("InputPassword")[0], { target: { value: "test password" } });
		fireEvent.change(getAllByTestId("InputPassword")[1], { target: { value: "wrong" } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));

		fireEvent.input(getAllByTestId("InputPassword")[0], { target: { value: "password" } });
		fireEvent.input(getAllByTestId("InputPassword")[1], { target: { value: "password" } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).not.toHaveAttribute("disabled"));

		fireEvent.input(getAllByTestId("InputPassword")[1], { target: { value: "test password" } });
		fireEvent.input(getAllByTestId("InputPassword")[0], { target: { value: "wrong" } });

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update the avatar when removing focus from name input", async () => {
		const emptyProfile = env.profiles().create("test6");
		const shouldUseDarkColorsSpy = jest.spyOn(utils, "shouldUseDarkColors").mockReturnValue(false);

		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfileForm
					env={env}
					profile={emptyProfile}
					showThemeToggleField={false}
					showCurrencyField={false}
					shouldValidate
				/>
			</EnvironmentProvider>,
		);

		await waitFor(() => expect(getByTestId("CreateProfile__submit-button")).toHaveAttribute("disabled"));

		act(() => getAllByTestId("Input")[0].focus());

		await act(async () => {
			fireEvent.input(getAllByTestId("Input")[0], { target: { value: "t" } });
		});

		act(() => getAllByTestId("InputPassword")[1].focus());

		expect(getByTestId("SelectProfileImage__avatar")).toBeTruthy();

		await act(async () => {
			fireEvent.input(getAllByTestId("Input")[0], { target: { value: "te" } });
		});

		act(() => getAllByTestId("InputPassword")[0].focus());

		expect(getByTestId("SelectProfileImage__avatar")).toBeTruthy();

		act(() => getAllByTestId("Input")[0].focus());

		await act(async () => {
			fireEvent.input(getAllByTestId("Input")[0], { target: { value: "test profile" } });
		});

		act(() => getAllByTestId("InputPassword")[0].focus());

		expect(getByTestId("SelectProfileImage__avatar")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();

		act(() => getAllByTestId("Input")[0].focus());

		await act(async () => {
			fireEvent.input(getAllByTestId("Input")[0], { target: { value: "" } });
		});

		act(() => getAllByTestId("InputPassword")[0].focus());

		expect(() => getByTestId("SelectProfileImage__avatar")).toThrow(/^Unable to find an element by/);

		// Upload avatar image
		await act(async () => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		expect(() => getByTestId("SelectProfileImage__avatar")).toBeTruthy();

		act(() => getAllByTestId("Input")[0].focus());

		await act(async () => {
			fireEvent.input(getAllByTestId("Input")[0], { target: { value: "t" } });
		});

		act(() => getAllByTestId("InputPassword")[0].focus());

		expect(asFragment()).toMatchSnapshot();
		shouldUseDarkColorsSpy.mockRestore();
	});
});
