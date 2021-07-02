import React from "react";
import { render, waitFor } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../i18n";
import { MultiPaymentDetail } from "./MultiPaymentDetail";

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
		const { asFragment, getByText, getByTestId } = render(
			<MultiPaymentDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					blockId: () => "adsad12312xsd1w312e1s13203e12",
					isConfirmed: () => true,
					recipients: () => [
						{
							address: "adsad12312xsd1w312e1s13203e12",
							amount: 200,
						},
						{
							address: "adsad12312xsd1w312e1s13203e13",
							amount: 1990,
						},
						{
							address: "adsad12312xsd1w312e1s13203e14",
							amount: 1990,
						},
					],
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);

		await waitFor(() => expect(getByText(translations.WELL_CONFIRMED)).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});
});
