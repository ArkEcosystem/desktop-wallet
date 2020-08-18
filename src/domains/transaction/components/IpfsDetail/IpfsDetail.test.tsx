import { BigNumber } from "@arkecosystem/platform-sdk-support";
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
			<IpfsDetail
				isOpen={false}
				transaction={{
					...TransactionFixture,
					data: {
						asset: {
							ipfs: "QmPRqPTEEwx95WNcSsk6YQk7aGW9hoZbTF9zE92dBj9H68",
						},
						blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
					},
				}}
				{...extraProps}
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<IpfsDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					data: {
						asset: {
							ipfs: "QmPRqPTEEwx95WNcSsk6YQk7aGW9hoZbTF9zE92dBj9H68",
						},
						blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
					},
				}}
				{...extraProps}
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
					confirmations: () => BigNumber.make(52),
					data: {
						asset: {
							ipfs: "QmPRqPTEEwx95WNcSsk6YQk7aGW9hoZbTF9zE92dBj9H68",
						},
						blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
					},
				}}
				{...extraProps}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_IPFS_DETAIL.TITLE);
		expect(getByText("Well Confirmed")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
