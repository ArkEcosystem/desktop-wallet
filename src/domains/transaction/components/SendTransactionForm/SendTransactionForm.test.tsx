/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import nock from "nock";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { env, fireEvent, getDefaultProfileId, render, waitFor, within } from "testing-library";

import { SendTransactionForm } from "./";

let profile: Profile;

describe("SendTransactionForm", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", async () => {
		let rendered: any;
		const { result: form } = renderHook(() => useForm());

		await act(async () => {
			rendered = render(
				<FormContext {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</FormContext>,
			);
		});

		expect(rendered.container).toMatchSnapshot();
	});

	it("should select fill out form", async () => {
		const { result: form } = renderHook(() => useForm());
		form.current.register("fee");

		let rendered: any;

		await act(async () => {
			rendered = render(
				<FormContext {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</FormContext>,
			);
		});

		const { getByTestId, getAllByTestId } = rendered;

		await act(async () => {
			// Select network
			const networkIcons = getAllByTestId("SelectNetwork__NetworkIcon--container");
			fireEvent.click(networkIcons[1]);
			expect(getByTestId("NetworkIcon-ARK-devnet")).toHaveClass("border-theme-success-200");

			expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper")).not.toHaveAttribute(
				"disabled",
			);

			// Select sender & update fees
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			const firstAddress = getByTestId("AddressListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			await waitFor(() => expect(form.current.getValues("fee")).toEqual("71538139"));

			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-contact"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			fireEvent.click(getAllByTestId("ContactListItem__one-option-button-0")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			// Amount
			fireEvent.click(getByTestId("add-recipient__send-all"));
			expect(getByTestId("add-recipient__amount-input")).toHaveValue(80);

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			expect(getByTestId("InputCurrency")).toHaveValue("0");
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[2]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			expect(rendered.container).toMatchSnapshot();
		});
	});

	it("should only update fees if provided", async () => {
		const onFail = jest.fn();
		const { result: form } = renderHook(() => useForm());
		form.current.register("senderAddress");
		form.current.register("fees");

		let rendered: any;

		await act(async () => {
			rendered = render(
				<FormContext {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} onFail={onFail} />
				</FormContext>,
			);
		});

		const { getByTestId, getAllByTestId } = rendered;

		nock.cleanAll();

		nock("https://dwallets.ark.io")
			.get("/api/node/fees")
			.query(true)
			.reply(500, {})
			.get("/api/transactions/fees")
			.reply(500, {})
			.persist();

		await act(async () => {
			// Select network
			const networkIcons = getAllByTestId("SelectNetwork__NetworkIcon--container");
			fireEvent.click(networkIcons[1]);
			expect(getByTestId("NetworkIcon-ARK-devnet")).toHaveClass("border-theme-success-200");

			expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper")).not.toHaveAttribute(
				"disabled",
			);

			// Select sender & update fees
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			const firstAddress = getByTestId("AddressListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			await waitFor(() => expect(onFail).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(form.current.getValues("fee")).toBeFalsy());

			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-contact"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			fireEvent.click(getAllByTestId("ContactListItem__one-option-button-0")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});
});
