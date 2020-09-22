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
import { env, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { EntityRegistrationForm } from "./EntityRegistrationForm";

describe("EntityRegistrationForm", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let fees: Contracts.TransactionFee;

	const formDefaultValues = {
		fees: {
			static: (5 * 1e8).toFixed(0),
			min: (1 * 1e8).toFixed(0),
			max: (10 * 1e8).toFixed(0),
			avg: (1.354 * 1e8).toFixed(0),
		},
		fee: (5 * 1e8).toFixed(0),
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

		await waitFor(() => expect(screen.getByTestId("BusinessRegistrationForm__step--third")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should set fee", async () => {
		const { result } = renderHook(() =>
			useForm({
				mode: "onChange",
			}),
		);
		result.current.register("fee");

		render(<Component form={result.current} onSubmit={() => void 0} />);

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.FEES.AVERAGE));
		});

		await waitFor(() => expect(result.current.getValues("fee")).toEqual({ display: "1.354", value: "135400000" }));
	});

	it("should validate url", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());

		const { asFragment, rerender } = render(<Component form={result.current} />);

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__website"), {
				target: {
					value: "wrong url",
				},
			});
		});

		await waitForNextUpdate();
		rerender(<Component form={result.current} />);

		await waitFor(() => expect(screen.getByText(transactionTranslations.INVALID_URL)).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should validate name", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());

		const { asFragment, rerender } = render(<Component form={result.current} />);

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__name"), {
				target: {
					value: "ab",
				},
			});
		});

		await waitForNextUpdate();
		rerender(<Component form={result.current} />);

		await waitFor(() => expect(screen.getByText(transactionTranslations.ENTITY.INVALID_NAME)).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should validate description", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());

		const { asFragment, rerender } = render(<Component form={result.current} />);

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__description"), {
				target: {
					value: "ab",
				},
			});
		});

		await waitForNextUpdate();
		rerender(<Component form={result.current} />);

		await waitFor(() =>
			expect(screen.getByText(transactionTranslations.ENTITY.INVALID_DESCRIPTION)).toBeInTheDocument(),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should fill data", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());
		const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} />);

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__name"), {
				target: {
					value: "Test-Entity-Name",
				},
			});
		});

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__display-name"), {
				target: {
					value: "Test Entity Display Name",
				},
			});
		});

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__description"), {
				target: {
					value: "Test Entity Description",
				},
			});
		});

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__website"), {
				target: {
					value: "https://test.entity.com",
				},
			});
		});

		await waitForNextUpdate();

		const toggleLinkCollectionHeader = (headerTitle: string) => {
			const headerElement = screen.getByText(headerTitle, {
				selector: "[data-testid=LinkCollection__header] > span",
			});

			act(() => {
				fireEvent.click(headerElement);
			});
		};

		const addLink = async (headerTitle: string, optionLabel: string, inputValue: string) => {
			toggleLinkCollectionHeader(headerTitle);

			const selectButton = screen.getByTestId("select-list__toggle-button");

			act(() => {
				fireEvent.click(selectButton);
			});

			act(() => {
				fireEvent.click(screen.getByText(optionLabel), { selector: ["role=option"] });
			});

			await waitFor(() => expect(selectButton).toHaveTextContent(optionLabel));

			act(() => {
				fireEvent.input(screen.getByTestId("LinkCollection__input-link"), {
					target: {
						value: inputValue,
					},
				});
			});

			act(() => {
				fireEvent.click(screen.getByTestId("LinkCollection__add-link"));
			});

			toggleLinkCollectionHeader(headerTitle);
		};

		// Add source control link
		await addLink("Repository", "GitHub", "https://github.com/test");
		// Add source media link
		await addLink("Social Media", "Facebook", "https://facebook.com/test");
		await addLink("Social Media", "Instagram", "https://instagram.com/test");
		// Add media link
		await addLink("Photo and Video", "Imgur", "https://i.imgur.com/123456.png");
		await addLink(
			"Photo and Video",
			"GitHub",
			"https://raw.githubusercontent.com/arkecosystem/plugins/master/images/preview-1.jpg",
		);
		await addLink("Photo and Video", "YouTube", "https://youtube.com/watch?v=123456");

		// Select avatar
		toggleLinkCollectionHeader("Photo and Video");

		act(() => {
			fireEvent.click(screen.getAllByTestId("LinkCollection__selected")[0]);
		});

		toggleLinkCollectionHeader("Photo and Video");

		await waitFor(() =>
			expect(result.current.getValues()).toEqual({
				entityName: "Test-Entity-Name",
				ipfsData: {
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
							type: "logo",
							value: "https://i.imgur.com/123456.png",
						},
						{
							type: "image",
							value: "https://raw.githubusercontent.com/arkecosystem/plugins/master/images/preview-1.jpg",
						},
					],
					videos: [
						{
							type: "video",
							value: "https://youtube.com/watch?v=123456",
						},
					],
				},
			}),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should go to next step with form data", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());

		const { rerender, asFragment } = render(<Component form={result.current} activeTab={2} />);

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__name"), {
				target: {
					value: "Test-Entity-Name",
				},
			});
		});

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__display-name"), {
				target: {
					value: "Test Entity Display Name",
				},
			});
		});

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__description"), {
				target: {
					value: "Test Entity Description",
				},
			});
		});

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__website"), {
				target: {
					value: "https://test-step.entity.com",
				},
			});
		});

		await waitForNextUpdate();

		rerender(<Component form={result.current} activeTab={3} />);

		expect(screen.getByText("https://test-step.entity.com")).toBeInTheDocument();

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
			clearErrors: jest.fn(),
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
			clearErrors: jest.fn(),
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
			clearErrors: jest.fn(),
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
			clearErrors: jest.fn(),
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
		expect(form.setError).toHaveBeenCalledWith("mnemonic", {
			type: "manual",
			message: "TRANSACTION.INVALID_MNEMONIC",
		});

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
