/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Contracts as ProfilesContracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import { toasts } from "app/services";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { act } from "react-test-renderer";
import secondSignatureFixture from "tests/fixtures/coins/ark/devnet/transactions/second-signature-registration.json";
import { TransactionFees } from "types";
import * as utils from "utils/electron-utils";
import { env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { SecondSignatureRegistrationForm } from "./SecondSignatureRegistrationForm";

describe("SecondSignatureRegistrationForm", () => {
	const passphrase = "power return attend drink piece found tragic fire liar page disease combine";
	let profile: ProfilesContracts.IProfile;
	let wallet: ProfilesContracts.IReadWriteWallet;
	let fees: TransactionFees;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		fees = {
			min: "0",
			max: "10",
			avg: "1.354",
		};
	});

	const createTransactionMock = (wallet: ProfilesContracts.IReadWriteWallet) =>
		// @ts-ignore
		jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
			id: () => secondSignatureFixture.data.id,
			sender: () => secondSignatureFixture.data.sender,
			recipient: () => secondSignatureFixture.data.recipient,
			amount: () => BigNumber.make(secondSignatureFixture.data.amount),
			fee: () => BigNumber.make(secondSignatureFixture.data.fee),
			data: () => secondSignatureFixture.data,
		});

	const Component = ({
		form,
		onSubmit,
		activeTab = 1,
	}: {
		form: ReturnType<typeof useForm>;
		onSubmit: () => void;
		activeTab?: number;
	}) => (
		<Form context={form} onSubmit={onSubmit}>
			<SecondSignatureRegistrationForm.component
				profile={profile}
				activeTab={activeTab}
				fees={fees}
				wallet={wallet}
			/>
		</Form>
	);

	it("should render generation step", async () => {
		const { result } = renderHook(() => useForm());
		const passphrase = "mock bip39 passphrase";
		const bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);

		act(() => {
			const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} activeTab={1} />);
			expect(asFragment()).toMatchSnapshot();
		});

		await waitFor(() => expect(result.current.getValues("secondMnemonic")).toEqual(passphrase));
		await waitFor(() => expect(screen.getByTestId("SecondSignatureRegistrationForm__generation-step")));

		bip39GenerateMock.mockRestore();
	});

	it("should set fee", async () => {
		const { result } = renderHook(() => useForm());

		result.current.register("fee");
		result.current.register("inputFeeSettings");

		const { rerender } = render(<Component form={result.current} onSubmit={() => void 0} />);

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		});

		rerender(<Component form={result.current} onSubmit={() => void 0} />);

		expect(screen.getByTestId("InputCurrency")).toBeVisible();

		act(() => {
			fireEvent.change(screen.getByTestId("InputCurrency"), {
				target: {
					value: "9",
				},
			});
		});

		expect(screen.getByTestId("InputCurrency")).toHaveValue("9");
	});

	describe("backup step", () => {
		it("should render", async () => {
			const { result } = renderHook(() =>
				useForm({
					defaultValues: {
						secondMnemonic: "test mnemonic",
						wallet: {
							address: () => "address",
						},
					},
				}),
			);
			const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} activeTab={2} />);

			await waitFor(() => expect(screen.getByTestId("SecondSignature__backup-step")).toBeTruthy());

			const writeTextMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;
			// @ts-ignore
			navigator.clipboard = { writeText: writeTextMock };

			act(() => {
				fireEvent.click(screen.getByTestId("SecondSignature__copy"));
			});

			await waitFor(() => expect(writeTextMock).toHaveBeenCalledWith("test mnemonic"));

			// @ts-ignore
			navigator.clipboard = clipboardOriginal;

			expect(asFragment()).toMatchSnapshot();
		});

		it("should show success toast on succesfull download", async () => {
			const { result } = renderHook(() =>
				useForm({
					defaultValues: {
						secondMnemonic: "test mnemonic",
						wallet: {
							address: () => "address",
						},
					},
				}),
			);

			render(<Component form={result.current} onSubmit={() => void 0} activeTab={2} />);

			jest.spyOn(utils, "saveFile").mockResolvedValueOnce("filePath");

			const toastSpy = jest.spyOn(toasts, "success");

			await act(async () => {
				fireEvent.click(screen.getByTestId("SecondSignature__download"));
			});

			expect(toastSpy).toHaveBeenCalled();
			toastSpy.mockRestore();
		});

		it("should not show success toast on cancelled download", async () => {
			const { result } = renderHook(() =>
				useForm({
					defaultValues: {
						secondMnemonic: "test mnemonic",
						wallet: {
							address: () => "address",
						},
					},
				}),
			);

			render(<Component form={result.current} onSubmit={() => void 0} activeTab={2} />);

			jest.spyOn(utils, "saveFile").mockResolvedValueOnce(undefined);

			const toastSpy = jest.spyOn(toasts, "success");

			await act(async () => {
				fireEvent.click(screen.getByTestId("SecondSignature__download"));
			});

			expect(toastSpy).not.toHaveBeenCalled();
			toastSpy.mockRestore();
		});

		it("should show error toast on error", async () => {
			const { result } = renderHook(() =>
				useForm({
					defaultValues: {
						secondMnemonic: "test mnemonic",
						wallet: {
							address: () => "address",
						},
					},
				}),
			);

			render(<Component form={result.current} onSubmit={() => void 0} activeTab={2} />);

			jest.spyOn(utils, "saveFile").mockRejectedValueOnce(new Error("Error"));

			const toastSpy = jest.spyOn(toasts, "error");

			await act(async () => {
				fireEvent.click(screen.getByTestId("SecondSignature__download"));
			});

			expect(toastSpy).toHaveBeenCalled();
			toastSpy.mockRestore();
		});
	});

	it("should render verification step", async () => {
		const { result, waitForNextUpdate } = renderHook(() =>
			useForm({
				defaultValues: {
					secondMnemonic: passphrase,
				},
			}),
		);

		render(<Component form={result.current} onSubmit={() => void 0} activeTab={3} />);

		await waitFor(() => expect(screen.getByTestId("SecondSignature__confirmation-step")).toBeTruthy());
		expect(result.current.getValues("verification")).toBeUndefined();

		const walletMnemonic = passphrase.split(" ");

		for (let i = 0; i < 3; i++) {
			const wordNumber = parseInt(screen.getByText(/Select the/).innerHTML.replace(/Select the/, ""));

			act(() => {
				fireEvent.click(screen.getByText(walletMnemonic[wordNumber - 1]));
			});

			if (i < 2) {
				await waitFor(() => expect(screen.queryAllByText(/The ([0-9]+)/).length === 2 - i));
			}
		}

		await waitForNextUpdate();
		await waitFor(() => expect(result.current.getValues("verification")).toBe(true));
	});

	it("should render review step", async () => {
		const { result } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: "0",
				},
			}),
		);

		render(<Component form={result.current} onSubmit={() => void 0} activeTab={4} />);

		await waitFor(() => expect(screen.getByTestId("SecondSignature__review-step")).toBeTruthy());
	});

	it("should render transaction details", async () => {
		const DetailsComponent = () => {
			const { t } = useTranslation();
			return (
				<SecondSignatureRegistrationForm.transactionDetails
					translations={t}
					transaction={transaction}
					wallet={wallet}
				/>
			);
		};
		const transaction = {
			id: () => secondSignatureFixture.data.id,
			sender: () => secondSignatureFixture.data.sender,
			recipient: () => secondSignatureFixture.data.recipient,
			amount: () => BigNumber.make(secondSignatureFixture.data.amount),
			fee: () => BigNumber.make(secondSignatureFixture.data.fee),
			data: () => secondSignatureFixture.data,
		} as Contracts.SignedTransactionData;
		const { asFragment } = render(<DetailsComponent />);

		await waitFor(() => {
			expect(screen.getByText(transactionTranslations.TRANSACTION_TYPE)).toBeInTheDocument();
			expect(screen.getByText(transactionTranslations.TRANSACTION_TYPES.SECOND_SIGNATURE)).toBeInTheDocument();
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should sign transaction", async () => {
		const form = {
			clearErrors: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				secondMnemonic: "second sample passphrase",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const signMock = jest
			.spyOn(wallet.transaction(), "signSecondSignature")
			.mockReturnValue(Promise.resolve(secondSignatureFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [secondSignatureFixture.data.id],
			rejected: [],
			errors: {},
		});
		const transactionMock = createTransactionMock(wallet);

		await SecondSignatureRegistrationForm.signTransaction({
			env,
			form,
			profile,
		});

		expect(signMock).toHaveBeenCalled();
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
				secondMnemonic: "second sample passphrase",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};

		const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => void 0);
		const signMock = jest.spyOn(wallet.transaction(), "signIpfs").mockImplementation(() => {
			throw new Error("Signing failed");
		});
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [secondSignatureFixture.data.id],
			rejected: [],
			errors: {},
		});
		const transactionMock = createTransactionMock(wallet);

		try {
			await SecondSignatureRegistrationForm.signTransaction({
				env,
				form,
				profile,
			});
			// eslint-disable-next-line
		} catch (error) {}

		await waitFor(() => expect(signMock).toThrow());

		expect(broadcastMock).not.toHaveBeenCalled();
		expect(transactionMock).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
		signMock.mockRestore();
		broadcastMock.mockRestore();
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
				senderAddress: wallet.address(),
				encryptionPassword: "password",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const signMock = jest
			.spyOn(wallet.transaction(), "signSecondSignature")
			.mockReturnValue(Promise.resolve(secondSignatureFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [secondSignatureFixture.data.id],
			rejected: [],
			errors: {},
		});
		const transactionMock = createTransactionMock(wallet);

		await SecondSignatureRegistrationForm.signTransaction({
			env,
			form,
			profile,
		});

		expect(signMock).toHaveBeenCalled();
		expect(broadcastMock).toHaveBeenCalled();
		expect(transactionMock).toHaveBeenCalled();

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
		walletUsesWIFMock.mockRestore();
		walletWifMock.mockRestore();
	});
});
