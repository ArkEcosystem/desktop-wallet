import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../i18n";
import { SecondSignatureDetail } from "./SecondSignatureDetail";

describe("SecondSignatureDetail", () => {
	const extraProps = {
		ticker: "BTC",
		walletAlias: "Wallet 1",
	};

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<SecondSignatureDetail isOpen={false} transaction={TransactionFixture} {...extraProps} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<SecondSignatureDetail isOpen={true} transaction={TransactionFixture} {...extraProps} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SECOND_SIGNATURE_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal without a wallet alias", () => {
		const { asFragment, getByTestId } = render(
			<SecondSignatureDetail isOpen={true} transaction={TransactionFixture} ticker="BTC" />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SECOND_SIGNATURE_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as confirmed", () => {
		const { asFragment, getByText, getByTestId } = render(
			<SecondSignatureDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isConfirmed: () => true,
				}}
				{...extraProps}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SECOND_SIGNATURE_DETAIL.TITLE);
		expect(getByText("Well Confirmed")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
