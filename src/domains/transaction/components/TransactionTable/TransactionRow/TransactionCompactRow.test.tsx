import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import * as utils from "utils/electron-utils";
import { fireEvent, renderWithRouter } from "utils/testing-library";

import { TransactionCompactRow } from "./TransactionCompactRow";

describe("TransactionCompactRow", () => {
	it("should show transaction", () => {
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionCompactRow transaction={TransactionFixture} />
				</tbody>
			</table>,
		);
		expect(getByTestId("TransactionRowMode")).toBeTruthy();
		expect(getByTestId("address__wallet-address")).toBeTruthy();
		expect(getByTestId("TransactionRowAmount")).toBeTruthy();
	});

	it("should show transaction with custom icons size", () => {
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionCompactRow transaction={TransactionFixture} iconSize="sm" />
				</tbody>
			</table>,
		);
		expect(getByTestId("TransactionRowMode")).toBeTruthy();
		expect(getByTestId("address__wallet-address")).toBeTruthy();
		expect(getByTestId("TransactionRowAmount")).toBeTruthy();
	});

	it.each(["light", "dark"])("should set %s shadow color on mouse events", (theme) => {
		jest.spyOn(utils, "shouldUseDarkColors").mockImplementation(() => theme === "dark");

		const setState = jest.fn();
		const useStateSpy = jest.spyOn(React, "useState");

		useStateSpy.mockImplementation((state) => [state, setState]);

		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionCompactRow transaction={TransactionFixture} />
				</tbody>
			</table>,
		);

		fireEvent.mouseEnter(getByTestId("TableRow"));
		fireEvent.mouseLeave(getByTestId("TableRow"));

		expect(setState).toHaveBeenCalledWith(theme === "dark" ? "--theme-black" : "--theme-color-secondary-100");
		expect(setState).toHaveBeenCalledWith("");
	});
});
