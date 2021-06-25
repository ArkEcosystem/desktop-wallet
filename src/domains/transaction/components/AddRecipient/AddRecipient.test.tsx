/* eslint-disable @typescript-eslint/require-await */
import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import userEvent from "@testing-library/user-event";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { env, fireEvent, getDefaultProfileId, render, screen, waitFor, within } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { AddRecipient } from "./AddRecipient";

let profile: Contracts.IProfile;
let wallet: Contracts.IReadWriteWallet;
let network: Networks.Network;

const renderWithFormProvider = async (children: any, defaultValues?: any) => {
	let rendered: any;

	const { result: form, waitForNextUpdate } = renderHook(() =>
		useForm({
			mode: "onChange",
			shouldUnregister: false,
			defaultValues: {
				...{ senderAddress: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD", network, fee: 0 },
				...defaultValues,
			},
		}),
	);

	await act(async () => {
		rendered = render(<FormProvider {...form.current}>{children}</FormProvider>);
	});

	return { ...rendered, form, waitForNextUpdate };
};

describe("AddRecipient", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findByAddress("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD");
		network = wallet.network();
	});

	it("should render", async () => {
		const { container } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" />,
		);

		// await waitFor(() => expect(getByTestId("SelectDropdown__input")).toHaveValue(""));
		expect(container).toMatchSnapshot();
	});

	it("should render without recipients", async () => {
		const { container } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} recipients={undefined} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render with single recipient data", async () => {
		const values = {
			displayAmount: "1",
			amount: "1",
			recipientAddress: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
		};

		const { getByTestId, container } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} />,
			values,
		);

		await waitFor(() => {
			expect(getByTestId("AddRecipient__amount")).toHaveValue("1");
			expect(getByTestId("SelectDropdown__input")).toHaveValue("D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
		});

		expect(container).toMatchSnapshot();
	});

	it("should render with multiple recipients switch", async () => {
		const { getByTestId, container } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" showMultiPaymentOption />,
		);

		await waitFor(() => expect(getByTestId("SelectDropdown__input")).toHaveValue(""));
		expect(container).toMatchSnapshot();
	});

	it("should render without the single & multiple switch", async () => {
		const { container } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" showMultiPaymentOption={false} />,
		);

		expect(container).toMatchSnapshot();
	});

	it("should set amount", async () => {
		const onChange = jest.fn();

		const { getByTestId, form } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" onChange={onChange} />,
		);

		await act(async () => {
			fireEvent.input(getByTestId("AddRecipient__amount"), {
				target: {
					value: "1",
				},
			});

			fireEvent.input(getByTestId("SelectDropdown__input"), {
				target: {
					value: "bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT",
				},
			});
		});

		await waitFor(() => {
			expect(form.current.getValues("amount")).toEqual("1");
			expect(getByTestId("SelectDropdown__input")).toHaveValue("bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT");
			expect(onChange).toHaveBeenCalledWith([
				{ amount: expect.any(Number), address: "bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" },
			]);
		});
	});

	it("should select recipient", async () => {
		const { getByTestId, getAllByTestId } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		await act(async () => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		const firstAddress = getAllByTestId("RecipientListItem__select-button")[0];
		await act(async () => {
			fireEvent.click(firstAddress);
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		const selectedAddressValue = profile.wallets().first().address();
		expect(getByTestId("SelectDropdown__input")).toHaveValue(selectedAddressValue);
	});

	it("should set available amount", async () => {
		const { getByTestId, container, form } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" />,
		);

		const sendAll = getByTestId("AddRecipient__send-all");
		await act(async () => {
			fireEvent.click(sendAll);
		});

		await waitFor(() => expect(form.current.getValues("amount")).toEqual(wallet.balance()));
		expect(container).toMatchSnapshot();
	});

	it("should show zero amount if wallet has zero or insufficient balance", async () => {
		const emptyProfile = env.profiles().create("Empty");

		const emptyWallet = await emptyProfile.walletFactory().fromMnemonicWithBIP39({
			mnemonic: "test test",
			coin: "ARK",
			network: "ark.devnet",
		});

		emptyProfile.wallets().push(emptyWallet);

		const { getByTestId, container, form } = await renderWithFormProvider(
			<AddRecipient profile={emptyProfile} wallet={emptyWallet} assetSymbol="ARK" />,
		);

		const sendAll = getByTestId("AddRecipient__send-all");
		await act(async () => {
			fireEvent.click(sendAll);
		});

		await waitFor(() => expect(form.current.getValues("amount")).toEqual(0));
		expect(container).toMatchSnapshot();
	});

	it("should toggle between single and multiple recipients", async () => {
		const { getByText, queryByText } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" />,
		);

		const singleButton = getByText(transactionTranslations.SINGLE);
		const multipleButton = getByText(transactionTranslations.MULTIPLE);

		const recipientLabel = "Recipient #1";

		expect(queryByText(recipientLabel)).toBeFalsy();

		await act(async () => {
			fireEvent.click(multipleButton);
		});

		expect(queryByText(recipientLabel)).toBeTruthy();

		await act(async () => {
			fireEvent.click(singleButton);
		});

		expect(queryByText(recipientLabel)).toBeFalsy();
	});

	it("should prevent adding invalid recipient address in multiple type", async () => {
		jest.useFakeTimers();

		const values = {
			displayAmount: "1",
			amount: "1",
			recipientAddress: "bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT",
		};

		let form: ReturnType<typeof useForm>;

		const Component = () => {
			form = useForm({
				mode: "onChange",
				defaultValues: { senderAddress: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD", network, fee: 0 },
				shouldUnregister: false,
			});

			useEffect(() => {
				form.register("network");
				form.register("senderAddress");
			}, []);

			return (
				<FormProvider {...form}>
					<AddRecipient
						profile={profile}
						wallet={wallet}
						assetSymbol="ARK"
						recipients={[
							{
								address: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
								amount: undefined,
							},
							{
								address: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
								amount: 1,
							},
							{
								address: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ay",
								amount: 1,
							},
						]}
					/>
				</FormProvider>
			);
		};
		render(<Component />);

		fireEvent.input(screen.getByTestId("AddRecipient__amount"), {
			target: {
				value: values.displayAmount,
			},
		});

		// Invalid address
		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: values.recipientAddress,
			},
		});

		await waitFor(() => {
			expect(form.getValues("amount")).toEqual(values.amount);
			expect(form.getValues("displayAmount")).toEqual(values.displayAmount);
			expect(screen.getByTestId("AddRecipient__add-button")).toBeTruthy();
			expect(screen.getByTestId("AddRecipient__add-button")).toBeDisabled();
		});

		// Valid address
		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			},
		});

		await waitFor(() => expect(screen.getByTestId("AddRecipient__add-button")).not.toBeDisabled());

		fireEvent.click(screen.getByTestId("AddRecipient__add-button"));

		await waitFor(() => expect(screen.getAllByTestId("recipient-list__recipient-list-item")).toHaveLength(4));
	});

	it("should disable recipient fields if network is not filled", async () => {
		const values = {
			displayAmount: "1",
			network: null,
		};

		const { getByTestId } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" />,
			values,
		);

		await waitFor(() => {
			expect(getByTestId("SelectDropdown__input")).toBeDisabled();
			expect(getByTestId("AddRecipient__amount")).toBeDisabled();
		});
	});

	it("should disable recipient fields if sender address is not filled", async () => {
		const values = {
			displayAmount: "1",
			senderAddress: null,
		};

		const { getByTestId } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" />,
			values,
		);

		await waitFor(() => {
			expect(getByTestId("SelectDropdown__input")).toBeDisabled();
			expect(getByTestId("AddRecipient__amount")).toBeDisabled();
		});
	});

	it("should show error for low balance", async () => {
		const { getByTestId, getAllByTestId, form } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		await act(async () => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getAllByTestId("RecipientListItem__select-button")[0];

		await act(async () => {
			fireEvent.click(firstAddress);
		});

		await act(async () => {
			fireEvent.change(getByTestId("AddRecipient__amount"), {
				target: {
					value: "10000000000",
				},
			});
		});

		await waitFor(() => expect(form.current.formState.errors.amount).toBeDefined());
	});

	it("should show error for zero balance", async () => {
		const mockWalletBalance = jest.spyOn(wallet, "balance").mockReturnValue(0);

		const { getByTestId, getAllByTestId, form } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		await act(async () => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getAllByTestId("RecipientListItem__select-button")[0];

		await act(async () => {
			fireEvent.click(firstAddress);
		});

		await act(async () => {
			fireEvent.change(getByTestId("AddRecipient__amount"), {
				target: {
					value: "0.1",
				},
			});
		});

		await waitFor(() => expect(form.current.formState.errors.amount).toBeDefined());

		mockWalletBalance.mockRestore();
	});

	it("should show error for invalid address", async () => {
		const { getByTestId, getAllByTestId, form } = await renderWithFormProvider(
			<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		await act(async () => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getAllByTestId("RecipientListItem__select-button")[0];
		await act(async () => {
			fireEvent.click(firstAddress);
		});

		await act(async () => {
			fireEvent.change(getByTestId("SelectDropdown__input"), {
				target: {
					value: "abc",
				},
			});
		});

		await waitFor(() => expect(form.current.formState.errors.recipientAddress).toBeDefined());
	});

	it("should remove recipient in multiple tab", async () => {
		const values = {
			displayAmount: "1",
			amount: "1",
			recipientAddress: "DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T",
		};

		let form: ReturnType<typeof useForm>;

		const Component = () => {
			form = useForm({
				mode: "onChange",
				defaultValues: { senderAddress: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD", network, fee: 0 },
			});

			useEffect(() => {
				form.register("network");
				form.register("senderAddress");
			}, []);

			return (
				<FormProvider {...form}>
					<AddRecipient
						profile={profile}
						wallet={wallet}
						assetSymbol="ARK"
						recipients={[
							{
								address: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
								amount: 1,
							},
							{
								address: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ay",
								amount: 1,
							},
						]}
					/>
				</FormProvider>
			);
		};
		render(<Component />);

		fireEvent.input(screen.getByTestId("AddRecipient__amount"), {
			target: {
				value: values.displayAmount,
			},
		});

		await waitFor(() => expect(screen.getAllByTestId("recipient-list__recipient-list-item")).toHaveLength(2));

		const removeButton = within(screen.getAllByTestId("recipient-list__recipient-list-item")[0]).getAllByTestId(
			"recipient-list__remove-recipient",
		);
		expect(removeButton[0]).toBeTruthy();

		fireEvent.click(removeButton[0]);

		await waitFor(() => expect(screen.getAllByTestId("recipient-list__recipient-list-item")).toHaveLength(1));
	});

	it("should not override default values in single tab", async () => {
		const values = {
			displayAmount: "1",
			amount: "1",
			recipientAddress: "DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T",
		};

		let form: ReturnType<typeof useForm>;

		const Component = () => {
			form = useForm({
				mode: "onChange",
				defaultValues: { senderAddress: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD", network, fee: 0, ...values },
			});

			useEffect(() => {
				form.register("network");
				form.register("senderAddress");
			}, []);

			return (
				<FormProvider {...form}>
					<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" recipients={[]} />
				</FormProvider>
			);
		};

		render(<Component />);

		await waitFor(() => expect(screen.getByTestId("AddRecipient__amount")).toHaveValue("1"));
	});

	it("should fill inputs in the single tab if one recipient is added in the multiple tab", async () => {
		const values = {
			amount: 1,
			recipientAddress: "DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T",
		};

		let form: ReturnType<typeof useForm>;

		const Component = () => {
			form = useForm({
				mode: "onChange",
				defaultValues: { senderAddress: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD", network, fee: 0 },
			});

			useEffect(() => {
				form.register("network");
				form.register("senderAddress");
			}, []);

			return (
				<FormProvider {...form}>
					<AddRecipient profile={profile} wallet={wallet} assetSymbol="ARK" recipients={[]} />
				</FormProvider>
			);
		};

		render(<Component />);

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.MULTIPLE));
		});

		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: values.recipientAddress,
			},
		});

		fireEvent.input(screen.getByTestId("AddRecipient__amount"), {
			target: {
				value: values.amount,
			},
		});

		act(() => {
			fireEvent.click(screen.getByTestId("AddRecipient__add-button"));
		});

		await waitFor(() => expect(screen.getAllByTestId("recipient-list__recipient-list-item")).toHaveLength(1));

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.SINGLE));
		});

		await waitFor(() => expect(screen.getByTestId("AddRecipient__amount")).toHaveValue(values.amount.toString()));
	});

	it("should prevent adding more recipients than the coin supports", async () => {
		const mockMultiPaymentRecipients = jest.spyOn(wallet.network(), "multiPaymentRecipients").mockReturnValue(1);

		await renderWithFormProvider(
			<AddRecipient
				recipients={[
					{
						address: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
						amount: 1,
					},
				]}
				profile={profile}
				wallet={wallet}
				assetSymbol="ARK"
			/>,
		);

		await act(async () => {
			userEvent.click(screen.getByText(transactionTranslations.MULTIPLE));
		});

		userEvent.click(screen.getByTestId("SelectRecipient__select-recipient"));

		await waitFor(() => {
			expect(screen.getByTestId("modal__inner")).toBeTruthy();
		});

		const [firstAddress] = screen.getAllByTestId("RecipientListItem__select-button");

		await act(async () => {
			userEvent.click(firstAddress);
		});

		fireEvent.change(screen.getByTestId("AddRecipient__amount"), {
			target: {
				value: "1",
			},
		});

		expect(screen.getByTestId("AddRecipient__add-button")).toBeDisabled();

		mockMultiPaymentRecipients.mockRestore();
	});
});
