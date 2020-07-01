import React from "react";
import { act, fireEvent, render, within } from "test-utils";

import { WalletHeader } from "./WalletHeader";

describe("WalletHeader", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<WalletHeader address="abc" balance="0" coin="Ark" />);
		expect(() => getByTestId("WalletHeader__currency-balance")).toThrowError();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit actions", () => {
		const onSend = jest.fn();
		const onStar = jest.fn();
		const onCopy = jest.fn();

		const { getByTestId } = render(
			<WalletHeader address="abc" balance="0" coin="Ark" onCopy={onCopy} onStar={onStar} onSend={onSend} />,
		);
		fireEvent.click(getByTestId("WalletHeader__copy-button"));
		fireEvent.click(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__toggle"));
		fireEvent.click(getByTestId("WalletHeader__star-button"));
		fireEvent.click(getByTestId("WalletHeader__send-button"));

		expect(onSend).toHaveBeenCalled();
		expect(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__content")).toBeTruthy();
		expect(onStar).toHaveBeenCalled();
		expect(onCopy).toHaveBeenCalled();
	});

	it("should show modifiers", () => {
		const { getByTestId, asFragment } = render(
			<WalletHeader hasStarred isLedger isMultisig address="abc" balance="0" coin="Ark" />,
		);
		expect(getByTestId("WalletHeader__ledger")).toBeTruthy();
		expect(getByTestId("WalletHeader__multisig")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete wallet", () => {
		const consoleSpy = jest.spyOn(console, "log").mockImplementation();

		const { getByTestId, asFragment } = render(
			<WalletHeader hasStarred isLedger isMultisig address="abc" balance="0" coin="Ark" />,
		);

		fireEvent.click(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__toggle"));
		fireEvent.click(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__option--3"));

		expect(consoleSpy).toHaveBeenCalledWith({ label: "Delete", value: "delete" });
		consoleSpy.mockReset();

		fireEvent.click(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__toggle"));
		fireEvent.click(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__option--2"));

		expect(consoleSpy).not.toHaveBeenCalled();
		expect(asFragment()).toMatchSnapshot();

		consoleSpy.mockRestore();
	});

	it("should show publicKey", () => {
		const address = "abc";
		const publicKey = "123";
		const { getByTestId, asFragment } = render(
			<WalletHeader currencyBalance="10" publicKey={publicKey} address={address} balance="0" coin="Ark" />,
		);

		expect(getByTestId("WalletHeader__balance")).toBeTruthy();
		expect(getByTestId("WalletHeader__currency-balance")).toBeTruthy();
		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(address);

		act(() => {
			fireEvent.click(getByTestId("WalletHeader__toggle"));
		});

		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(publicKey);
		expect(() => getByTestId("WalletHeader__balance")).toThrowError();
		expect(() => getByTestId("WalletHeader__currency-balance")).toThrowError();
		expect(asFragment()).toMatchSnapshot();
	});
});
