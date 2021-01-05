import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import multiSignatureFixture from "tests/fixtures/coins/ark/devnet/transactions/multisignature-registration.json";
import { act, env, fireEvent, getDefaultProfileId, render, screen, syncFees, waitFor } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { MultiSignatureRegistrationForm } from "./MultiSignatureRegistrationForm";

describe("MultiSignature Registration Form", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let wallet2: ReadWriteWallet;
	let fees: Contracts.TransactionFee;

	const createTransactionMock = (wallet: ReadWriteWallet) =>
		// @ts-ignore
		jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
			id: () => multiSignatureFixture.data.id,
			sender: () => multiSignatureFixture.data.sender,
			recipient: () => multiSignatureFixture.data.recipient,
			amount: () => BigNumber.make(multiSignatureFixture.data.amount),
			fee: () => BigNumber.make(multiSignatureFixture.data.fee),
			data: () => multiSignatureFixture.data,
		});

	beforeAll(async () => {
		await syncFees();
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		wallet2 = profile.wallets().last();
		fees = {
			static: "0",
			min: "0",
			max: (10 * 1e8).toFixed(0),
			avg: (1.354 * 1e8).toFixed(0),
		};
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

	it("should fill form", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());
		result.current.register("fee");

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
		await waitFor(() => expect(result.current.getValues("fee")).toBe("135400000"));
		await waitFor(() => expect(result.current.getValues("minParticipants")).toBe("3"));

		rerender(<Component form={result.current} />);

		await waitFor(() => expect(result.current.getValues("minParticipants")).toBe("3"));
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
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
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
});
