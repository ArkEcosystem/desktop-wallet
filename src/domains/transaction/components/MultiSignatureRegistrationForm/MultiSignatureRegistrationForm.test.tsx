import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfilesContracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import multiSignatureFixture from "tests/fixtures/coins/ark/devnet/transactions/multisignature-registration.json";
import { TransactionFees } from "types";
import { act, env, fireEvent, getDefaultProfileId, render, screen, syncFees, waitFor } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { MultiSignatureRegistrationForm } from "./MultiSignatureRegistrationForm";

describe("MultiSignature Registration Form", () => {
	let profile: ProfilesContracts.IProfile;
	let wallet: ProfilesContracts.IReadWriteWallet;
	let wallet2: ProfilesContracts.IReadWriteWallet;
	let fees: TransactionFees;

	const createTransactionMock = (wallet: ProfilesContracts.IReadWriteWallet) =>
		// @ts-ignore
		jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
			id: () => multiSignatureFixture.data.id,
			sender: () => multiSignatureFixture.data.sender,
			recipient: () => multiSignatureFixture.data.recipient,
			amount: () => BigNumber.make(multiSignatureFixture.data.amount),
			fee: () => BigNumber.make(multiSignatureFixture.data.fee),
			data: () => multiSignatureFixture.data,
		});

	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		wallet2 = profile.wallets().last();
		fees = {
			static: "0",
			min: "0",
			max: "10",
			avg: "1.354",
		};

		await profile.sync();
		await syncFees(profile);
	});

	const Component = ({
		form,
		onSubmit = () => void 0,
		activeTab = 1,
	}: {
		form: ReturnType<typeof useForm>;
		onSubmit?: () => void;
		activeTab?: number;
	}) => (
		<Form context={form} onSubmit={onSubmit}>
			<MultiSignatureRegistrationForm.component
				profile={profile}
				activeTab={activeTab}
				fees={fees}
				wallet={wallet}
			/>
		</Form>
	);

	it("should render form step", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());
		const { asFragment } = render(<Component form={result.current} />);
		await waitForNextUpdate();
		await waitFor(() => expect(screen.queryAllByRole("row")).toHaveLength(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should set fee", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());
		result.current.register("fee");
		result.current.register("inputFeeViewType");

		const { rerender } = render(<Component form={result.current} />);
		await waitForNextUpdate();

		fireEvent.click(screen.getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));

		rerender(<Component form={result.current} />);

		await waitFor(() => expect(screen.getByTestId("InputCurrency")).toBeVisible());

		fireEvent.change(screen.getByTestId("InputCurrency"), {
			target: {
				value: "9",
			},
		});

		await waitFor(() => expect(screen.getByTestId("InputCurrency")).toHaveValue("9"));
	});

	it("should fill form", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());
		result.current.register("fee");
		result.current.register("participants");

		const { rerender } = render(<Component form={result.current} />);
		await waitForNextUpdate();

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.FEES.AVERAGE));
		});

		act(() => {
			fireEvent.input(screen.getByTestId("MultiSignatureRegistrationForm__min-participants"), {
				target: {
					value: 3,
				},
			});
		});

		await waitForNextUpdate();
		await waitFor(() => expect(result.current.getValues("fee")).toBe("1.354"));
		await waitFor(() => expect(result.current.getValues("minParticipants")).toBe("3"));

		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: wallet2.address(),
			},
		});

		fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));

		rerender(<Component form={result.current} />);

		await waitFor(() => expect(result.current.getValues("minParticipants")).toBe("3"));
		await waitFor(() =>
			expect(result.current.getValues("participants")).toEqual([
				{
					address: wallet.address(),
					publicKey: wallet.publicKey(),
				},
				{
					address: wallet2.address(),
					publicKey: wallet2.publicKey(),
				},
			]),
		);
	});

	it("should render review step", () => {
		const { result } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: fees.avg,
					participants: [
						{
							address: wallet.address(),
							publicKey: wallet.publicKey()!,
						},
						{
							address: wallet2.address(),
							publicKey: wallet2.publicKey()!,
						},
					],
					minParticipants: 2,
				},
			}),
		);

		const { asFragment } = render(<Component activeTab={2} form={result.current} />);

		expect(screen.getByText(transactionTranslations.MULTISIGNATURE.PARTICIPANTS)).toBeInTheDocument();
		expect(screen.getByText(transactionTranslations.MULTISIGNATURE.MIN_SIGNATURES)).toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render transaction details", async () => {
		const DetailsComponent = () => {
			const { t } = useTranslation();
			return (
				<MultiSignatureRegistrationForm.transactionDetails
					translations={t}
					transaction={transaction}
					wallet={wallet}
				/>
			);
		};
		const transaction = {
			id: () => multiSignatureFixture.data.id,
			sender: () => multiSignatureFixture.data.sender,
			recipient: () => multiSignatureFixture.data.recipient,
			amount: () => BigNumber.make(multiSignatureFixture.data.amount),
			fee: () => BigNumber.make(multiSignatureFixture.data.fee),
			data: () => multiSignatureFixture.data,
		} as Contracts.SignedTransactionData;
		const { asFragment } = render(<DetailsComponent />);

		await waitFor(() => expect(screen.getAllByTestId("TransactionDetail")).toHaveLength(3));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should sign transaction", async () => {
		const form = {
			clearErrors: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				minParticipants: 2,
				participants: [
					{
						address: wallet.address(),
						publicKey: wallet.publicKey()!,
					},
					{
						address: wallet2.address(),
						publicKey: wallet2.publicKey()!,
					},
				],
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const signMock = jest
			.spyOn(wallet.transaction(), "signMultiSignature")
			.mockReturnValue(Promise.resolve(multiSignatureFixture.data.id));
		const addSignatureMock = jest.spyOn(wallet.transaction(), "addSignature").mockImplementation();
		const broadcastMock = jest
			.spyOn(wallet.transaction(), "broadcast")
			.mockResolvedValue({ accepted: ["id"], rejected: [], errors: {} });
		const transactionMock = createTransactionMock(wallet);

		await MultiSignatureRegistrationForm.signTransaction({
			env,
			form,
			profile,
		});

		expect(signMock).toHaveBeenCalled();
		expect(addSignatureMock).toHaveBeenCalled();
		expect(broadcastMock).toHaveBeenCalled();
		expect(transactionMock).toHaveBeenCalled();

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should error if signing fails", async () => {
		const form = {
			clearErrors: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				minParticipants: 2,
				participants: [
					{
						address: wallet.address(),
						publicKey: wallet.publicKey()!,
					},
					{
						address: wallet2.address(),
						publicKey: wallet2.publicKey()!,
					},
				],
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => void 0);
		const signMock = jest.spyOn(wallet.transaction(), "signMultiSignature").mockImplementation(() => {
			throw new Error("Signing failed");
		});
		const transactionMock = createTransactionMock(wallet);

		try {
			await MultiSignatureRegistrationForm.signTransaction({
				env,
				form,
				profile,
			});
			// eslint-disable-next-line
		} catch (error) {}

		await waitFor(() => expect(signMock).toThrow());
		expect(transactionMock).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
		signMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should sign transaction using encryption password", async () => {
		const walletUsesWIFMock = jest.spyOn(wallet.wif(), "exists").mockReturnValue(true);
		const walletWifMock = jest.spyOn(wallet.wif(), "get").mockImplementation(() => {
			const wif = "S9rDfiJ2ar4DpWAQuaXECPTJHfTZ3XjCPv15gjxu4cHJZKzABPyV";
			return Promise.resolve(wif);
		});

		const form = {
			clearErrors: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				minParticipants: 2,
				participants: [
					{
						address: wallet.address(),
						publicKey: wallet.publicKey()!,
					},
					{
						address: wallet2.address(),
						publicKey: wallet2.publicKey()!,
					},
				],
				encryptionPassword: "password",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const signMock = jest
			.spyOn(wallet.transaction(), "signMultiSignature")
			.mockReturnValue(Promise.resolve(multiSignatureFixture.data.id));
		const addSignatureMock = jest.spyOn(wallet.transaction(), "addSignature").mockImplementation();
		const broadcastMock = jest
			.spyOn(wallet.transaction(), "broadcast")
			.mockResolvedValue({ accepted: ["id"], rejected: [], errors: {} });
		const transactionMock = createTransactionMock(wallet);

		await MultiSignatureRegistrationForm.signTransaction({
			env,
			form,
			profile,
		});

		expect(signMock).toHaveBeenCalled();
		expect(addSignatureMock).toHaveBeenCalled();
		expect(broadcastMock).toHaveBeenCalled();
		expect(transactionMock).toHaveBeenCalled();

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
		walletUsesWIFMock.mockRestore();
		walletWifMock.mockRestore();
	});
});
