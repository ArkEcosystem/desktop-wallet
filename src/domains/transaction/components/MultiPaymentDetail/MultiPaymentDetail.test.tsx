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
	isDelegate: () => true,
	isResignedDelegate: () => false,
};

describe("MultiPaymentDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<MultiPaymentDetail
				isOpen={false}
				transaction={{
					...TransactionFixture,
					blockId: () => "adsad12312xsd1w312e1s13203e12",
				}}
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
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with recipients", async () => {
		const { asFragment, getByText, getByTestId, getAllByTestId } = render(
			<MultiPaymentDetail
				isOpen={true}
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
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		await waitFor(() => expect(getByText(translations.WELL_CONFIRMED)).toBeTruthy());

		expect(getAllByTestId("Amount")[0]).toHaveTextContent(`200 ARK`);
		expect(getAllByTestId("Amount")[1]).toHaveTextContent(`1,990 ARK`);
		expect(getAllByTestId("Amount")[2]).toHaveTextContent(`1,990 ARK`);

		expect(asFragment()).toMatchSnapshot();
	});
});
