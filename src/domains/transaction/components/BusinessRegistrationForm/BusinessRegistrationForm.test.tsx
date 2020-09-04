import { Contracts } from "@arkecosystem/platform-sdk";
import { File } from "@arkecosystem/platform-sdk-ipfs";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import nock from "nock";
import React from "react";
import { useForm } from "react-hook-form";
import businessRegistrationFixture from "tests/fixtures/coins/ark/transactions/entity-registration.json";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { BusinessRegistrationForm } from "./BusinessRegistrationForm";

describe("BusinessRegistrationForm", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let feeOptions: Record<string, string>;

	const ipfsForm = {
		meta: {
			displayName: "Test Entity Name",
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
		const ipfsData = businessRegistrationFixture.data.asset.data.ipfsData;
		nock("https://platform.ark.io/api")
			.post("/ipfs")
			.reply(200, { data: { hash: ipfsData } })
			.get("/ipfs")
			.reply(200, { data: ipfsForm });
	});

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
		onSubmit = () => void 0,
		activeTab = 2,
	}: {
		form: ReturnType<typeof useForm>;
		onSubmit?: () => void;
		activeTab?: number;
	}) => (
		<Form context={form} onSubmit={onSubmit}>
			<BusinessRegistrationForm.component activeTab={activeTab} feeOptions={feeOptions} wallet={wallet} />
		</Form>
	);

	it("should render 2nd step", async () => {
		const { result } = renderHook(() => useForm());
		const { asFragment } = render(<Component form={result.current} />);

		await waitFor(() => expect(screen.getByTestId("BusinessRegistrationForm__step--second")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { result } = renderHook(() =>
			useForm({
				defaultValues: {
					ipfsData: ipfsForm,
				},
			}),
		);
		const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} activeTab={3} />);

		await waitFor(() => expect(screen.getByTestId("BusinessRegistrationForm__step--third")).toBeTruthy());
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

		await waitFor(() => expect(screen.getByTestId("BusinessRegistrationForm__step--third")).toBeTruthy());
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
		const { result } = renderHook(() => useForm());
		result.current.register("fee");

		render(<Component form={result.current} onSubmit={() => void 0} />);

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.FEES.AVERAGE));
		});

		await waitFor(() => expect(result.current.getValues("fee")).toBe("135400000"));
	});

	it("should fill data", async () => {
		const { result } = renderHook(() => useForm());
		const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} />);

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__name"), {
				target: {
					value: "Test Entity Name",
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

		const addLink = async (headerTitle: string, optionLabel: string, inputValue: string) => {
			const headerElement = screen.getByText(headerTitle, {
				selector: "[data-testid=LinkCollection__header] > span",
			});
			act(() => {
				fireEvent.click(headerElement);
			});

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

			act(() => {
				fireEvent.click(headerElement);
			});
		};

		// Add source control link
		await addLink("Repository", "GitHub", "https://github.com/test");
		// Add source media link
		await addLink("Social Media", "Facebook", "https://facebook.com/test");
		await addLink("Social Media", "Instagram", "https://instagram.com/test");
		// Add media link
		await addLink("Photo and Video", "Imgur", "https://i.imgur.com/123456.png");
		await addLink("Photo and Video", "YouTube", "https://youtube.com/watch?v=123456");

		await waitFor(() =>
			expect(result.current.getValues({ nest: true })).toEqual({
				ipfsData: {
					meta: {
						displayName: "Test Entity Name",
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
				},
			}),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should go to next step with form data", () => {
		const { result } = renderHook(() => useForm());

		const { rerender, asFragment } = render(<Component form={result.current} activeTab={2} />);

		act(() => {
			fireEvent.input(screen.getByTestId("BusinessRegistrationForm__name"), {
				target: {
					value: "Test Entity Name",
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

		rerender(<Component form={result.current} activeTab={3} />);

		expect(screen.getByText("https://test-step.entity.com")).toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should output transaction details", () => {
		const translations = jest.fn((translation) => translation);
		const transaction = {
			id: () => businessRegistrationFixture.data.id,
			sender: () => businessRegistrationFixture.data.sender,
			recipient: () => businessRegistrationFixture.data.recipient,
			amount: () => BigNumber.make(businessRegistrationFixture.data.amount),
			fee: () => BigNumber.make(businessRegistrationFixture.data.fee),
			data: () => businessRegistrationFixture.data,
		} as Contracts.SignedTransactionData;

		render(<BusinessRegistrationForm.transactionDetails transaction={transaction} translations={translations} />);

		expect(screen.getByText(businessRegistrationFixture.data.asset.data.ipfsData)).toBeInTheDocument();
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
			.mockReturnValue(Promise.resolve(businessRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await BusinessRegistrationForm.signTransaction({
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

	it("should sanitize data before sign", async () => {
		const form = {
			clearError: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				ipfsData: {
					meta: {
						displayName: "Test Entity Name",
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
			.mockReturnValue(Promise.resolve(businessRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await BusinessRegistrationForm.signTransaction({
			env,
			form,
			handleNext,
			profile,
			setTransaction,
		});

		expect(fileUploadSpy).toHaveBeenCalledWith({
			meta: {
				displayName: "Test Entity Name",
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
		const ipfsData = businessRegistrationFixture.data.asset.data.ipfsData;
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

		await BusinessRegistrationForm.signTransaction({
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
