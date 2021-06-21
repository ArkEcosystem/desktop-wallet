import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import { fireEvent, renderWithRouter } from "utils/testing-library";

import { TransactionRow } from "./TransactionRow";

describe("TransactionRow", () => {
	const fixture = {
		...TransactionFixture,
		wallet: () => ({
			...TransactionFixture.wallet(),
			currency: () => "DARK",
		}),
	};

	it("should show transaction", () => {
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow
						// @ts-ignore
						transaction={fixture}
					/>
				</tbody>
			</table>,
		);
		expect(getByTestId("TransactionRow__ID")).toBeTruthy();
		expect(getByTestId("TransactionRow__timestamp")).toBeTruthy();
		expect(getByTestId("TransactionRowMode")).toBeTruthy();
		expect(getByTestId("Address__address")).toBeTruthy();
		expect(getByTestId("TransactionRowInfo")).toBeTruthy();
		expect(getByTestId("TransactionRowConfirmation")).toBeTruthy();
		expect(getByTestId("AmountCrypto")).toBeTruthy();
	});

	it("should show transaction with currency", () => {
		const { getAllByTestId } = renderWithRouter(
			<table>
				<tbody>
					{/* @ts-ignore */}
					<TransactionRow transaction={fixture} exchangeCurrency="BTC" />
				</tbody>
			</table>,
		);
		const amounts = getAllByTestId("AmountCrypto");
		expect(amounts).toHaveLength(2);
	});

	it("should show transaction with signature pending", () => {
		const onSign = jest.fn();

		const isMultiSignatureRegistrationMock = jest
			.spyOn(fixture, "isMultiSignatureRegistration")
			.mockReturnValue(true);
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow
						// @ts-ignore
						transaction={fixture}
						exchangeCurrency="BTC"
						onSign={onSign}
						showSignColumn
					/>
				</tbody>
			</table>,
		);
		fireEvent.click(getByTestId("TransactionRow__sign"));
		expect(onSign).toHaveBeenCalled();
		isMultiSignatureRegistrationMock.mockRestore();
	});
});
