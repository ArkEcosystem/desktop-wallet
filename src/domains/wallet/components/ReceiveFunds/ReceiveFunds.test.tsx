import React from "react";
import { fireEvent, render, waitFor } from "testing-library";

// i18n
import { ReceiveFunds } from "./ReceiveFunds";

describe("ReceiveFunds", () => {
	it("should not render if not open", async () => {
		const { asFragment, queryAllByTestId } = render(<ReceiveFunds address="abc" icon="Ark" />);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(0));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without a wallet name", async () => {
		const { asFragment, queryAllByTestId } = render(<ReceiveFunds isOpen={true} address="abc" icon="Ark" />);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a wallet name", async () => {
		const { asFragment, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="Ark" name="My Wallet" />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(2));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle close", async () => {
		const handleClose = jest.fn();

		const { getByTestId, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="Ark" handleClose={handleClose} />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(handleClose).toHaveBeenCalled();
	});
});
