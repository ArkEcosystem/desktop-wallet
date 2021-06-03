/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { act, renderHook } from "@testing-library/react-hooks";
import { LedgerProvider } from "app/contexts";
import { EnvironmentProvider } from "app/contexts";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { toasts } from "app/services";
import { NetworkStep } from "domains/wallet/components/NetworkStep";
import { translations as walletTranslations } from "domains/wallet/i18n";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import {
	act as utilsAct,
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	renderWithRouter,
	screen,
	waitFor,
} from "utils/testing-library";

import { ImportWallet } from "./ImportWallet";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

let profile: Contracts.IProfile;
const fixtureProfileId = getDefaultProfileId();

const identityAddress = "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P";
const mnemonic = "buddy year cost vendor honey tonight viable nut female alarm duck symptom";
const randomAddress = "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib";

const route = `/profiles/${fixtureProfileId}/wallets/import`;
const history = createMemoryHistory();

jest.setTimeout(30000);

describe("ImportWallet", () => {
	beforeAll(() => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P")
			.reply(200, require("tests/fixtures/coins/ark/devnet/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P.json"))
			.persist();
	});

	beforeEach(async () => {
		profile = env.profiles().findById(fixtureProfileId);

		await env.profiles().restore(profile);

		const walletId = profile.wallets().findByAddress(randomAddress)?.id();

		if (walletId) {
			profile.wallets().forget(walletId);
		}
	});

	it("should render network step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<NetworkStep profile={profile} title="title" subtitle="subtitle" />
			</FormProvider>,
		);

		expect(getByTestId("NetworkStep")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		expect(selectNetworkInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		expect(selectNetworkInput).toHaveValue("ARK Devnet");
	});

	it("should render network step without test networks", async () => {
		profile.settings().set(Contracts.ProfileSetting.UseTestNetworks, false);

		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment, queryByTestId } = render(
			<FormProvider {...form.current}>
				<NetworkStep profile={profile} title="title" subtitle="subtitle" />
			</FormProvider>,
		);

		expect(getByTestId("NetworkStep")).toBeTruthy();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		expect(selectNetworkInput).toBeTruthy();

		act(() => {
			fireEvent.focus(selectNetworkInput);
		});

		expect(queryByTestId("NetworkIcon-ARK-ark.mainnet")).toBeInTheDocument();
		expect(queryByTestId("NetworkIcon-ARK-ark.devnet")).toBeNull();

		expect(asFragment()).toMatchSnapshot();

		profile.settings().set(Contracts.ProfileSetting.UseTestNetworks, true);
	});

	it("should render 2nd step", async () => {
		let form: ReturnType<typeof useForm>;

		const Component = () => {
			form = useForm({
				defaultValues: {
					network: {
						id: () => "ark.devnet",
						coin: () => "ARK",
					},
					type: "mnemonic",
				},
			});
			form.register("type");
			form.register("network");
			return (
				<EnvironmentProvider env={env}>
					<FormProvider {...form}>
						<SecondStep profile={profile} />
					</FormProvider>
				</EnvironmentProvider>
			);
		};

		history.push(`/profiles/${profile.id()}`);
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId">
				<Component />
			</Route>,
			{ history, withProviders: false },
		);

		expect(screen.getByTestId("ImportWallet__second-step")).toBeTruthy();

		await waitFor(() => expect(screen.getByTestId("ImportWallet__mnemonic-input")));

		const passphraseInput = screen.getByTestId("ImportWallet__mnemonic-input");
		expect(passphraseInput).toBeTruthy();

		fireEvent.change(passphraseInput, { target: { value: mnemonic } });

		await waitFor(() => {
			expect(form.getValues()).toMatchObject({ type: "mnemonic", value: mnemonic });
		});

		act(() => {
			fireEvent.focus(screen.getByTestId("SelectDropdown__input"));
		});

		await waitFor(() => expect(screen.getByTestId("SelectDropdown__option--1")).toBeInTheDocument());

		act(() => {
			fireEvent.mouseDown(screen.getByTestId("SelectDropdown__option--1"));
		});

		await waitFor(() => expect(screen.getByTestId("ImportWallet__address-input")).toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		let form: ReturnType<typeof useForm>;
		const Component = () => {
			form = useForm({
				defaultValues: {
					network: {
						id: () => "ark.devnet",
						coin: () => "ARK",
						ticker: () => "DARK",
					},
					type: "mnemonic",
				},
			});

			return (
				<FormProvider {...form}>
					<ThirdStep
						address={identityAddress}
						balance={BigNumber.make(80)}
						nameMaxLength={42}
						profile={profile}
					/>
				</FormProvider>
			);
		};

		const { getByTestId, getByText, asFragment } = render(<Component />);

		expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		expect(getByText("ARK Devnet")).toBeTruthy();
		expect(getByText(identityAddress)).toBeTruthy();

		const walletNameInput = getByTestId("ImportWallet__name-input");

		await act(async () => {
			fireEvent.change(walletNameInput, { target: { value: "Test" } });
		});

		expect(form.getValues()).toEqual({ name: "Test" });
	});

	it("should go back to dashboard", async () => {
		const history = createMemoryHistory();
		history.push(route);

		const historySpy = jest.spyOn(history, "push").mockImplementationOnce();

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		await waitFor(() => expect(getByTestId("ImportWallet__back-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__back-button"));

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${fixtureProfileId}/dashboard`);

		historySpy.mockRestore();
	});

	it("should go to previous step", async () => {
		const history = createMemoryHistory();
		history.push(route);

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(() => {
			expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
		});

		await waitFor(() => expect(getByTestId("ImportWallet__back-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__back-button"));

		await waitFor(() => {
			expect(getByTestId("NetworkStep")).toBeTruthy();
		});
	});

	it("should import by mnemonic", async () => {
		const history = createMemoryHistory();
		history.push(route);

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		const passphraseInput = getByTestId("ImportWallet__mnemonic-input");
		expect(passphraseInput).toBeTruthy();

		fireEvent.input(passphraseInput, { target: { value: mnemonic } });

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(() => {
			expect(getByTestId("EncryptPassword")).toBeTruthy();
		});

		fireEvent.click(getByTestId("ImportWallet__skip-button"));

		await waitFor(() => {
			expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
		});

		await waitFor(() => expect(getByTestId("ImportWallet__save-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__save-button"));

		await waitFor(() => {
			expect(profile.wallets().findByAddress(identityAddress)).toBeTruthy();
		});
	});

	it("should import by mnemonic and use encryption password", async () => {
		const history = createMemoryHistory();
		history.push(route);

		const { getByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		const passphraseInput = getByTestId("ImportWallet__mnemonic-input");
		expect(passphraseInput).toBeTruthy();

		fireEvent.input(passphraseInput, { target: { value: "some mnemonic" } });

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(() => {
			expect(getByTestId("EncryptPassword")).toBeTruthy();
		});

		await utilsAct(async () => {
			fireEvent.input(getAllByTestId("InputPassword")[0], { target: { value: "S3cUrePa$sword" } });
		});

		await utilsAct(async () => {
			fireEvent.input(getAllByTestId("InputPassword")[1], { target: { value: "S3cUrePa$sword" } });
		});

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(
			() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			},
			{ timeout: 15000 },
		);
	});

	it("should import by address", async () => {
		const history = createMemoryHistory();
		history.push(route);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		fireEvent.focus(getByTestId("SelectDropdown__input"));

		await waitFor(() => expect(getByText(commonTranslations.ADDRESS)).toBeInTheDocument());
		fireEvent.mouseDown(getByText(commonTranslations.ADDRESS));

		await waitFor(() => expect(getByTestId("ImportWallet__address-input")).toBeTruthy());
		fireEvent.input(getByTestId("ImportWallet__address-input"), { target: { value: randomAddress } });

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(() => {
			expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
		});

		await waitFor(() => expect(getByTestId("ImportWallet__save-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__save-button"));

		await waitFor(() => {
			expect(profile.wallets().findByAddress(randomAddress)).toBeTruthy();
		});
	});

	it("should import by private key", async () => {
		const history = createMemoryHistory();
		history.push(route);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		fireEvent.focus(getByTestId("SelectDropdown__input"));

		await waitFor(() => expect(getByText(commonTranslations.PRIVATE_KEY)).toBeTruthy());
		fireEvent.mouseDown(getByText(commonTranslations.PRIVATE_KEY));

		await waitFor(() => expect(getByTestId("ImportWallet__privatekey-input")).toBeTruthy());
		fireEvent.input(getByTestId("ImportWallet__privatekey-input"), { target: { value: "invalid" } });

		fireEvent.input(getByTestId("ImportWallet__privatekey-input"), {
			target: { value: "1e089e3c5323ad80a90767bdd5907297b4138163f027097fd3bdbeab528d2d68" },
		});

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(() => {
			expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
		});

		await waitFor(() => expect(getByTestId("ImportWallet__save-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__save-button"));

		await waitFor(() => {
			expect(profile.wallets().findByAddress("DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS")).toBeTruthy();
		});
	});

	it("should import by WIF", async () => {
		const history = createMemoryHistory();
		history.push(route);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		fireEvent.focus(getByTestId("SelectDropdown__input"));

		await waitFor(() => expect(getByText(commonTranslations.WIF)).toBeTruthy());
		fireEvent.mouseDown(getByText(commonTranslations.WIF));

		await waitFor(() => expect(getByTestId("ImportWallet__wif-input")).toBeTruthy());
		fireEvent.input(getByTestId("ImportWallet__wif-input"), { target: { value: "invalid" } });

		fireEvent.input(getByTestId("ImportWallet__wif-input"), {
			target: { value: "SHjn7G4NygZH5LHvuhbMSdgrn42vqu3LdYzjxUoh2E9b7PdVsBPs" },
		});

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(() => {
			expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
		});

		await waitFor(() => expect(getByTestId("ImportWallet__save-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__save-button"));

		await waitFor(() => {
			expect(profile.wallets().findByAddress("DLE2wgQoL4to7ZQayjdrv2tn9QnWzwXcKP")).toBeTruthy();
		});
	});

	it("should fail to import by encrypted WIF", async () => {
		const toastSpy = jest.spyOn(toasts, "error").mockImplementation();

		const history = createMemoryHistory();
		history.push(route);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		fireEvent.focus(getByTestId("SelectDropdown__input"));

		await waitFor(() => expect(getByText(commonTranslations.ENCRYPTED_WIF)).toBeTruthy());
		fireEvent.mouseDown(getByText(commonTranslations.ENCRYPTED_WIF));

		await waitFor(() => expect(getByTestId("ImportWallet__encryptedWif-input")).toBeTruthy());
		fireEvent.input(getByTestId("ImportWallet__encryptedWif-input"), { target: { value: "invalid" } });

		fireEvent.input(getByTestId("ImportWallet__encryptedWif-input"), {
			target: { value: "6PYR8Zq7e84mKXq3kxZyrZ8Zyt6iE89fCngdMgibQ5HjCd7Bt3k7wKc4ZL" },
		});
		fireEvent.input(getByTestId("ImportWallet__encryptedWif__password-input"), {
			target: { value: "wrong-password" },
		});

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(
			() => {
				expect(toastSpy).toHaveBeenCalledWith(
					walletTranslations.PAGE_IMPORT_WALLET.VALIDATION.DECRYPT_WIF_ASSERTION,
				);
			},
			{ timeout: 15000 },
		);

		toastSpy.mockRestore();
	});

	it("should show an error message for duplicate address", async () => {
		const history = createMemoryHistory();
		history.push(route);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		fireEvent.focus(getByTestId("SelectDropdown__input"));

		await waitFor(() => expect(getByText(commonTranslations.ADDRESS)).toBeTruthy());
		fireEvent.mouseDown(getByText(commonTranslations.ADDRESS));

		await waitFor(() => expect(getByTestId("ImportWallet__address-input")).toBeTruthy());
		fireEvent.input(getByTestId("ImportWallet__address-input"), {
			target: { value: profile.wallets().first().address() },
		});

		await waitFor(() => {
			expect(getByTestId("Input__error")).toHaveAttribute(
				"data-errortext",
				commonTranslations.INPUT_ADDRESS.VALIDATION.ADDRESS_ALREADY_EXISTS.replace(
					"{{address}}",
					profile.wallets().first().address(),
				),
			);
		});

		expect(getByTestId("ImportWallet__continue-button")).toBeDisabled();
	});

	it("should import by encrypted WIF", async () => {
		const emptyProfile = env.profiles().create("encryptedWIFProfile");
		const emptyProfileRoute = `/profiles/${emptyProfile.id()}/wallets/import`;

		await env.profiles().restore(emptyProfile);
		await emptyProfile.sync();

		const history = createMemoryHistory();
		history.push(emptyProfileRoute);

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [emptyProfileRoute],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.mainnet"));
		});

		await waitFor(() => expect(selectNetworkInput).toHaveValue("ARK"));

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		fireEvent.focus(getByTestId("SelectDropdown__input"));

		await waitFor(() => expect(getByText(commonTranslations.ENCRYPTED_WIF)).toBeTruthy());
		fireEvent.mouseDown(getByText(commonTranslations.ENCRYPTED_WIF));

		await waitFor(() => expect(getByTestId("ImportWallet__encryptedWif-input")).toBeTruthy());

		const withWifEncryptionMock = jest.spyOn(emptyProfile, "walletFactory").mockImplementation(() => ({
			fromWIFWithEncryption: () => Promise.resolve(profile.wallets().first()),
		}));

		fireEvent.input(getByTestId("ImportWallet__encryptedWif-input"), {
			target: { value: "6PYR8Zq7e84mKXq3kxZyrZ8Zyt6iE89fCngdMgibQ5HjCd7Bt3k7wKc4ZL" },
		});
		fireEvent.input(getByTestId("ImportWallet__encryptedWif__password-input"), {
			target: { value: "password" },
		});

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("ImportWallet__continue-button"));
		});
		await waitFor(
			() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			},
			{ timeout: 15000 },
		);

		await waitFor(() => expect(getByTestId("ImportWallet__save-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__save-button"));

		await waitFor(() => {
			expect(historySpy).toHaveBeenCalled();
		});

		withWifEncryptionMock.mockRestore();
	});

	it("should show an error message for invalid address", async () => {
		const history = createMemoryHistory();
		history.push(route);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		fireEvent.focus(getByTestId("SelectDropdown__input"));

		await waitFor(() => expect(getByText(commonTranslations.ADDRESS)).toBeTruthy());
		fireEvent.mouseDown(getByText(commonTranslations.ADDRESS));

		await waitFor(() => expect(getByTestId("ImportWallet__address-input")).toBeTruthy());
		fireEvent.input(getByTestId("ImportWallet__address-input"), { target: { value: "123" } });

		await waitFor(() => {
			expect(getByTestId("Input__error")).toHaveAttribute(
				"data-errortext",
				commonTranslations.INPUT_ADDRESS.VALIDATION.NOT_VALID,
			);
		});

		expect(getByTestId("ImportWallet__continue-button")).toBeDisabled();
	});

	it("should render as ledger import", async () => {
		const transport: typeof Transport = createTransportReplayer(RecordStore.fromString(""));
		let observer: Observer<any>;
		jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe: jest.fn() };
		});

		const history = createMemoryHistory();

		history.push({
			pathname: route,
			search: `?ledger=true`,
		});

		const { getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<LedgerProvider transport={transport}>
					<ImportWallet />
				</LedgerProvider>
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		expect(container).toMatchSnapshot();
		await waitFor(() => expect(getByTestId("LedgerTabs")).toBeInTheDocument());
	});

	it("should import by address and name", async () => {
		const emptyProfile = env.profiles().create("empty profile");
		const emptyProfileRoute = `/profiles/${emptyProfile.id()}/wallets/import`;

		await env.profiles().restore(emptyProfile);
		await emptyProfile.sync();

		const history = createMemoryHistory();
		history.push(route);
		const randomNewAddress = "DHnF7Ycv16QxQQNGDUdGzWGh5n3ym424UW";

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [emptyProfileRoute],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		fireEvent.focus(getByTestId("SelectDropdown__input"));

		await waitFor(() => expect(getByText(commonTranslations.ADDRESS)).toBeTruthy());
		fireEvent.mouseDown(getByText(commonTranslations.ADDRESS));

		await waitFor(() => expect(getByTestId("ImportWallet__address-input")).toBeTruthy());
		fireEvent.input(getByTestId("ImportWallet__address-input"), { target: { value: randomNewAddress } });

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled(), { timeout: 4000 });
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(() => {
			expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
		});

		const alias = "Test";

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		fireEvent.input(getByTestId("ImportWallet__name-input"), { target: { value: alias } });
		fireEvent.submit(getByTestId("ImportWallet__name-input"), { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(historySpy).toHaveBeenCalled();
		});

		historySpy.mockRestore();
	});

	it("should show an error message for duplicate name", async () => {
		const emptyProfile = env.profiles().create("duplicate wallet name profile");
		const emptyProfileRoute = `/profiles/${emptyProfile.id()}/wallets/import`;

		await env.profiles().restore(emptyProfile);
		await emptyProfile.sync();

		const history = createMemoryHistory();
		history.push(route);
		const randomNewAddress = "D6pPxYLwwCptuhVRvLQQYXEQiQMB5x6iY3";

		const wallet = await emptyProfile.walletFactory().fromMnemonicWithBIP39({
			mnemonic: "random mnemonic",
			coin: "ARK",
			network: "ark.devnet",
		});

		wallet.settings().set(Contracts.WalletSetting.Alias, "My wallet");

		profile.wallets().push(wallet);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<ImportWallet />
			</Route>,
			{
				routes: [emptyProfileRoute],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();

		fireEvent.focus(getByTestId("SelectDropdown__input"));

		await waitFor(() => expect(getByText(commonTranslations.ADDRESS)).toBeTruthy());
		fireEvent.mouseDown(getByText(commonTranslations.ADDRESS));

		await waitFor(() => expect(getByTestId("ImportWallet__address-input")).toBeTruthy());
		fireEvent.input(getByTestId("ImportWallet__address-input"), { target: { value: randomNewAddress } });

		await waitFor(() => expect(getByTestId("ImportWallet__continue-button")).not.toBeDisabled(), { timeout: 4000 });
		fireEvent.click(getByTestId("ImportWallet__continue-button"));

		await waitFor(() => {
			expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
		});

		const alias = "My Wallet";

		fireEvent.input(getByTestId("ImportWallet__name-input"), { target: { value: alias } });
		fireEvent.submit(getByTestId("ImportWallet__name-input"), { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(getByTestId("Input__error")).toHaveAttribute(
				"data-errortext",
				walletTranslations.PAGE_IMPORT_WALLET.VALIDATION.ALIAS_EXISTS.replace("{{alias}}", alias),
			);
		});
		expect(getByTestId("ImportWallet__save-button")).toBeDisabled();
	});
});
