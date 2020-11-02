import React from "react";
import { fireEvent, render, waitFor } from "testing-library";

import { ReceiveFunds } from "./ReceiveFunds";

describe("ReceiveFunds", () => {
	it("should not render if not open", async () => {
		const { asFragment, queryAllByTestId } = render(<ReceiveFunds address="abc" icon="ARK" network="ark.devnet" />);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(0));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without a wallet name", async () => {
		const { asFragment, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="ARK" network="ark.devnet" />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render qrcode without an address", async () => {
		// @ts-ignore
		const { asFragment, queryAllByTestId } = render(<ReceiveFunds isOpen={true} icon="ARK" network="ark.devnet" />);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(0));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a wallet name", async () => {
		const { asFragment, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="ARK" name="My Wallet" network="ark.devnet" />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(2));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle close", async () => {
		const onClose = jest.fn();

		const { getByTestId, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="ARK" network="ark.devnet" onClose={onClose} />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(onClose).toHaveBeenCalled();
	});
});
