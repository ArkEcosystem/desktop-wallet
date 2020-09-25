import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render, waitFor } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../i18n";
import { MultiPaymentDetail } from "./MultiPaymentDetail";

const wallet = {
	alias: () => "Test Wallet",
	currency: () => "ARK",
	exchangeCurrency: () => "BTC",
};

describe("MultiPaymentDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<MultiPaymentDetail
				isOpen={false}
				transaction={{
					...TransactionFixture,
					blockId: () => "adsad12312xsd1w312e1s13203e12",
					wallet: () => wallet,
				}}
				ticker="BTC"
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<MultiPaymentDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					blockId: () => "adsad12312xsd1w312e1s13203e12",
					wallet: () => wallet,
				}}
				ticker="BTC"
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with wallet alias", () => {
		const { asFragment, getByText, getByTestId } = render(
			<MultiPaymentDetail
				isOpen={true}
				onClose={() => console.log("onClose")}
				transaction={{
					...TransactionFixture,
					isSent: () => false,
					blockId: () => "adsad12312xsd1w312e1s13203e12",
					wallet: () => wallet,
				}}
				walletAlias="D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD"
				ticker="BTC"
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as confirmed", () => {
		const { asFragment, getByText, getByTestId } = render(
			<MultiPaymentDetail
				isOpen={true}
				onClose={() => console.log("onClose")}
				transaction={{
					...TransactionFixture,
					isConfirmed: () => true,
					blockId: () => "adsad12312xsd1w312e1s13203e12",
					wallet: () => wallet,
				}}
				ticker="BTC"
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);

		waitFor(() => expect(getByText("Well Confirmed")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with recipients", () => {
		const { asFragment, getByText, getByTestId } = render(
			<MultiPaymentDetail
				isOpen={true}
				onClose={() => console.log("onClose")}
				transaction={{
					...TransactionFixture,
					isConfirmed: () => true,
					recipients: () => [
						{
							address: "adsad12312xsd1w312e1s13203e12",
							amount: BigNumber.make(200),
						},
						{
							address: "adsad12312xsd1w312e1s13203e13",
							amount: BigNumber.make(1990),
						},
						{
							address: "adsad12312xsd1w312e1s13203e14",
							amount: BigNumber.make(1990),
						},
					],
					blockId: () => "adsad12312xsd1w312e1s13203e12",
					wallet: () => wallet,
				}}
				ticker="BTC"
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		waitFor(() => expect(getByText("Well Confirmed")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});
});
