import { render, screen } from "@testing-library/react";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";

import { TransactionRowAmount } from "./TransactionRowAmount";

describe("TransactionRowAmount", () => {
	it("should show total", () => {
		render(
			<TransactionRowAmount transaction={{ ...TransactionFixture, wallet: () => ({ currency: () => "ARK" }) }} />,
		);

		expect(screen.getByText("- 121 ARK")).toBeTruthy();
	});

	it("should show total as currency", () => {
		render(
			<TransactionRowAmount
				transaction={{ ...TransactionFixture, wallet: () => ({ currency: () => "ARK" }) }}
				exchangeCurrency="BTC"
			/>,
		);

		expect(screen.getByText("0 BTC")).toBeTruthy();
	});

	it("should show as received", () => {
		const { asFragment } = render(
			<TransactionRowAmount
				transaction={{ ...TransactionFixture, isSent: () => false, wallet: () => ({ currency: () => "ARK" }) }}
			/>,
		);

		expect(screen.getByText("+ 121 ARK")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
