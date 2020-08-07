/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import nock from "nock";
import React from "react";
import { useForm } from "react-hook-form";
import { defaultNetMocks, env, fireEvent, getDefaultProfileId, render, waitFor, within } from "testing-library";

import { SendTransactionForm } from "./";

let profile: Profile;

const renderPage = () => {
	const { result: form } = renderHook(() => useForm());

	form.current.register("network", { required: true });
	form.current.register("recipients", {
		required: true,
		validate: (value) => Array.isArray(value) && value.length > 0,
	});
	form.current.register("senderAddress", { required: true });
	form.current.register("fee", { required: true });
	form.current.register("smartbridge");

	return {
		form: form.current,
		rendered: render(
			<Form context={form.current}>
				<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
			</Form>,
		),
	};
};

describe("SendTransactionForm", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	beforeEach(() => {
		defaultNetMocks();
	});

	afterEach(() => {
		nock.cleanAll();
	});

	it("should render", async () => {
		const { rendered } = renderPage();

		await waitFor(() => expect(rendered.container).toMatchSnapshot());
	});

	it("should select fill out form", async () => {
		const { form, rendered } = renderPage();
		const { getByTestId, getAllByTestId, rerender } = rendered;

		// Select network
		const networkIcons = getAllByTestId("SelectNetwork__NetworkIcon--container");
		await act(async () => fireEvent.click(networkIcons[1]));
		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-devnet")).toHaveClass("border-theme-success-200"));
		await waitFor(() => expect(form.getValues("network")).toBeTruthy());
		await waitFor(() =>
			expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper")).not.toHaveAttribute(
				"disabled",
			),
		);

		// Select sender & update fees
		await act(async () =>
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper")),
		);
		await waitFor(() => expect(() => expect(getByTestId("modal__inner")).toBeTruthy()));

		await act(async () => fireEvent.click(getByTestId("AddressListItem__select-0")));
		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));

		await waitFor(() => expect(form.getValues("senderAddress")).toBeTruthy());
		await waitFor(() =>
			expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__input")).toHaveValue(
				profile.wallets().values()[0].address(),
			),
		);

		await act(async () =>
			rerender(
				<Form context={form}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</Form>,
			),
		);

		// Select recipient
		await act(async () =>
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-contact")),
		);
		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		await act(async () => fireEvent.click(getAllByTestId("ContactListItem__one-option-button-0")[0]));
		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});

		expect(getByTestId("SelectRecipient__input")).toHaveValue(
			profile.contacts().values()[0].addresses().values()[0].address(),
		);

		// Amount
		await act(async () => fireEvent.click(getByTestId("add-recipient__send-all")));
		await waitFor(() => expect(getByTestId("add-recipient__amount-input")).toHaveValue(80));

		// Smartbridge
		await act(async () =>
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } }),
		);
		await waitFor(() => expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge"));

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0"));
		const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
		await act(async () => fireEvent.click(feeOptions[2]));
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(rendered.container).toMatchSnapshot());
	});

	it("should only update fees if provided", async () => {
		const { form, rendered } = renderPage();
		const { getByTestId, getAllByTestId, rerender } = rendered;

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		// Select network
		const networkIcons = getAllByTestId("SelectNetwork__NetworkIcon--container");
		await act(async () => fireEvent.click(networkIcons[1]));
		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-devnet")).toHaveClass("border-theme-success-200"));
		await waitFor(() => expect(form.getValues("network")).toBeTruthy());
		await waitFor(() =>
			expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper")).not.toHaveAttribute(
				"disabled",
			),
		);

		// Select sender & try to update fees
		nock.cleanAll();

		nock("https://dwallets.ark.io")
			.get("/api/node/fees")
			.query(true)
			.reply(500, {})
			.get("/api/transactions/fees")
			.reply(500, {})
			.persist();

		await act(async () =>
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper")),
		);
		await waitFor(() => expect(() => expect(getByTestId("modal__inner")).toBeTruthy()));

		await act(async () => fireEvent.click(getByTestId("AddressListItem__select-0")));
		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));

		await waitFor(() => expect(form.getValues("senderAddress")).toBeTruthy());
		await waitFor(() =>
			expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__input")).toHaveValue(
				profile.wallets().values()[0].address(),
			),
		);

		await act(async () =>
			rerender(
				<Form context={form}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</Form>,
			),
		);

		await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(rendered.container).toMatchSnapshot());
	});
});
