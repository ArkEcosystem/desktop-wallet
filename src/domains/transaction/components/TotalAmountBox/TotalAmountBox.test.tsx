import { render, screen } from "@testing-library/react";
import React from "react";

import { TotalAmountBox } from "./TotalAmountBox";

describe("TotalAmountBox", () => {
	it.each([
		[0.1, 0.01],
		["0.1", "0.01"],
		[Number(0.1), Number(0.01)],
		[Number("0.1"), Number("0.01")],
	])("should render with amount of %s and fee of %s", (a: any, b: any) => {
		const { asFragment } = render(<TotalAmountBox amount={a} fee={b} ticker="ARK" />);

		const [amount, fee, total] = screen.getAllByTestId("AmountCrypto");

		expect(amount).toHaveTextContent("0.1 ARK");
		expect(fee).toHaveTextContent("0.01 ARK");
		expect(total).toHaveTextContent("0.11 ARK");
		expect(asFragment()).toMatchSnapshot();
	});
});
