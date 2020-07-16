import React from "react";
import { fireEvent, render } from "testing-library";

// i18n
import { ReceiveFunds } from "./ReceiveFunds";

const wallet = {
	coinIcon: "Ark",
	avatarId: "test",
	address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
};

describe("ReceiveFunds", () => {
	it("should not render if not open", () => {
		const { asFragment } = render(<ReceiveFunds />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without a wallet name", () => {
		const { asFragment } = render(<ReceiveFunds isOpen={true} wallet={wallet} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a wallet name", () => {
		const { asFragment } = render(
			<ReceiveFunds
				isOpen={true}
				wallet={{
					...wallet,
					walletName: "My Wallet",
				}}
			/>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle close", () => {
		const handleClose = jest.fn();

		const { getByTestId } = render(<ReceiveFunds isOpen={true} handleClose={handleClose} />);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(handleClose).toHaveBeenCalled();
	});
});
