import { fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

// i18n
import { ReceiveFunds } from "./ReceiveFunds";

describe("ReceiveFunds", () => {
	const wallet = {
		coinIcon: "Ark",
		avatarId: "test",
		address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
	};

	it("should not render if not open", () => {
		const { asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<ReceiveFunds />
			</I18nextProvider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without a wallet name", () => {
		const { asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<ReceiveFunds isOpen={true} wallet={wallet} />
			</I18nextProvider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a wallet name", () => {
		const { asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<ReceiveFunds
					isOpen={true}
					wallet={{
						...wallet,
						walletName: "My Wallet",
					}}
				/>
			</I18nextProvider>,
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
