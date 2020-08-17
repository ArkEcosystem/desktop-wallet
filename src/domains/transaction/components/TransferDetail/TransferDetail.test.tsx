import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";
// i18n
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../i18n";
import { TransferDetail } from "./TransferDetail";

describe("TransferDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<TransferDetail
				isOpen={false}
				onClose={() => console.log("onClose")}
				transaction={{ ...TransactionFixture, data: { blockId: "adsad12312xsd1w312e1s13203e12" } }}
				ticker="BTC"
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<TransferDetail
				isOpen={true}
				onClose={() => console.log("onClose")}
				transaction={{ ...TransactionFixture, data: { blockId: "adsad12312xsd1w312e1s13203e12" } }}
				ticker="BTC"
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as confirmed", () => {
		const { asFragment, getByText, getByTestId } = render(
			<TransferDetail
				isOpen={true}
				onClose={() => console.log("onClose")}
				transaction={{
					...TransactionFixture,
					confirmations: () => BigNumber.make(52),
					data: { blockId: "adsad12312xsd1w312e1s13203e12" },
				}}
				ticker="BTC"
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(getByText("Well Confirmed")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as not is sent", () => {
		const { asFragment, getByText, getByTestId } = render(
			<TransferDetail
				isOpen={true}
				onClose={() => console.log("onClose")}
				transaction={{
					...TransactionFixture,
					isSent: () => false,
					data: { blockId: "adsad12312xsd1w312e1s13203e12" },
				}}
				ticker="BTC"
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with wallet alias", () => {
		const { asFragment, getByText, getByTestId } = render(
			<TransferDetail
				isOpen={true}
				onClose={() => console.log("onClose")}
				transaction={{
					...TransactionFixture,
					isSent: () => false,
					data: { blockId: "adsad12312xsd1w312e1s13203e12" },
				}}
				walletAlias="D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD"
				ticker="BTC"
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
