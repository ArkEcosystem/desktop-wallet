import { Contracts } from "@arkecosystem/platform-sdk";
import { File } from "@arkecosystem/platform-sdk-ipfs";
import { Enums, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import nock from "nock";
import React from "react";
import { useForm } from "react-hook-form";
import entityRegistrationFixture from "tests/fixtures/coins/ark/transactions/entity-registration.json";
import {  env,  getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { EntityRegistrationForm } from "./EntityRegistrationForm";

describe("EntityRegistrationForm", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let fees: Contracts.TransactionFee;

	const formDefaultValues = {
		fees: {
			static: "5",
			min: "0",
			max: (10 * 1e8).toFixed(0),
			avg: (1.354 * 1e8).toFixed(0),
		},
		fee: 0,
	};
	const ipfsForm = {
		meta: {
			displayName: "Test Entity Display Name",
			description: "Test Entity Description",
			website: "https://test.entity.com",
		},
		sourceControl: [
			{
				type: "github",
				value: "https://github.com/test",
			},
		],
		socialMedia: [
			{
				type: "facebook",
				value: "https://facebook.com/test",
			},
			{
				type: "instagram",
				value: "https://instagram.com/test",
			},
		],
		images: [
			{
				type: "image",
				value: "https://i.imgur.com/123456.png",
			},
		],
		videos: [
			{
				type: "video",
				value: "https://youtube.com/watch?v=123456",
			},
		],
	};

	beforeEach(() => {
		const ipfsData = entityRegistrationFixture.data.asset.data.ipfsData;
		nock("https://platform.ark.io/api")
			.post("/ipfs")
			.reply(200, { data: { hash: ipfsData } })
			.get("/ipfs")
			.reply(200, { data: ipfsForm });
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		fees = {
			static: "5",
			min: "0",
			max: (10 * 1e8).toFixed(0),
			avg: (1.354 * 1e8).toFixed(0),
		};
	});

	const createTransactionMock = (wallet: ReadWriteWallet) =>
		// @ts-ignore
		jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
			id: () => entityRegistrationFixture.data.id,
			sender: () => entityRegistrationFixture.data.sender,
			recipient: () => entityRegistrationFixture.data.recipient,
			amount: () => BigNumber.make(entityRegistrationFixture.data.amount),
			fee: () => BigNumber.make(entityRegistrationFixture.data.fee),
			data: () => entityRegistrationFixture.data,
		});

	const Component = ({
		form,
		onSubmit = () => void 0,
		activeTab = 2,
	}: {
		form: ReturnType<typeof useForm>;
		onSubmit?: () => void;
		activeTab?: number;
	}) => (
		<Form context={form} onSubmit={onSubmit}>
			<EntityRegistrationForm.component activeTab={activeTab} fees={fees} wallet={wallet} />
		</Form>
	);

	it("should render 3rd step", async () => {
		const { result } = renderHook(() =>
			useForm({
				defaultValues: {
					ipfsData: ipfsForm,
				},
			}),
		);
		const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} activeTab={3} />);

		await waitFor(() => expect(screen.getByTestId("ReviewStep")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step without unknown providers", async () => {
		const { result } = renderHook(() =>
			useForm({
				defaultValues: {
					ipfsData: {
						...ipfsForm,
						images: [
							{
								type: "image",
								value: "https://test.com",
							},
						],
					},
				},
			}),
		);

		const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} activeTab={3} />);

		await waitFor(() => expect(screen.getByTestId("ReviewStep")).toBeTruthy());
		expect(screen.getByText(ipfsForm.meta.displayName)).toBeInTheDocument();
		expect(screen.getByText(ipfsForm.meta.description)).toBeInTheDocument();
		expect(screen.getByText(ipfsForm.meta.website)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step without images", async () => {
		const { result } = renderHook(() =>
			useForm({
				defaultValues: {
					ipfsData: {
						...ipfsForm,
						images: undefined,
					},
				},
			}),
		);
		const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} activeTab={3} />);

		await waitFor(() => expect(screen.getByTestId("ReviewStep")).toBeTruthy());
		expect(screen.getByText(ipfsForm.meta.displayName)).toBeInTheDocument();
		expect(screen.getByText(ipfsForm.meta.description)).toBeInTheDocument();
		expect(screen.getByText(ipfsForm.meta.website)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step without videos", async () => {
		const { result } = renderHook(() =>
			useForm({
				defaultValues: {
					ipfsData: {
						...ipfsForm,
						videos: undefined,
					},
				},
			}),
		);
		const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} activeTab={3} />);

		await waitFor(() => expect(screen.getByTestId("ReviewStep")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should output transaction details", () => {
		const translations = jest.fn((translation) => translation);
		const transaction = {
			id: () => entityRegistrationFixture.data.id,
			sender: () => entityRegistrationFixture.data.sender,
			recipient: () => entityRegistrationFixture.data.recipient,
			amount: () => BigNumber.make(entityRegistrationFixture.data.amount),
			fee: () => BigNumber.make(entityRegistrationFixture.data.fee),
			data: () => entityRegistrationFixture.data,
		} as Contracts.SignedTransactionData;

		render(<EntityRegistrationForm.transactionDetails transaction={transaction} translations={translations} />);

		expect(screen.getByText(entityRegistrationFixture.data.asset.data.ipfsData)).toBeInTheDocument();
	});

	it("should sign transaction", async () => {
		const form = {
			clearError: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				ipfsData: ipfsForm,
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const handleNext = jest.fn();
		const setTransaction = jest.fn();

		const signMock = jest
			.spyOn(wallet.transaction(), "signEntityRegistration")
			.mockReturnValue(Promise.resolve(entityRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await EntityRegistrationForm.signTransaction({
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

	it("should sign transaction with a custom entity type", async () => {
		const form = {
			clearError: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				ipfsData: ipfsForm,
				entityName: "Test-Entity-Name",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const handleNext = jest.fn();
		const setTransaction = jest.fn();

		const signMock = jest
			.spyOn(wallet.transaction(), "signEntityRegistration")
			.mockReturnValue(Promise.resolve(entityRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await EntityRegistrationForm.signTransaction({
			env,
			form,
			handleNext,
			profile,
			setTransaction,
			type: Enums.EntityType.Developer,
		});

		expect(signMock).toHaveBeenCalledWith({
			fee: "1",
			data: {
				ipfs: "QmV1n5F9PuBE2ovW9jVfFpxyvWZxYHjSdfLrYL2nDcb1gW",
				name: "Test-Entity-Name",
				subType: 0,
				type: 2,
			},
			from: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			sign: {
				mnemonic: "sample passphrase",
			},
		});
		expect(broadcastMock).toHaveBeenCalled();
		expect(transactionMock).toHaveBeenCalled();
		expect(setTransaction).toHaveBeenCalled();
		expect(handleNext).toHaveBeenCalled();

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should sanitize data before sign", async () => {
		const form = {
			clearError: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				entityName: "Test-Entity-Name",
				ipfsData: {
					meta: {
						displayName: "Test Entity Display Name",
					},
					sourceControl: undefined,
					images: [],
					videos: {},
				},
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const handleNext = jest.fn();
		const setTransaction = jest.fn();

		const fileUploadSpy = jest.spyOn(File.prototype, "upload");

		const signMock = jest
			.spyOn(wallet.transaction(), "signEntityRegistration")
			.mockReturnValue(Promise.resolve(entityRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await EntityRegistrationForm.signTransaction({
			env,
			form,
			handleNext,
			profile,
			setTransaction,
		});

		expect(fileUploadSpy).toHaveBeenCalledWith({
			meta: {
				displayName: "Test Entity Display Name",
			},
		});
		expect(signMock).toHaveBeenCalledWith({
			fee: "1",
			data: {
				ipfs: "QmV1n5F9PuBE2ovW9jVfFpxyvWZxYHjSdfLrYL2nDcb1gW",
				name: "Test-Entity-Name",
				subType: 0,
				type: 0,
			},
			from: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			sign: {
				mnemonic: "sample passphrase",
			},
		});
		expect(broadcastMock).toHaveBeenCalled();
		expect(transactionMock).toHaveBeenCalled();
		expect(setTransaction).toHaveBeenCalled();
		expect(handleNext).toHaveBeenCalled();

		fileUploadSpy.mockRestore();
		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should error if signing fails", async () => {
		const ipfsData = entityRegistrationFixture.data.asset.data.ipfsData;
		const form = {
			clearError: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				ipfsData,
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const handleNext = jest.fn();
		const setTransaction = jest.fn();
		const translations = jest.fn((translation) => translation);

		const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => void 0);
		const signMock = jest.spyOn(wallet.transaction(), "signEntityRegistration").mockImplementation(() => {
			throw new Error("Signing failed");
		});
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await EntityRegistrationForm.signTransaction({
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
