/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act as renderHookAct, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import DelegateRegistrationFixture from "tests/fixtures/coins/ark/devnet/transactions/delegate-registration.json";
import EntityRegistrationFixture from "tests/fixtures/coins/ark/devnet/transactions/entity-update.json";
import IpfsFixture from "tests/fixtures/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV.json";
// @ts-ignore
EntityRegistrationFixture.data.asset.data.name = "Test-Entity-Name";

import {
	act,
	defaultNetMocks,
	env,
	fireEvent,
	getDefaultProfileId,
	getDefaultWalletMnemonic,
	render,
	RenderResult,
	renderWithRouter,
	screen,
	syncDelegates,
	syncFees,
	waitFor,
	within,
} from "utils/testing-library";

import { RegistrationTypeStep, SendEntityRegistration } from "./";

let profile: Profile;
let wallet: ReadWriteWallet;
let secondWallet: ReadWriteWallet;
const history = createMemoryHistory();
const passphrase = getDefaultWalletMnemonic();

const renderPage = async (wallet?: ReadWriteWallet) => {
	const path = wallet
		? "/profiles/:profileId/wallets/:walletId/send-entity-registration"
		: "/profiles/:profileId/send-entity-registration";

	const registrationURL = wallet
		? `/profiles/${profile.id()}/wallets/${wallet?.id()}/send-entity-registration`
		: `/profiles/${profile.id()}/send-entity-registration`;

	history.push(registrationURL);

	let rendered: RenderResult;
	await act(async () => {
		rendered = renderWithRouter(
			<Route path={path}>
				<SendEntityRegistration />
			</Route>,
			{
				routes: [registrationURL],
				history,
			},
		);

		await waitFor(() => expect(rendered.getByTestId("Registration__form")).toBeTruthy());
		await waitFor(() => expect(rendered.getByTestId("Registration__selection-step")).toBeTruthy());
	});

	return {
		...rendered!,
		history,
	};
};

const createTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => DelegateRegistrationFixture.data.id,
		sender: () => DelegateRegistrationFixture.data.sender,
		recipient: () => DelegateRegistrationFixture.data.recipient,
		amount: () => BigNumber.make(DelegateRegistrationFixture.data.amount),
		fee: () => BigNumber.make(DelegateRegistrationFixture.data.fee),
		data: () => DelegateRegistrationFixture.data,
	});

const createEntityRegistrationMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => EntityRegistrationFixture.data.id,
		sender: () => EntityRegistrationFixture.data.sender,
		recipient: () => EntityRegistrationFixture.data.recipient,
		amount: () => BigNumber.make(EntityRegistrationFixture.data.amount),
		fee: () => BigNumber.make(EntityRegistrationFixture.data.fee),
		data: () => EntityRegistrationFixture.data,
	});

