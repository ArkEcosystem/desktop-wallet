import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

// i18n
import { translations } from "../../i18n";
import { IpfsDetail } from "./IpfsDetail";

describe("IpfsDetail", () => {
	const extraProps = {
		ticker: "BTC",
		walletAlias: "Wallet 1",
	};

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<IpfsDetail isOpen={false} transaction={TransactionFixture} {...extraProps} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<IpfsDetail isOpen={true} transaction={TransactionFixture} {...extraProps} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_IPFS_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal without a wallet alias", () => {
		const { asFragment, getByTestId } = render(
			<IpfsDetail isOpen={true} transaction={TransactionFixture} ticker="BTC" />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_IPFS_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as confirmed", () => {
		const { asFragment, getByText, getByTestId } = render(
			<IpfsDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isConfirmed: () => true,
				}}
				{...extraProps}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_IPFS_DETAIL.TITLE);
		expect(getByText("Well Confirmed")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
