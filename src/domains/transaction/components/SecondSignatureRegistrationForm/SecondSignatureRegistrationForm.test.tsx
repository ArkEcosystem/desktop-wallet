import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import businessRegistrationFixture from "tests/fixtures/coins/ark/transactions/second-signature-registration.json";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { SecondSignatureRegistrationForm } from "./SecondSignatureRegistrationForm";

describe("SecondSignatureRegistrationForm", () => {
	const passphrase = "power return attend drink piece found tragic fire liar page disease combine";
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let feeOptions: Record<string, string>;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		feeOptions = {
			last: (2 * 1e8).toFixed(0),
			min: "0",
			max: (10 * 1e8).toFixed(0),
			average: (1.354 * 1e8).toFixed(0),
		};
	});

	const createTransactionMock = (wallet: ReadWriteWallet) =>
		// @ts-ignore
		jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
			id: () => businessRegistrationFixture.data.id,
			sender: () => businessRegistrationFixture.data.sender,
			recipient: () => businessRegistrationFixture.data.recipient,
			amount: () => BigNumber.make(businessRegistrationFixture.data.amount),
			fee: () => BigNumber.make(businessRegistrationFixture.data.fee),
			data: () => businessRegistrationFixture.data,
		});

	const Component = ({
		form,
		onSubmit,
		activeTab = 2,
	}: {
		form: ReturnType<typeof useForm>;
		onSubmit: () => void;
		activeTab?: number;
	}) => (
		<Form context={form} onSubmit={onSubmit}>
			<SecondSignatureRegistrationForm.component activeTab={activeTab} feeOptions={feeOptions} wallet={wallet} />
		</Form>
	);

	it("should render generation step", async () => {
		const { result } = renderHook(() => useForm());
		const passphrase = "mock bip39 passphrase";
		const bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);

		const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} activeTab={2} />);

		await waitFor(() => expect(result.current.getValues("secondMnemonic")).toEqual(passphrase));
		await waitFor(() => expect(screen.getByTestId("SecondSignatureRegistrationForm__generation-step")));

		expect(asFragment()).toMatchSnapshot();
		bip39GenerateMock.mockRestore();
	});

	it("should set fee", async () => {
		const { result } = renderHook(() => useForm());
		result.current.register("fee");

		render(<Component form={result.current} onSubmit={() => void 0} />);

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.FEES.AVERAGE));
		});

		await waitFor(() => expect(result.current.getValues("fee")).toBe("135400000"));
	});

	it("should render backup step", async () => {
		const { result } = renderHook(() =>
			useForm({
				defaultValues: {
					secondMnemonic: "test mnemonic",
				},
			}),
		);
		const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} activeTab={3} />);

		await waitFor(() => expect(screen.getByTestId("SecondSignature__backup-step")).toBeTruthy());

		const writeTextMock = jest.fn();
		const clipboardOriginal = navigator.clipboard;
		// @ts-ignore
		navigator.clipboard = { writeText: writeTextMock };

		act(() => {
			fireEvent.click(screen.getByTestId(`SecondSignature__copy`));
		});

		await waitFor(() => expect(writeTextMock).toHaveBeenCalledWith("test mnemonic"));

		// @ts-ignore
		navigator.clipboard = clipboardOriginal;
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render verification step", async () => {
		const { result, waitForNextUpdate } = renderHook(() =>
			useForm({
				defaultValues: {
					secondMnemonic: passphrase,
				},
			}),
		);

		render(<Component form={result.current} onSubmit={() => void 0} activeTab={4} />);

		await waitFor(() => expect(screen.getByTestId("SecondSignature__confirmation-step")).toBeTruthy());
		expect(result.current.getValues("verification")).toBeUndefined();

		const walletMnemonic = passphrase.split(" ");

		for (let i = 0; i < 3; i++) {
			const wordNumber = parseInt(screen.getByText(/Select word #/).innerHTML.replace(/Select word #/, ""));

			act(() => {
				fireEvent.click(screen.getByText(walletMnemonic[wordNumber - 1]));
			});

			if (i < 2) {
				await waitFor(() => expect(screen.queryAllByText(/The #([0-9]+) word/).length === 2 - i));
			}
		}

		await waitForNextUpdate();
		await waitFor(() => expect(result.current.getValues("verification")).toBe(true));
	});

	it("should sign transaction", async () => {
		const form = {
			clearError: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				secondMnemonic: "second sample passphrase",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const handleNext = jest.fn();
		const setTransaction = jest.fn();

		const signMock = jest
			.spyOn(wallet.transaction(), "signSecondSignature")
			.mockReturnValue(Promise.resolve(businessRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await SecondSignatureRegistrationForm.signTransaction({
			env,
			form,
			handleNext,
			profile,
			setTransaction,
		});

		expect(signMock).toHaveBeenCalled();
		expect(broadcastMock).toHaveBeenCalled();
		expect(transactionMock).toHaveBeenCalled();
		expect(setTransaction).toHaveBeenCalled();
		expect(handleNext).toHaveBeenCalled();

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should error if signing fails", async () => {
		const form = {
			clearError: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				secondMnemonic: "second sample passphrase",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const handleNext = jest.fn();
		const setTransaction = jest.fn();
		const translations = jest.fn((translation) => translation);

		const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => void 0);
		const signMock = jest.spyOn(wallet.transaction(), "signIpfs").mockImplementation(() => {
			throw new Error("Signing failed");
		});
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await SecondSignatureRegistrationForm.signTransaction({
			env,
			form,
			handleNext,
			profile,
			setTransaction,
			translations,
		});

		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(form.setValue).toHaveBeenCalledWith("mnemonic", "");
		expect(form.setError).toHaveBeenCalledWith("mnemonic", "manual", "TRANSACTION.INVALID_MNEMONIC");

		expect(broadcastMock).not.toHaveBeenCalled();
		expect(transactionMock).not.toHaveBeenCalled();
		expect(setTransaction).not.toHaveBeenCalled();
		expect(handleNext).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});
});