describe("Registration", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		secondWallet = profile.wallets().findByAddress("D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")!;

		await profile.wallets().importByAddress("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib", "ARK", "ark.devnet");

		await syncDelegates();
		await syncFees();
	});

	beforeEach(() => {
		nock.cleanAll();
		defaultNetMocks();

		nock("https://dwallets.ark.io")
			.get("/api/wallets/DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS")
			.reply(200, require("tests/fixtures/coins/ark/devnet/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"));

		nock("https://platform.ark.io/api")
			.get("/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV")
			.reply(200, IpfsFixture)
			.get("/ipfs/QmV1n5F9PuBE2ovW9jVfFpxyvWZxYHjSdfLrYL2nDcb1gW")
			.reply(200, IpfsFixture)
			.post("/ipfs")
			.reply(200, { data: { hash: EntityRegistrationFixture.data.asset.data.ipfsData } })
			.persist();
	});

	it("should render registration form without selected wallet", async () => {
		const { getByTestId, asFragment } = await renderPage();

		await waitFor(() => expect(getByTestId("Registration__selection-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select cryptoasset first and see select address input clickable", async () => {
		const { getByTestId, asFragment } = await renderPage();

		await waitFor(() => expect(getByTestId("Registration__selection-step")).toBeTruthy());

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet");
		expect(getByTestId("SelectAddress__wrapper")).not.toHaveAttribute("disabled");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select cryptoasset with unavailable wallets and see select address input disabled", async () => {
		const { getByTestId, asFragment } = await renderPage();

		await waitFor(() => expect(getByTestId("Registration__selection-step")).toBeTruthy());

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should hide options for multisignature wallet", async () => {
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);

		const Component = () => {
			const form = useForm();

			return (
				<FormProvider {...form}>
					<RegistrationTypeStep
						networks={env.availableNetworks()}
						profile={profile}
						wallet={wallet}
						setRegistrationForm={() => void 0}
						fees={{
							entityRegistration: {
								avg: "1",
							},
						}}
					/>
				</FormProvider>
			);
		};

		const { container } = render(<Component />);

		act(() => {
			fireEvent.focus(screen.getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(screen.queryByText("MultiSignature")).not.toBeInTheDocument());

		isMultiSignatureSpy.mockRestore();

		expect(container).toMatchSnapshot();
	});

	it.each([
		["delegate", "Delegate Update"],
		["secondSignature", "Register Second Signature"],
		["multiSignature", "Multisignature Registration"],
	])("should handle registrationType param (%s)", async (type, label) => {
		const registrationPath = `/profiles/${getDefaultProfileId()}/wallets/${secondWallet.id()}/${type}/send-entity-registration`;
		history.push(registrationPath);

		await act(async () => {
			const renderedPage = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/:registrationType/send-entity-registration">
					<SendEntityRegistration />
				</Route>,
				{
					routes: [registrationPath],
					history,
				},
			);

			await waitFor(() => expect(renderedPage.getByTestId("Registration__form")).toBeTruthy());
			await waitFor(() => expect(renderedPage.getByTestId("header__title")).toHaveTextContent(label));
		});
	});

	it("should render 1st step", async () => {
		const setRegistrationForm = jest.fn();
		const network = {
			id: () => "ark.devnet",
			coin: () => "ARK",
			can: () => true,
		};
		const fees = {
			delegateRegistration: {
				avg: "1",
			},
		};

		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network,
				},
			}),
		);
		const setValueSpy = jest.spyOn(form.current, "setValue");
		let rendered: RenderResult;

		await renderHookAct(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<RegistrationTypeStep
						networks={env.availableNetworks()}
						profile={profile}
						wallet={wallet}
						setRegistrationForm={setRegistrationForm}
						fees={fees}
					/>
				</FormProvider>,
			);

			await waitFor(() => expect(rendered.getByTestId("Registration__selection-step")).toBeTruthy());
		});

		const { asFragment, getByTestId } = rendered!;

		await renderHookAct(async () => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));

			await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Delegate")).toBeTruthy());

			fireEvent.click(getByTestId("RegistrationTypeIcon-Delegate"));

			await waitFor(() => expect(setValueSpy).toHaveBeenNthCalledWith(1, "network", { ...network }));
			await waitFor(() =>
				expect(setValueSpy).toHaveBeenNthCalledWith(
					2,
					"registrationType",
					{ label: "Delegate", value: "delegateRegistration" },
					{
						shouldValidate: true,
						shouldDirty: true,
					},
				),
			);
			await waitFor(() => expect(setRegistrationForm).toHaveBeenCalledTimes(1));
			await waitFor(() =>
				expect(setValueSpy).toHaveBeenNthCalledWith(3, "fee", "1", { shouldValidate: true, shouldDirty: true }),
			);
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should not set fee if no fee options", async () => {
		const setRegistrationForm = jest.fn();
		const network = {
			id: () => "ark.devnet",
			coin: () => "ARK",
			can: () => true,
		};
		const fees = {};

		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network,
				},
			}),
		);
		const setValueSpy = jest.spyOn(form.current, "setValue");
		let rendered: RenderResult;

		await renderHookAct(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<RegistrationTypeStep
						networks={env.availableNetworks()}
						profile={profile}
						wallet={wallet}
						setRegistrationForm={setRegistrationForm}
						fees={fees}
					/>
				</FormProvider>,
			);

			await waitFor(() => expect(rendered.getByTestId("Registration__selection-step")).toBeTruthy());
		});

		const { asFragment, getByTestId } = rendered!;

		await renderHookAct(async () => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));

			await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Delegate")).toBeTruthy());

			fireEvent.click(getByTestId("RegistrationTypeIcon-Delegate"));

			await waitFor(() => expect(setValueSpy).toHaveBeenNthCalledWith(1, "network", { ...network }));
			await waitFor(() =>
				expect(setValueSpy).toHaveBeenNthCalledWith(
					2,
					"registrationType",
					{ label: "Delegate", value: "delegateRegistration" },
					{ shouldValidate: true, shouldDirty: true },
				),
			);
			await waitFor(() => expect(setRegistrationForm).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(setValueSpy).not.toHaveBeenNthCalledWith(3, "fee", "1", true));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should select registration type & show form", async () => {
		const { asFragment, getByTestId } = await renderPage(wallet);

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId(
			"SelectRegistrationTypeInput__input",
		);
		expect(typeSelectInput).not.toHaveValue("Delegate");

		await act(async () => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));

			await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Delegate")).toBeTruthy());

			fireEvent.click(getByTestId("RegistrationTypeIcon-Delegate"));

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());
			await waitFor(() => expect(typeSelectInput).toHaveValue("Delegate"));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should change sender & route", async () => {
		const { getByTestId, history } = await renderPage(wallet);

		await act(async () => {
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const historySpy = jest.spyOn(history, "push");

			const firstAddress = getByTestId("SearchWalletListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			const secondWallet = profile.wallets().values()[1];
			await waitFor(() =>
				expect(historySpy).toHaveBeenCalledWith(
					`/profiles/${profile?.id()}/wallets/${secondWallet.id()}/send-entity-registration`,
				),
			);

			historySpy.mockRestore();
		});
	});

	it("should not have delegate option if wallet is a delegate", async () => {
		const { asFragment, getByTestId } = await renderPage(secondWallet);

		await act(async () => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});
		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Product")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Plugin")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Module")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should go back and forth & correctly register fields", async () => {
		const { asFragment, getByTestId } = await renderPage(wallet);

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId(
			"SelectRegistrationTypeInput__input",
		);
		expect(typeSelectInput).not.toHaveValue("Delegate");

		await act(async () => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));

			await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Delegate")).toBeTruthy());

			fireEvent.click(getByTestId("RegistrationTypeIcon-Delegate"));

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());
			await waitFor(() => expect(getByTestId("Registration__back-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__back-button"));

			await waitFor(() => expect(getByTestId("Registration__selection-step")).toBeTruthy());

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());
			await waitFor(() => expect(getByTestId("Registration__continue-button")).toHaveAttribute("disabled"));

			act(() => {
				fireEvent.change(getByTestId("Input__username"), { target: { value: "test_delegate" } });
			});

			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should not unregister fields when going back to step 2 onwards", async () => {
		const { asFragment, container, getByTestId } = await renderPage(wallet);

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId(
			"SelectRegistrationTypeInput__input",
		);
		expect(typeSelectInput).not.toHaveValue("Delegate");

		await act(async () => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));

			await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Delegate")).toBeTruthy());

			fireEvent.click(getByTestId("RegistrationTypeIcon-Delegate"));

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());
			await waitFor(() => expect(getByTestId("Registration__continue-button")).toHaveAttribute("disabled"));

			act(() => {
				fireEvent.change(getByTestId("Input__username"), { target: { value: "test_delegate" } });
			});

			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));
			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy());
			await waitFor(() => expect(getByTestId("Registration__back-button")).not.toHaveAttribute("disabled"));
			await waitFor(() => expect(container).toHaveTextContent("test_delegate"));

			fireEvent.click(getByTestId("Registration__back-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));
			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy());
			await waitFor(() => expect(container).toHaveTextContent("test_delegate"));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should register delegate", async () => {
		const { asFragment, getByTestId, history } = await renderPage(wallet);

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId(
			"SelectRegistrationTypeInput__input",
		);
		expect(typeSelectInput).not.toHaveValue("Delegate");

		await act(async () => {
			// Step 1
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
			await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Delegate")).toBeTruthy());
			fireEvent.click(getByTestId("RegistrationTypeIcon-Delegate"));
			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			// Step 2
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

			const input = getByTestId("Input__username");
			act(() => {
				fireEvent.change(input, { target: { value: "test_delegate" } });
			});

			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);

			expect(getByTestId("InputCurrency")).not.toHaveValue("0");
			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			// Step 3
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy());

			// Step 4 - signing
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: passphrase } });
			await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

			await waitFor(() => expect(getByTestId("Registration__send-button")).not.toHaveAttribute("disabled"));

			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateRegistration")
				.mockReturnValue(Promise.resolve(DelegateRegistrationFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("Registration__send-button"));

			await waitFor(() => expect(signMock).toHaveBeenCalled());
			await waitFor(() => expect(broadcastMock).toHaveBeenCalled());
			await waitFor(() => expect(transactionMock).toHaveBeenCalled());

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			// Step 5 - sent screen
			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			// Go back to wallet
			const historySpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("Registration__button--back-to-wallet"));
			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
			historySpy.mockRestore();
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should register delegate as entity", async () => {
		const delegateToEntityPath = `/profiles/${getDefaultProfileId()}/wallets/${secondWallet.id()}/delegate/send-entity-registration`;
		history.push(delegateToEntityPath);

		let renderedPage: any;
		await act(async () => {
			renderedPage = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/:registrationType/send-entity-registration">
					<SendEntityRegistration />
				</Route>,
				{
					routes: [delegateToEntityPath],
					history,
				},
			);

			await waitFor(() => expect(renderedPage.getByTestId("Registration__form")).toBeTruthy());
			await waitFor(() => expect(renderedPage.getByTestId("EntityRegistrationForm__entity-name")).toBeTruthy());
			await waitFor(() =>
				expect(renderedPage.getByTestId("EntityRegistrationForm__entity-name")).toHaveValue("testwallet2"),
			);
		});
	});

	it("should validate website url", async () => {
		const { asFragment, getByTestId } = await renderPage(wallet);

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__website"), { target: { value: "wrong url" } });
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm__website")).toHaveAttribute("aria-invalid"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should set fee", async () => {
		const { getByTestId, getAllByTestId } = await renderPage(wallet);

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.click(getAllByTestId("SelectionBarOption")[1]);
		});

		const feeInput = getByTestId("InputCurrency");
		waitFor(() => expect(feeInput).toHaveValue("0"));
	});

	it("should validate entity name", async () => {
		const { asFragment, getByTestId } = await renderPage(wallet);

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__entity-name"), { target: { value: "ab" } });
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm__entity-name")).toHaveAttribute("aria-invalid"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should validate display name", async () => {
		const { asFragment, getByTestId } = await renderPage(wallet);

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__display-name"), { target: { value: "ab" } });
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveAttribute("aria-invalid"),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should validate description", async () => {
		const { asFragment, getByTestId } = await renderPage(wallet);

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__description"), { target: { value: "ab" } });
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm__description")).toHaveAttribute("aria-invalid"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should go to review step after successfully filling form data", async () => {
		const { asFragment, getByTestId } = await renderPage(wallet);

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.input(getByTestId("EntityRegistrationForm__entity-name"), {
				target: {
					value: "Test-Entity-Name",
				},
			});
		});
		await waitFor(() => expect(getByTestId("EntityRegistrationForm__entity-name")).toHaveValue("Test-Entity-Name"));

		act(() => {
			fireEvent.input(getByTestId("EntityRegistrationForm__display-name"), {
				target: {
					value: "Test Entity Display Name",
				},
			});
		});
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue("Test Entity Display Name"),
		);

		act(() => {
			fireEvent.input(getByTestId("EntityRegistrationForm__description"), {
				target: {
					value: "Test Entity Description",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__description")).toHaveValue("Test Entity Description"),
		);

		act(() => {
			fireEvent.input(getByTestId("EntityRegistrationForm__website"), {
				target: {
					value: "https://test-step.entity.com",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__website")).toHaveValue("https://test-step.entity.com"),
		);

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("ReviewStep")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fill all data including link collections", async () => {
		const { asFragment, getByTestId, getAllByTestId } = await renderPage(wallet);

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.input(getByTestId("EntityRegistrationForm__entity-name"), {
				target: {
					value: "Test-Entity-Name",
				},
			});
		});
		await waitFor(() => expect(getByTestId("EntityRegistrationForm__entity-name")).toHaveValue("Test-Entity-Name"));

		act(() => {
			fireEvent.input(getByTestId("EntityRegistrationForm__display-name"), {
				target: {
					value: "Test Entity Display Name",
				},
			});
		});
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue("Test Entity Display Name"),
		);

		act(() => {
			fireEvent.input(getByTestId("EntityRegistrationForm__description"), {
				target: {
					value: "Test Entity Description",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__description")).toHaveValue("Test Entity Description"),
		);

		act(() => {
			fireEvent.input(getByTestId("EntityRegistrationForm__website"), {
				target: {
					value: "https://test-step.entity.com",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__website")).toHaveValue("https://test-step.entity.com"),
		);

		const toggleLinkCollectionHeader = async (collection: any) => {
			// Open sourceControl
			await act(async () => {
				fireEvent.click(within(collection).getByTestId("LinkCollection__header"));
			});
		};

		const addLink = async (collection: any, optionLabel: string, inputValue: string) => {
			await toggleLinkCollectionHeader(collection);

			const selectDropdown = within(collection).getByTestId("SelectDropdownInput__input");

			await act(async () => {
				fireEvent.change(selectDropdown, { target: { value: optionLabel } });
			});

			const firstOption = getByTestId("select-list__toggle-option-0");
			await waitFor(() => expect(firstOption).toBeTruthy());

			await act(async () => {
				fireEvent.click(firstOption);
			});

			const input = within(collection).getByTestId("LinkCollection__input-link");

			await waitFor(() => expect(input).toBeEnabled());

			await act(async () => {
				fireEvent.input(input, {
					target: {
						value: inputValue,
					},
				});
			});

			const addedItems = within(collection).queryAllByTestId("TableRow");
			const newLength = addedItems.length + 1;

			await act(async () => {
				fireEvent.click(within(collection).getByTestId("LinkCollection__add-link"));
			});

			await waitFor(() => expect(input).toHaveValue(""));

			await waitFor(() => expect(within(collection).getAllByTestId("TableRow")).toHaveLength(newLength));
			const addedItem = within(collection).getAllByTestId("TableRow")[newLength - 1];
			await waitFor(() => expect(addedItem).toBeTruthy());
			await waitFor(() => expect(addedItem).toHaveTextContent(optionLabel));
			await waitFor(() => expect(addedItem).toHaveTextContent(inputValue));

			await toggleLinkCollectionHeader(collection);
		};

		const repository = getAllByTestId("LinkCollection")[0];
		const socialMedia = getAllByTestId("LinkCollection")[1];
		const media = getAllByTestId("LinkCollection")[2];

		// Add source control link
		await addLink(repository, "GitHub", "https://github.com/test");

		// Add source media link
		await addLink(socialMedia, "Facebook", "https://facebook.com/test");
		await addLink(socialMedia, "Instagram", "https://instagram.com/test");

		// Add media link
		await addLink(media, "Imgur", "https://i.imgur.com/123456.png");
		await addLink(
			media,
			"GitHub",
			"https://raw.githubusercontent.com/arkecosystem/plugins/master/images/preview-1.jpg",
		);

		await addLink(media, "YouTube", "https://youtube.com/watch?v=123456");

		await toggleLinkCollectionHeader(media);

		// Select avatar
		const firstMediaItem = within(media).getAllByTestId("TableRow")[0];

		await act(async () => {
			fireEvent.click(within(firstMediaItem).getByTestId("LinkCollection__selected"));
		});

		await toggleLinkCollectionHeader(media);

		expect(asFragment()).toMatchSnapshot();
	}, 10000);

	it("should successfully register entity", async () => {
		const { getByTestId, queryAllByTestId } = await renderPage(secondWallet);

		const secondPublicKeyMock = jest
			.spyOn(secondWallet, "secondPublicKey")
			.mockReturnValue(await secondWallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));

		await waitFor(() => expect(queryAllByTestId("Registration__type")).toHaveLength(1));

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__entity-name"), {
				target: {
					value: "Test-Entity-Name",
				},
			});
		});
		await waitFor(() => expect(getByTestId("EntityRegistrationForm__entity-name")).toHaveValue("Test-Entity-Name"));

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__display-name"), {
				target: {
					value: "Test Entity Display Name",
				},
			});
		});
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue("Test Entity Display Name"),
		);

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__description"), {
				target: {
					value: "Test Entity Description",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__description")).toHaveValue("Test Entity Description"),
		);

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__website"), {
				target: {
					value: "https://test-step.entity.com",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__website")).toHaveValue("https://test-step.entity.com"),
		);

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("ReviewStep")).toBeTruthy());
		await waitFor(() => expect(getByTestId("Registration__continue-button")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		// Step 4 - signing
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		const mnemonic = getByTestId("AuthenticationStep__mnemonic");
		const secondMnemonic = getByTestId("AuthenticationStep__second-mnemonic");

		act(() => {
			fireEvent.input(mnemonic, { target: { value: "v3wallet2" } });
		});

		act(() => {
			fireEvent.input(secondMnemonic, { target: { value: "second mnemonic" } });
		});

		await waitFor(() => expect(mnemonic).toHaveValue("v3wallet2"));
		await waitFor(() => expect(secondMnemonic).toHaveValue("second mnemonic"));

		await waitFor(() => expect(getByTestId("Registration__send-button")).not.toHaveAttribute("disabled"));
		await waitFor(() => expect(getByTestId("Registration__send-button")).toBeTruthy());

		const signMock = jest
			.spyOn(secondWallet.transaction(), "signEntityRegistration")
			.mockReturnValue(Promise.resolve(EntityRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(secondWallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createEntityRegistrationMock(secondWallet);

		act(() => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});

		await waitFor(() => expect(signMock).toHaveBeenCalled());
		await waitFor(() => expect(broadcastMock).toHaveBeenCalled());
		await waitFor(() => expect(transactionMock).toHaveBeenCalled());

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
		secondPublicKeyMock.mockRestore();

		// Step 5 - sent screen
		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
	});

	it("should show mnemonic error", async () => {
		const { getByTestId, queryAllByTestId } = await renderPage(secondWallet);

		const secondPublicKeyMock = jest
			.spyOn(secondWallet, "secondPublicKey")
			.mockReturnValue(await secondWallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));

		await waitFor(() => expect(queryAllByTestId("Registration__type")).toHaveLength(1));

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__entity-name"), {
				target: {
					value: "Test-Entity-Name",
				},
			});
		});
		await waitFor(() => expect(getByTestId("EntityRegistrationForm__entity-name")).toHaveValue("Test-Entity-Name"));

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__display-name"), {
				target: {
					value: "Test Entity Display Name",
				},
			});
		});
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue("Test Entity Display Name"),
		);

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__description"), {
				target: {
					value: "Test Entity Description",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__description")).toHaveValue("Test Entity Description"),
		);

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__website"), {
				target: {
					value: "https://test-step.entity.com",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__website")).toHaveValue("https://test-step.entity.com"),
		);

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("ReviewStep")).toBeTruthy());
		await waitFor(() => expect(getByTestId("Registration__continue-button")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		// Step 4 - signing
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		const mnemonic = getByTestId("AuthenticationStep__mnemonic");
		const secondMnemonic = getByTestId("AuthenticationStep__second-mnemonic");

		act(() => {
			fireEvent.input(mnemonic, { target: { value: "v3wallet2" } });
		});

		act(() => {
			fireEvent.input(secondMnemonic, { target: { value: "second mnemonic" } });
		});

		await waitFor(() => expect(mnemonic).toHaveValue("v3wallet2"));
		await waitFor(() => expect(secondMnemonic).toHaveValue("second mnemonic"));

		await waitFor(() => expect(getByTestId("Registration__send-button")).not.toHaveAttribute("disabled"));
		await waitFor(() => expect(getByTestId("Registration__send-button")).toBeTruthy());

		const signMock = jest.spyOn(secondWallet.transaction(), "signEntityRegistration").mockImplementation(() => {
			throw new Error("Signatory should be");
		});

		act(() => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});

		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveAttribute("aria-invalid"));
		await waitFor(() => expect(signMock).toHaveBeenCalled());

		signMock.mockRestore();
		secondPublicKeyMock.mockRestore();
	});

	it("should show error step and go back", async () => {
		const { asFragment, getByTestId, queryAllByTestId } = await renderPage(secondWallet);

		const secondPublicKeyMock = jest
			.spyOn(secondWallet, "secondPublicKey")
			.mockReturnValue(await secondWallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));

		await waitFor(() => expect(queryAllByTestId("Registration__type")).toHaveLength(1));

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__entity-name"), {
				target: {
					value: "Test-Entity-Name",
				},
			});
		});
		await waitFor(() => expect(getByTestId("EntityRegistrationForm__entity-name")).toHaveValue("Test-Entity-Name"));

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__display-name"), {
				target: {
					value: "Test Entity Display Name",
				},
			});
		});
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue("Test Entity Display Name"),
		);

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__description"), {
				target: {
					value: "Test Entity Description",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__description")).toHaveValue("Test Entity Description"),
		);

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__website"), {
				target: {
					value: "https://test-step.entity.com",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__website")).toHaveValue("https://test-step.entity.com"),
		);

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("ReviewStep")).toBeTruthy());
		await waitFor(() => expect(getByTestId("Registration__continue-button")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		// Step 4 - signing
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		const mnemonic = getByTestId("AuthenticationStep__mnemonic");
		const secondMnemonic = getByTestId("AuthenticationStep__second-mnemonic");

		act(() => {
			fireEvent.input(mnemonic, { target: { value: "v3wallet2" } });
		});

		act(() => {
			fireEvent.input(secondMnemonic, { target: { value: "second mnemonic" } });
		});

		await waitFor(() => expect(mnemonic).toHaveValue("v3wallet2"));
		await waitFor(() => expect(secondMnemonic).toHaveValue("second mnemonic"));

		await waitFor(() => expect(getByTestId("Registration__send-button")).not.toHaveAttribute("disabled"));
		await waitFor(() => expect(getByTestId("Registration__send-button")).toBeTruthy());

		const signMock = jest.spyOn(secondWallet.transaction(), "signEntityRegistration").mockImplementation(() => {
			throw new Error();
		});

		const historyMock = jest.spyOn(history, "push").mockReturnValue();

		act(() => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});

		await waitFor(() => expect(getByTestId("ErrorStep")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("ErrorStep__wallet-button"));
		});

		const walletDetailPage = `/profiles/${getDefaultProfileId()}/wallets/${secondWallet.id()}`;
		await waitFor(() => expect(historyMock).toHaveBeenCalledWith(walletDetailPage));

		historyMock.mockRestore();
		signMock.mockRestore();
		secondPublicKeyMock.mockRestore();
	});
});
