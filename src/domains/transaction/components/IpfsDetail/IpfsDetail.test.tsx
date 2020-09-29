import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../i18n";
import { IpfsDetail } from "./IpfsDetail";

describe("IpfsDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<IpfsDetail isOpen={false} transaction={TransactionFixture} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<IpfsDetail isOpen={true} transaction={TransactionFixture} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_IPFS_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal without a wallet alias", () => {
		const { asFragment, getByTestId } = render(
			<IpfsDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					wallet: () => ({
						...TransactionFixture.wallet(),
						alias: () => undefined,
					}),
				}}
			/>,
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
					confirmations: () => BigNumber.ONE,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_IPFS_DETAIL.TITLE);
		expect(getByText(translations.WELL_CONFIRMED)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
