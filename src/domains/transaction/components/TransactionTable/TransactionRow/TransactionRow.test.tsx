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
		const { asFragment, queryAllByTestId, queryByText } = renderWithRouter(
			<table>
				<tbody>
					{/* @ts-ignore */}
					<TransactionRow
						transaction={{
							...fixture,
							// @ts-ignore
							wallet: () => ({
								currency: () => "BTC",
								isLedger: () => false,
								network: () => ({
									isTest: () => false,
								}),
							}),
						}}
						exchangeCurrency="BTC"
					/>
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(queryAllByTestId("AmountCrypto")).toHaveLength(2);
		expect(queryByText("N/A")).toBeNull();
	});

	it("should omit the currency for transactions from test networks", () => {
		const { asFragment, queryAllByTestId, getByText } = renderWithRouter(
			<table>
				<tbody>
					{/* @ts-ignore */}
					<TransactionRow
						transaction={{
							...fixture,
							// @ts-ignore
							wallet: () => ({
								currency: () => "BTC",
								isLedger: () => false,
								network: () => ({
									isTest: () => true,
								}),
							}),
						}}
						exchangeCurrency="BTC"
					/>
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(queryAllByTestId("AmountCrypto")).toHaveLength(1);
		expect(getByText("N/A")).toBeInTheDocument();
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
