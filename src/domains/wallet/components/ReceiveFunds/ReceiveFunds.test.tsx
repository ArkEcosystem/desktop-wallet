/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { ReceiveFunds } from "./ReceiveFunds";

describe("ReceiveFunds", () => {
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

	it("should open qr code form", async () => {
		const { getByTestId, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="ARK" network="ark.devnet" />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		fireEvent.click(getByTestId("ReceiveFunds__toggle"));

		await waitFor(() => expect(getByTestId("ReceiveFundsForm__amount")).toHaveValue(""));
		await waitFor(() => expect(getByTestId("ReceiveFundsForm__smartbridge")).toHaveValue(""));
		await waitFor(() => expect(getByTestId("ReceiveFundsForm__uri")).toHaveTextContent("ark:abc"));
	});

	it("should show alert if smartbridge value is too long", async () => {
		const { getByTestId, findByText, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="ARK" network="ark.devnet" />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		fireEvent.click(getByTestId("ReceiveFunds__toggle"));

		await act(async () => {
			fireEvent.input(getByTestId("ReceiveFundsForm__smartbridge"), {
				target: {
					value: Array(300).fill("x").join(""),
				},
			});
		});

		expect(
			await findByText(/Please note that you have exceeded the number of characters allowed/),
		).toBeInTheDocument();
	});
});
