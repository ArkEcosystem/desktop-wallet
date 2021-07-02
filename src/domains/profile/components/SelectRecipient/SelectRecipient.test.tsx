/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { SelectRecipient } from "./SelectRecipient";

let profile: Contracts.IProfile;

describe("SelectRecipient", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render empty", () => {
		const { container } = render(<SelectRecipient profile={profile} />);

		expect(container).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { container } = render(<SelectRecipient profile={profile} disabled />);

		expect(container).toMatchSnapshot();
	});

	it("should render invalid", () => {
		const { container } = render(<SelectRecipient profile={profile} isInvalid />);

		expect(container).toMatchSnapshot();
	});

	it("should render with preselected address", () => {
		const { container } = render(<SelectRecipient profile={profile} />);

		expect(container).toMatchSnapshot();
	});

	it("should update internal state when prop changes", () => {
		const { container, rerender } = render(<SelectRecipient profile={profile} />);

		rerender(<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />);

		expect(container).toMatchSnapshot();
	});

	it("should open and close contacts modal", async () => {
		const { getByTestId } = render(
			<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner").toBeFalsy());
		});
	});

	it("should select address from contacts modal", async () => {
		const { getByTestId, getAllByTestId } = render(
			<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getAllByTestId("RecipientListItem__select-button")[profile.wallets().values().length];
		act(() => {
			fireEvent.click(firstAddress);
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner").toThrow(/Unable to find an element by/));
		});

		await waitFor(() =>
			expect(getByTestId("SelectDropdown__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			),
		);
	});

	it("should not open contacts modal if disabled", async () => {
		const { getByTestId } = render(
			<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" disabled />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner").toThrow(/Unable to find an element by/));
		});
	});

	it("should call onChange prop when entered address in input", async () => {
		const contactsSpy = jest.spyOn(profile.contacts(), "findByAddress").mockReturnValue([]);
		const function_ = jest.fn();
		const { getByTestId } = render(<SelectRecipient profile={profile} onChange={function_} />);
		const address = "bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT";
		const recipientInputField = getByTestId("SelectDropdown__input");

		await act(async () => {
			fireEvent.change(recipientInputField, { target: { value: address } });
		});

		expect(getByTestId("SelectDropdown__input")).toHaveValue(address);
		expect(function_).toBeCalledWith(address);

		contactsSpy.mockRestore();
	});

	it("should call onChange prop if provided", async () => {
		const function_ = jest.fn();

		const { getByTestId, getAllByTestId } = render(
			<SelectRecipient
				profile={profile}
				onChange={function_}
				address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT"
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getAllByTestId("RecipientListItem__select-button")[profile.wallets().values().length];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(() => expect(getByTestId("modal__inner")).toBeFalsy());

		const selectedAddressValue = profile.contacts().values()[0].addresses().values()[0].address();

		expect(getByTestId("SelectDropdown__input")).toHaveValue(selectedAddressValue);
		expect(function_).toBeCalledWith(selectedAddressValue);
	});

	it("should call onChange prop only when values change", async () => {
		const function_ = jest.fn();

		const { getByTestId, getAllByTestId } = render(
			<SelectRecipient profile={profile} onChange={function_} address="D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getAllByTestId("RecipientListItem__select-button")[profile.wallets().values().length];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(() => expect(getByTestId("modal__inner")).toBeFalsy());

		const selectedAddressValue = profile.contacts().values()[0].addresses().values()[0].address();

		expect(getByTestId("SelectDropdown__input")).toHaveValue(selectedAddressValue);
		expect(function_).not.toBeCalled();
	});

	it("should filter recipients list by network if provided", async () => {
		const function_ = jest.fn();

		const [wallet] = profile.wallets().findByCoinWithNetwork("ARK", "ark.devnet");

		const { getByTestId, getAllByTestId } = render(
			<SelectRecipient
				profile={profile}
				onChange={function_}
				address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT"
				network={wallet.coin().network()}
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		await act(async () => {
			fireEvent.click(getByTestId("SelectRecipient__select-recipient"));

			expect(() => getAllByTestId("RecipientListItem__select-button").toThrow());
		});
	});
});
